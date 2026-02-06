import { ref, computed, type Ref, type ComputedRef } from 'vue'
import type { Rack, SlotPosition, WellPlateFormat, Well } from '../types'

export interface UseRackEditorOptions {
  defaultFormat?: WellPlateFormat
  defaultInjectionVolume?: number
  maxRacks?: number
  minRacks?: number
}

export interface UseRackEditorReturn {
  racks: Ref<Rack[]>
  activeRack: ComputedRef<Rack | undefined>
  activeRackId: Ref<string>

  addRack(name?: string): Rack
  removeRack(rackId: string): void
  reorderRacks(fromIndex: number, toIndex: number): void
  updateRack(rackId: string, data: Partial<Rack>): void
  setActiveRack(rackId: string): void

  setWellData(rackId: string, wellId: string, data: Partial<Well>): void
  clearWell(rackId: string, wellId: string): void
  clearAllWells(rackId: string): void
  fillSeries(rackId: string, prefix?: string): void

  getAllWells(): Array<{ rackId: string; wellId: string; well: Partial<Well> }>
  totalSampleCount: ComputedRef<number>
  reset(): void
}

const SLOT_CYCLE: SlotPosition[] = ['R', 'G', 'B', 'Y']

const PLATE_CONFIGS: Record<WellPlateFormat, { rows: number; cols: number }> = {
  6: { rows: 2, cols: 3 },
  12: { rows: 3, cols: 4 },
  24: { rows: 4, cols: 6 },
  48: { rows: 6, cols: 8 },
  54: { rows: 6, cols: 9 },
  96: { rows: 8, cols: 12 },
  384: { rows: 16, cols: 24 },
}

let globalIdCounter = 0

function generateId(): string {
  globalIdCounter++
  return `rack-${Date.now()}-${globalIdCounter}`
}

export function useRackEditor(
  initialRacks?: Rack[],
  options?: UseRackEditorOptions,
): UseRackEditorReturn {
  const defaultFormat = options?.defaultFormat ?? 54
  const defaultInjVol = options?.defaultInjectionVolume ?? 5
  const maxRacks = options?.maxRacks ?? 10
  const minRacks = options?.minRacks ?? 1

  function createDefaultRack(name?: string, slotIndex?: number): Rack {
    const slot = SLOT_CYCLE[(slotIndex ?? 0) % SLOT_CYCLE.length]!
    return {
      id: generateId(),
      name: name ?? `Rack ${racks.value.length + 1}`,
      format: defaultFormat,
      slot,
      injectionVolume: defaultInjVol,
      wells: {},
    }
  }

  const racks = ref<Rack[]>(
    initialRacks && initialRacks.length > 0
      ? initialRacks.map(r => ({ ...r }))
      : [createDefaultRack('Rack 1', 0)]
  ) as Ref<Rack[]>

  const activeRackId = ref<string>(racks.value[0]?.id ?? '')

  const activeRack = computed(() =>
    racks.value.find(r => r.id === activeRackId.value) ?? racks.value[0]
  )

  function addRack(name?: string): Rack {
    if (racks.value.length >= maxRacks) {
      return racks.value[racks.value.length - 1]!
    }
    const rack = createDefaultRack(name, racks.value.length)
    racks.value.push(rack)
    activeRackId.value = rack.id
    return rack
  }

  function removeRack(rackId: string): void {
    if (racks.value.length <= minRacks) return
    const index = racks.value.findIndex(r => r.id === rackId)
    if (index === -1) return
    racks.value.splice(index, 1)
    if (activeRackId.value === rackId && racks.value[0]) {
      activeRackId.value = racks.value[0].id
    }
  }

  function reorderRacks(fromIndex: number, toIndex: number): void {
    if (fromIndex < 0 || fromIndex >= racks.value.length) return
    if (toIndex < 0 || toIndex >= racks.value.length) return
    if (fromIndex === toIndex) return
    const [moved] = racks.value.splice(fromIndex, 1)
    if (moved) {
      racks.value.splice(toIndex, 0, moved)
    }
  }

  function updateRack(rackId: string, data: Partial<Rack>): void {
    const rack = racks.value.find(r => r.id === rackId)
    if (!rack) return
    if (data.name !== undefined) rack.name = data.name
    if (data.format !== undefined) rack.format = data.format
    if (data.slot !== undefined) rack.slot = data.slot
    if (data.injectionVolume !== undefined) rack.injectionVolume = data.injectionVolume
    if (data.wells !== undefined) rack.wells = data.wells
  }

  function setActiveRack(rackId: string): void {
    if (racks.value.some(r => r.id === rackId)) {
      activeRackId.value = rackId
    }
  }

  function setWellData(rackId: string, wellId: string, data: Partial<Well>): void {
    const rack = racks.value.find(r => r.id === rackId)
    if (!rack) return
    rack.wells[wellId] = { ...rack.wells[wellId], ...data }
  }

  function clearWell(rackId: string, wellId: string): void {
    const rack = racks.value.find(r => r.id === rackId)
    if (!rack) return
    delete rack.wells[wellId]
  }

  function clearAllWells(rackId: string): void {
    const rack = racks.value.find(r => r.id === rackId)
    if (!rack) return
    rack.wells = {}
  }

  function fillSeries(rackId: string, prefix: string = 'S'): void {
    const rack = racks.value.find(r => r.id === rackId)
    if (!rack) return

    const config = PLATE_CONFIGS[rack.format]
    if (!config) return

    let counter = 1
    for (let row = 0; row < config.rows; row++) {
      for (let col = 0; col < config.cols; col++) {
        const rowLabel = String.fromCharCode(65 + row)
        const wellId = `${rowLabel}${col + 1}`
        // Only fill empty wells
        if (!rack.wells[wellId]?.sampleType) {
          const paddedNum = String(counter).padStart(3, '0')
          rack.wells[wellId] = {
            id: wellId,
            row,
            col,
            state: 'filled',
            sampleType: 'sample',
            metadata: {
              label: `${prefix}${paddedNum}`,
              injectionVolume: rack.injectionVolume,
              injectionCount: 1,
            },
          }
        }
        counter++
      }
    }
  }

  function getAllWells(): Array<{ rackId: string; wellId: string; well: Partial<Well> }> {
    const result: Array<{ rackId: string; wellId: string; well: Partial<Well> }> = []
    for (const rack of racks.value) {
      for (const [wellId, well] of Object.entries(rack.wells)) {
        result.push({ rackId: rack.id, wellId, well })
      }
    }
    return result
  }

  const totalSampleCount = computed(() => {
    let count = 0
    for (const rack of racks.value) {
      count += Object.keys(rack.wells).length
    }
    return count
  })

  function reset(): void {
    racks.value = [createDefaultRack('Rack 1', 0)]
    activeRackId.value = racks.value[0]!.id
  }

  return {
    racks,
    activeRack,
    activeRackId,
    addRack,
    removeRack,
    reorderRacks,
    updateRack,
    setActiveRack,
    setWellData,
    clearWell,
    clearAllWells,
    fillSeries,
    getAllWells,
    totalSampleCount,
    reset,
  }
}
