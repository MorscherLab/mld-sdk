import { ref, computed, onUnmounted, type Ref } from 'vue'
import type { ScheduleEvent } from '../types/components'

export type DragType = 'create' | 'resize-top' | 'resize-bottom' | 'move'

export interface DragState {
  type: DragType
  event?: ScheduleEvent
  startDate: Date
  startY: number
  currentY: number
  dayIndex: number
  currentDayIndex: number
}

export interface GhostEvent {
  start: Date
  end: Date
  dayIndex: number
  style: Record<string, string>
}

export interface UseScheduleDragOptions {
  slotDuration: Ref<number>
  dayStartHour: Ref<number>
  dayEndHour: Ref<number>
  readonly: Ref<boolean>
  slotHeight: Ref<number>
  blockedSlots?: Ref<{ start: string; end: string; label?: string }[]>
  onCreateComplete?: (start: Date, end: Date) => void
  onMoveComplete?: (event: ScheduleEvent, newStart: Date, newEnd: Date) => void
  onResizeComplete?: (event: ScheduleEvent, newStart: Date, newEnd: Date) => void
}

export function useScheduleDrag(options: UseScheduleDragOptions) {
  const isDragging = ref(false)
  const dragState = ref<DragState | null>(null)

  const ghost = computed<GhostEvent | null>(() => {
    if (!dragState.value) return null
    const state = dragState.value
    const slotH = options.slotHeight.value
    const slotMin = options.slotDuration.value
    const dayStart = options.dayStartHour.value * 60

    if (state.type === 'create') {
      const deltaY = state.currentY - state.startY
      const startOffset = state.startY
      const endOffset = startOffset + deltaY

      const topPx = Math.min(startOffset, endOffset)
      const bottomPx = Math.max(startOffset, endOffset)

      const startMinutes = dayStart + Math.round((topPx / slotH) * slotMin)
      const endMinutes = dayStart + Math.round((bottomPx / slotH) * slotMin)

      const snappedStart = snapMinutes(startMinutes, slotMin)
      const snappedEnd = Math.max(snapMinutes(endMinutes, slotMin), snappedStart + slotMin)

      const snappedTopPx = ((snappedStart - dayStart) / slotMin) * slotH
      const snappedHeightPx = ((snappedEnd - snappedStart) / slotMin) * slotH

      return {
        start: minutesToDate(state.startDate, snappedStart),
        end: minutesToDate(state.startDate, snappedEnd),
        dayIndex: state.dayIndex,
        style: {
          top: `${snappedTopPx}px`,
          height: `${snappedHeightPx}px`,
        },
      }
    }

    if (state.type === 'move' && state.event) {
      const deltaY = state.currentY - state.startY
      const eventStart = dateToMinutes(new Date(state.event.start))
      const eventEnd = dateToMinutes(new Date(state.event.end))
      const duration = eventEnd - eventStart
      const pixelDelta = Math.round((deltaY / slotH) * slotMin)
      const newStart = snapMinutes(eventStart + pixelDelta, slotMin)
      const newEnd = newStart + duration

      const clamped = clampRange(newStart, newEnd, dayStart, options.dayEndHour.value * 60)
      const topPx = ((clamped.start - dayStart) / slotMin) * slotH
      const heightPx = ((clamped.end - clamped.start) / slotMin) * slotH

      return {
        start: minutesToDate(state.startDate, clamped.start),
        end: minutesToDate(state.startDate, clamped.end),
        dayIndex: state.currentDayIndex,
        style: {
          top: `${topPx}px`,
          height: `${heightPx}px`,
        },
      }
    }

    if ((state.type === 'resize-top' || state.type === 'resize-bottom') && state.event) {
      const eventStart = dateToMinutes(new Date(state.event.start))
      const eventEnd = dateToMinutes(new Date(state.event.end))
      const deltaY = state.currentY - state.startY
      const pixelDelta = Math.round((deltaY / slotH) * slotMin)

      let newStart = eventStart
      let newEnd = eventEnd

      if (state.type === 'resize-top') {
        newStart = snapMinutes(eventStart + pixelDelta, slotMin)
        newStart = Math.min(newStart, newEnd - slotMin)
      } else {
        newEnd = snapMinutes(eventEnd + pixelDelta, slotMin)
        newEnd = Math.max(newEnd, newStart + slotMin)
      }

      const clamped = clampRange(newStart, newEnd, dayStart, options.dayEndHour.value * 60)
      const topPx = ((clamped.start - dayStart) / slotMin) * slotH
      const heightPx = ((clamped.end - clamped.start) / slotMin) * slotH

      return {
        start: minutesToDate(state.startDate, clamped.start),
        end: minutesToDate(state.startDate, clamped.end),
        dayIndex: state.dayIndex,
        style: {
          top: `${topPx}px`,
          height: `${heightPx}px`,
        },
      }
    }

    return null
  })

  function startCreate(date: Date, y: number, dayIndex: number) {
    if (options.readonly.value) return
    isDragging.value = true
    dragState.value = {
      type: 'create',
      startDate: date,
      startY: y,
      currentY: y,
      dayIndex,
      currentDayIndex: dayIndex,
    }
    addListeners()
  }

  function startMove(event: ScheduleEvent, y: number, dayIndex: number) {
    if (options.readonly.value || event.draggable === false) return
    isDragging.value = true
    dragState.value = {
      type: 'move',
      event,
      startDate: new Date(event.start),
      startY: y,
      currentY: y,
      dayIndex,
      currentDayIndex: dayIndex,
    }
    addListeners()
  }

  function startResize(event: ScheduleEvent, edge: 'top' | 'bottom', y: number, dayIndex: number) {
    if (options.readonly.value || event.resizable === false) return
    isDragging.value = true
    dragState.value = {
      type: edge === 'top' ? 'resize-top' : 'resize-bottom',
      event,
      startDate: new Date(event.start),
      startY: y,
      currentY: y,
      dayIndex,
      currentDayIndex: dayIndex,
    }
    addListeners()
  }

  function onPointerMove(e: PointerEvent) {
    if (!dragState.value) return
    dragState.value = { ...dragState.value, currentY: e.clientY }
  }

  function onPointerUp() {
    if (!dragState.value || !ghost.value) {
      cleanup()
      return
    }

    const g = ghost.value
    const state = dragState.value

    if (state.type === 'create' && options.onCreateComplete) {
      options.onCreateComplete(g.start, g.end)
    } else if (state.type === 'move' && state.event && options.onMoveComplete) {
      options.onMoveComplete(state.event, g.start, g.end)
    } else if ((state.type === 'resize-top' || state.type === 'resize-bottom') && state.event && options.onResizeComplete) {
      options.onResizeComplete(state.event, g.start, g.end)
    }

    cleanup()
  }

  function addListeners() {
    document.addEventListener('pointermove', onPointerMove)
    document.addEventListener('pointerup', onPointerUp)
  }

  function cleanup() {
    isDragging.value = false
    dragState.value = null
    document.removeEventListener('pointermove', onPointerMove)
    document.removeEventListener('pointerup', onPointerUp)
  }

  onUnmounted(cleanup)

  return {
    isDragging,
    dragState,
    ghost,
    startCreate,
    startMove,
    startResize,
  }
}

function snapMinutes(minutes: number, step: number): number {
  return Math.round(minutes / step) * step
}

function dateToMinutes(date: Date): number {
  return date.getHours() * 60 + date.getMinutes()
}

function minutesToDate(baseDate: Date, minutes: number): Date {
  const d = new Date(baseDate)
  d.setHours(Math.floor(minutes / 60), minutes % 60, 0, 0)
  return d
}

function clampRange(start: number, end: number, min: number, max: number) {
  const s = Math.max(start, min)
  const e = Math.min(end, max)
  return { start: s, end: Math.max(e, s) }
}
