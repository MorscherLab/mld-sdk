import { ref, computed, type ComputedRef } from 'vue'
import type {
  PlateMapEditorState,
  PlateMap,
  SampleType,
  WellPlateFormat,
} from '../types'

const DEFAULT_PALETTE = [
  '#3B82F6', // blue
  '#10B981', // green
  '#EF4444', // red
  '#F59E0B', // amber
  '#8B5CF6', // purple
  '#F97316', // orange
  '#06B6D4', // cyan
  '#14B8A6', // teal
  '#6B7280', // gray
]

const MAX_HISTORY = 50

interface HistoryEntry {
  plates: PlateMap[]
  samples: SampleType[]
}

export interface UseWellPlateEditorOptions {
  maxHistory?: number
  defaultFormat?: WellPlateFormat
}

export interface UseWellPlateEditorReturn {
  state: ComputedRef<PlateMapEditorState>
  plates: ComputedRef<PlateMap[]>
  activePlate: ComputedRef<PlateMap | undefined>
  samples: ComputedRef<SampleType[]>
  selectedWells: ComputedRef<string[]>
  activeSampleId: ComputedRef<string | undefined>
  canUndo: ComputedRef<boolean>
  canRedo: ComputedRef<boolean>
  setActivePlate: (plateId: string) => void
  setActiveSample: (sampleId: string | undefined) => void
  setSelectedWells: (wellIds: string[]) => void
  addPlate: (name?: string, format?: WellPlateFormat) => PlateMap
  removePlate: (plateId: string) => void
  addSample: (name: string, color?: string) => SampleType
  removeSample: (sampleId: string) => void
  assignSample: (wellIds: string[], sampleId: string | undefined) => void
  clearWells: (wellIds: string[]) => void
  undo: () => void
  redo: () => void
  exportData: (format: 'json' | 'csv') => string
  importData: (data: string, format: 'json' | 'csv') => boolean
  reset: () => void
}

function createEmptyPlate(
  name: string,
  format: WellPlateFormat,
  id?: string
): PlateMap {
  return {
    id: id || `plate-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    name,
    format,
    wells: {},
  }
}

function generateSampleId(): string {
  return `sample-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

export function useWellPlateEditor(
  initialState?: Partial<PlateMapEditorState>,
  options: UseWellPlateEditorOptions = {}
): UseWellPlateEditorReturn {
  const { maxHistory = MAX_HISTORY, defaultFormat = 96 } = options

  const defaultPlate = createEmptyPlate('Plate 1', defaultFormat)

  const internalState = ref<PlateMapEditorState>({
    plates: initialState?.plates || [defaultPlate],
    activePlateId: initialState?.activePlateId || defaultPlate.id,
    samples: initialState?.samples || [],
    selectedWells: initialState?.selectedWells || [],
    activeSampleId: initialState?.activeSampleId,
  })

  const history = ref<HistoryEntry[]>([])
  const historyIndex = ref(-1)

  const state = computed(() => internalState.value)
  const plates = computed(() => internalState.value.plates)
  const activePlate = computed(() =>
    internalState.value.plates.find(p => p.id === internalState.value.activePlateId)
  )
  const samples = computed(() => internalState.value.samples)
  const selectedWells = computed(() => internalState.value.selectedWells)
  const activeSampleId = computed(() => internalState.value.activeSampleId)

  const canUndo = computed(() => historyIndex.value >= 0)
  const canRedo = computed(() => historyIndex.value < history.value.length - 1)

  function deepClone<T>(obj: T): T {
    return structuredClone(obj)
  }

  function saveToHistory() {
    const entry: HistoryEntry = {
      plates: deepClone(internalState.value.plates),
      samples: deepClone(internalState.value.samples),
    }

    if (historyIndex.value < history.value.length - 1) {
      history.value = history.value.slice(0, historyIndex.value + 1)
    }

    history.value.push(entry)

    if (history.value.length > maxHistory) {
      history.value.shift()
    } else {
      historyIndex.value++
    }
  }

  function setActivePlate(plateId: string) {
    if (internalState.value.plates.some(p => p.id === plateId)) {
      internalState.value.activePlateId = plateId
      internalState.value.selectedWells = []
    }
  }

  function setActiveSample(sampleId: string | undefined) {
    internalState.value.activeSampleId = sampleId
  }

  function setSelectedWells(wellIds: string[]) {
    internalState.value.selectedWells = wellIds
  }

  function addPlate(name?: string, format?: WellPlateFormat): PlateMap {
    saveToHistory()
    const plateNumber = internalState.value.plates.length + 1
    const plate = createEmptyPlate(
      name || `Plate ${plateNumber}`,
      format || defaultFormat
    )
    internalState.value.plates.push(plate)
    internalState.value.activePlateId = plate.id
    internalState.value.selectedWells = []
    return plate
  }

  function removePlate(plateId: string) {
    if (internalState.value.plates.length <= 1) return

    saveToHistory()
    const index = internalState.value.plates.findIndex(p => p.id === plateId)
    if (index === -1) return

    internalState.value.plates.splice(index, 1)
    if (internalState.value.activePlateId === plateId) {
      internalState.value.activePlateId = internalState.value.plates[0].id
      internalState.value.selectedWells = []
    }
  }

  function addSample(name: string, color?: string): SampleType {
    saveToHistory()
    const sample: SampleType = {
      id: generateSampleId(),
      name,
      color: color || DEFAULT_PALETTE[internalState.value.samples.length % DEFAULT_PALETTE.length],
      count: 0,
    }
    internalState.value.samples.push(sample)
    return sample
  }

  function removeSample(sampleId: string) {
    saveToHistory()
    const index = internalState.value.samples.findIndex(s => s.id === sampleId)
    if (index === -1) return

    internalState.value.samples.splice(index, 1)

    for (const plate of internalState.value.plates) {
      for (const well of Object.values(plate.wells)) {
        if (well.sampleType === sampleId) {
          delete well.sampleType
          well.state = 'empty'
        }
      }
    }

    if (internalState.value.activeSampleId === sampleId) {
      internalState.value.activeSampleId = undefined
    }

    updateSampleCounts()
  }

  function assignSample(wellIds: string[], sampleId: string | undefined) {
    if (wellIds.length === 0) return

    saveToHistory()
    const plate = activePlate.value
    if (!plate) return

    for (const wellId of wellIds) {
      const well = plate.wells[wellId] || {
        id: wellId,
        row: wellId.charCodeAt(0) - 65,
        col: parseInt(wellId.slice(1)) - 1,
        state: 'empty',
      }

      if (sampleId) {
        well.sampleType = sampleId
        well.state = 'filled'
      } else {
        delete well.sampleType
        well.state = 'empty'
      }

      plate.wells[wellId] = well
    }
    updateSampleCounts()
  }

  function clearWells(wellIds: string[]) {
    assignSample(wellIds, undefined)
  }

  function updateSampleCounts() {
    const counts: Record<string, number> = {}

    for (const plate of internalState.value.plates) {
      for (const well of Object.values(plate.wells)) {
        if (well.sampleType) {
          counts[well.sampleType] = (counts[well.sampleType] || 0) + 1
        }
      }
    }

    for (const sample of internalState.value.samples) {
      sample.count = counts[sample.id] || 0
    }
  }

  function undo() {
    if (!canUndo.value) return

    const entry = history.value[historyIndex.value]
    historyIndex.value--

    internalState.value.plates = deepClone(entry.plates)
    internalState.value.samples = deepClone(entry.samples)

    const activePlateExists = internalState.value.plates.some(p => p.id === internalState.value.activePlateId)
    if (!activePlateExists) {
      internalState.value.activePlateId = internalState.value.plates[0]?.id || ''
    }
    internalState.value.selectedWells = []
  }

  function redo() {
    if (!canRedo.value) return

    historyIndex.value++
    const entry = history.value[historyIndex.value]

    internalState.value.plates = deepClone(entry.plates)
    internalState.value.samples = deepClone(entry.samples)
    internalState.value.selectedWells = []
  }

  function exportData(format: 'json' | 'csv'): string {
    if (format === 'json') {
      return JSON.stringify({
        plates: internalState.value.plates,
        samples: internalState.value.samples,
      }, null, 2)
    }

    const sampleMap = new Map(internalState.value.samples.map(s => [s.id, s.name]))
    const rows = ['Plate,Well,Sample Type,Sample Name']

    for (const plate of internalState.value.plates) {
      for (const [wellId, well] of Object.entries(plate.wells)) {
        if (well.sampleType) {
          const sampleName = sampleMap.get(well.sampleType) || ''
          rows.push(`"${plate.name}","${wellId}","${well.sampleType}","${sampleName}"`)
        }
      }
    }

    return rows.join('\n')
  }

  function importData(data: string, format: 'json' | 'csv'): boolean {
    try {
      saveToHistory()

      if (format === 'json') {
        const parsed = JSON.parse(data)
        if (parsed.plates && Array.isArray(parsed.plates)) {
          internalState.value.plates = parsed.plates
          internalState.value.activePlateId = parsed.plates[0]?.id || ''
        }
        if (parsed.samples && Array.isArray(parsed.samples)) {
          internalState.value.samples = parsed.samples
        }
        internalState.value.selectedWells = []
        updateSampleCounts()
        return true
      }

      const lines = data.trim().split('\n')
      if (lines.length < 2) return false

      const plateMap = new Map<string, PlateMap>()
      const sampleMap = new Map<string, SampleType>()

      for (let i = 1; i < lines.length; i++) {
        const parts = lines[i].match(/(?:[^",]+|"[^"]*")+/g)
        if (!parts || parts.length < 4) continue

        const plateName = parts[0].replace(/^"|"$/g, '')
        const wellId = parts[1].replace(/^"|"$/g, '')
        const sampleId = parts[2].replace(/^"|"$/g, '')
        const sampleName = parts[3].replace(/^"|"$/g, '')

        if (!plateMap.has(plateName)) {
          plateMap.set(plateName, createEmptyPlate(plateName, defaultFormat))
        }

        if (sampleId && !sampleMap.has(sampleId)) {
          sampleMap.set(sampleId, {
            id: sampleId,
            name: sampleName || sampleId,
            color: DEFAULT_PALETTE[sampleMap.size % DEFAULT_PALETTE.length],
            count: 0,
          })
        }

        const plate = plateMap.get(plateName)!
        plate.wells[wellId] = {
          id: wellId,
          row: wellId.charCodeAt(0) - 65,
          col: parseInt(wellId.slice(1)) - 1,
          state: sampleId ? 'filled' : 'empty',
          sampleType: sampleId || undefined,
        }
      }

      internalState.value.plates = Array.from(plateMap.values())
      internalState.value.samples = Array.from(sampleMap.values())
      internalState.value.activePlateId = internalState.value.plates[0]?.id || ''
      internalState.value.selectedWells = []
      updateSampleCounts()
      return true
    } catch {
      return false
    }
  }

  function reset() {
    const plate = createEmptyPlate('Plate 1', defaultFormat)
    internalState.value = {
      plates: [plate],
      activePlateId: plate.id,
      samples: [],
      selectedWells: [],
      activeSampleId: undefined,
    }
    history.value = []
    historyIndex.value = -1
  }

  return {
    state,
    plates,
    activePlate,
    samples,
    selectedWells,
    activeSampleId,
    canUndo,
    canRedo,
    setActivePlate,
    setActiveSample,
    setSelectedWells,
    addPlate,
    removePlate,
    addSample,
    removeSample,
    assignSample,
    clearWells,
    undo,
    redo,
    exportData,
    importData,
    reset,
  }
}
