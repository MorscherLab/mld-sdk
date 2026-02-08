import type { TimeRange } from '../types/components'

export function parseTime(time: string): { hour: number; minute: number } {
  const [h, m] = time.split(':').map(Number)
  return { hour: h, minute: m }
}

export function formatTime(hour: number, minute: number, format: '12h' | '24h' = '24h'): string {
  if (format === '24h') {
    return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`
  }
  const period = hour >= 12 ? 'PM' : 'AM'
  const h12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour
  return `${h12}:${String(minute).padStart(2, '0')} ${period}`
}

export function generateTimeSlots(start: string, end: string, stepMinutes: number): string[] {
  const slots: string[] = []
  const s = parseTime(start)
  const e = parseTime(end)
  const startMin = s.hour * 60 + s.minute
  const endMin = e.hour * 60 + e.minute

  for (let m = startMin; m <= endMin; m += stepMinutes) {
    const hour = Math.floor(m / 60)
    const minute = m % 60
    if (hour >= 24) break
    slots.push(formatTime(hour, minute))
  }
  return slots
}

export function rangesOverlap(a: TimeRange, b: TimeRange): boolean {
  const aStart = toMinutes(a.start)
  const aEnd = toMinutes(a.end)
  const bStart = toMinutes(b.start)
  const bEnd = toMinutes(b.end)
  return aStart < bEnd && bStart < aEnd
}

export function durationMinutes(start: string, end: string): number {
  return toMinutes(end) - toMinutes(start)
}

export function formatDuration(minutes: number): string {
  if (minutes < 0) return '-' + formatDuration(-minutes)
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  if (h === 0) return `${m}m`
  if (m === 0) return `${h}h`
  return `${h}h ${m}m`
}

export function isTimeInRange(time: string, start: string, end: string): boolean {
  const t = toMinutes(time)
  return t >= toMinutes(start) && t <= toMinutes(end)
}

export function findAvailableSlots(
  dayStart: string,
  dayEnd: string,
  occupied: TimeRange[],
  minDuration: number,
): TimeRange[] {
  const sorted = [...occupied].sort((a, b) => toMinutes(a.start) - toMinutes(b.start))
  const available: TimeRange[] = []
  let cursor = toMinutes(dayStart)
  const end = toMinutes(dayEnd)

  for (const slot of sorted) {
    const slotStart = toMinutes(slot.start)
    const slotEnd = toMinutes(slot.end)
    if (slotStart > cursor && slotStart - cursor >= minDuration) {
      available.push({ start: fromMinutes(cursor), end: fromMinutes(slotStart) })
    }
    cursor = Math.max(cursor, slotEnd)
  }

  if (end > cursor && end - cursor >= minDuration) {
    available.push({ start: fromMinutes(cursor), end: fromMinutes(end) })
  }

  return available
}

export function snapToSlot(time: string, stepMinutes: number): string {
  const total = toMinutes(time)
  const snapped = Math.round(total / stepMinutes) * stepMinutes
  return fromMinutes(snapped)
}

export function addMinutes(time: string, minutes: number): string {
  const total = toMinutes(time) + minutes
  return fromMinutes(Math.max(0, Math.min(total, 24 * 60 - 1)))
}

export function compareTime(a: string, b: string): number {
  const ma = toMinutes(a)
  const mb = toMinutes(b)
  if (ma < mb) return -1
  if (ma > mb) return 1
  return 0
}

function toMinutes(time: string): number {
  const { hour, minute } = parseTime(time)
  return hour * 60 + minute
}

function fromMinutes(total: number): string {
  const hour = Math.floor(total / 60) % 24
  const minute = total % 60
  return formatTime(hour, minute)
}
