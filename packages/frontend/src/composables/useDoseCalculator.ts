import {
  useConcentrationUnits,
  type ConcentrationValue,
  type MolarityUnit,
  type MassVolumeUnit,
} from './useConcentrationUnits'

// Volume units
export type VolumeUnit = 'µL' | 'mL' | 'L'

export interface VolumeValue {
  value: number
  unit: VolumeUnit
}

// Dilution calculation types
export interface DilutionParams {
  stockConcentration: ConcentrationValue
  finalConcentration: ConcentrationValue
  finalVolume: VolumeValue
}

export interface DilutionResult {
  stockVolume: VolumeValue
  diluentVolume: VolumeValue
  dilutionFactor: number
  valid: boolean
  error?: string
}

// Serial dilution types
export interface SerialDilutionParams {
  startingConcentration: ConcentrationValue
  dilutionFactor: number
  numberOfDilutions: number
  volumePerWell: VolumeValue
}

export interface SerialDilutionStep {
  stepNumber: number
  concentration: ConcentrationValue
  transferVolume: VolumeValue
  diluentVolume: VolumeValue
}

export interface SerialDilutionResult {
  steps: SerialDilutionStep[]
  totalStockVolume: VolumeValue
  valid: boolean
  error?: string
}

// Conversion types
export interface ConversionResult {
  result: ConcentrationValue
  valid: boolean
  error?: string
}

// Well concentration for plate integration
export interface WellConcentration {
  wellId: string
  concentration: ConcentrationValue
  volume?: VolumeValue
}

export interface UseDoseCalculatorReturn {
  volumeUnits: VolumeUnit[]
  calculateDilution: (params: DilutionParams) => DilutionResult
  calculateSerialDilution: (params: SerialDilutionParams) => SerialDilutionResult
  convertMassToMolar: (
    mass: number,
    massUnit: MassVolumeUnit,
    mw: number
  ) => ConcentrationValue
  convertMolarToMass: (
    molar: number,
    molarUnit: MolarityUnit,
    mw: number
  ) => ConcentrationValue
  convertVolume: (value: number, from: VolumeUnit, to: VolumeUnit) => number
  formatVolume: (volume: VolumeValue, precision?: number) => string
  generateWellConcentrations: (
    result: SerialDilutionResult,
    wellIds: string[]
  ) => WellConcentration[]
}

const VOLUME_UNITS: VolumeUnit[] = ['µL', 'mL', 'L']

const VOLUME_FACTORS: Record<VolumeUnit, number> = {
  'µL': 1e-6,
  'mL': 1e-3,
  'L': 1,
}

export function useDoseCalculator(): UseDoseCalculatorReturn {
  const { convert } = useConcentrationUnits()

  function convertVolume(value: number, from: VolumeUnit, to: VolumeUnit): number {
    if (from === to) return value
    const baseValue = value * VOLUME_FACTORS[from]
    return baseValue / VOLUME_FACTORS[to]
  }

  function formatVolume(volume: VolumeValue, precision: number = 3): string {
    const { value, unit } = volume
    if (value === 0) return `0 ${unit}`

    let formattedValue: string
    if (Math.abs(value) >= 1000) {
      formattedValue = value.toExponential(precision - 1)
    } else if (Math.abs(value) < 0.001) {
      formattedValue = value.toExponential(precision - 1)
    } else {
      formattedValue = value.toPrecision(precision)
    }

    // Remove trailing zeros
    formattedValue = formattedValue.replace(/\.?0+$/, '')
    formattedValue = formattedValue.replace(/\.?0+e/, 'e')

    return `${formattedValue} ${unit}`
  }

  function calculateDilution(params: DilutionParams): DilutionResult {
    const { stockConcentration, finalConcentration, finalVolume } = params

    // Validate inputs
    if (stockConcentration.value <= 0) {
      return {
        stockVolume: { value: 0, unit: 'µL' },
        diluentVolume: { value: 0, unit: 'µL' },
        dilutionFactor: 0,
        valid: false,
        error: 'Stock concentration must be positive',
      }
    }

    if (finalConcentration.value <= 0) {
      return {
        stockVolume: { value: 0, unit: 'µL' },
        diluentVolume: { value: 0, unit: 'µL' },
        dilutionFactor: 0,
        valid: false,
        error: 'Final concentration must be positive',
      }
    }

    if (finalVolume.value <= 0) {
      return {
        stockVolume: { value: 0, unit: 'µL' },
        diluentVolume: { value: 0, unit: 'µL' },
        dilutionFactor: 0,
        valid: false,
        error: 'Final volume must be positive',
      }
    }

    // Convert concentrations to same unit
    const convertedFinal = convert(
      finalConcentration.value,
      finalConcentration.unit,
      stockConcentration.unit
    )

    if (convertedFinal === null) {
      return {
        stockVolume: { value: 0, unit: 'µL' },
        diluentVolume: { value: 0, unit: 'µL' },
        dilutionFactor: 0,
        valid: false,
        error: 'Cannot convert between concentration units. Provide molecular weight for mass↔molarity conversion.',
      }
    }

    // Check that stock is more concentrated than final
    if (convertedFinal >= stockConcentration.value) {
      return {
        stockVolume: { value: 0, unit: 'µL' },
        diluentVolume: { value: 0, unit: 'µL' },
        dilutionFactor: 0,
        valid: false,
        error: 'Stock concentration must be higher than final concentration',
      }
    }

    // Calculate using C1V1 = C2V2
    const dilutionFactor = stockConcentration.value / convertedFinal
    const finalVolumeInL = convertVolume(finalVolume.value, finalVolume.unit, 'L')
    const stockVolumeInL = finalVolumeInL / dilutionFactor
    const diluentVolumeInL = finalVolumeInL - stockVolumeInL

    // Convert to appropriate unit (µL for small volumes, mL for larger)
    let outputUnit: VolumeUnit = 'µL'
    if (stockVolumeInL >= 0.001) outputUnit = 'mL'
    if (stockVolumeInL >= 1) outputUnit = 'L'

    return {
      stockVolume: {
        value: convertVolume(stockVolumeInL, 'L', outputUnit),
        unit: outputUnit,
      },
      diluentVolume: {
        value: convertVolume(diluentVolumeInL, 'L', outputUnit),
        unit: outputUnit,
      },
      dilutionFactor,
      valid: true,
    }
  }

  function calculateSerialDilution(params: SerialDilutionParams): SerialDilutionResult {
    const { startingConcentration, dilutionFactor, numberOfDilutions, volumePerWell } = params

    // Validate inputs
    if (startingConcentration.value <= 0) {
      return {
        steps: [],
        totalStockVolume: { value: 0, unit: 'µL' },
        valid: false,
        error: 'Starting concentration must be positive',
      }
    }

    if (dilutionFactor <= 1) {
      return {
        steps: [],
        totalStockVolume: { value: 0, unit: 'µL' },
        valid: false,
        error: 'Dilution factor must be greater than 1',
      }
    }

    if (numberOfDilutions < 1) {
      return {
        steps: [],
        totalStockVolume: { value: 0, unit: 'µL' },
        valid: false,
        error: 'Number of dilutions must be at least 1',
      }
    }

    if (volumePerWell.value <= 0) {
      return {
        steps: [],
        totalStockVolume: { value: 0, unit: 'µL' },
        valid: false,
        error: 'Volume per well must be positive',
      }
    }

    const steps: SerialDilutionStep[] = []
    let currentConcentration = startingConcentration.value
    const transferVolume = volumePerWell.value / (dilutionFactor - 1)
    const diluentVolume = volumePerWell.value - transferVolume

    for (let i = 0; i < numberOfDilutions; i++) {
      steps.push({
        stepNumber: i + 1,
        concentration: {
          value: currentConcentration,
          unit: startingConcentration.unit,
        },
        transferVolume: {
          value: i === 0 ? volumePerWell.value : transferVolume,
          unit: volumePerWell.unit,
        },
        diluentVolume: {
          value: i === 0 ? 0 : diluentVolume,
          unit: volumePerWell.unit,
        },
      })
      currentConcentration /= dilutionFactor
    }

    // Total stock needed for first well
    const totalStockVolume: VolumeValue = {
      value: volumePerWell.value + (transferVolume * (numberOfDilutions - 1)),
      unit: volumePerWell.unit,
    }

    return {
      steps,
      totalStockVolume,
      valid: true,
    }
  }

  function convertMassToMolar(
    mass: number,
    massUnit: MassVolumeUnit,
    mw: number
  ): ConcentrationValue {
    // Convert mass to g/mL, then to M using MW
    const converted = convert(mass, massUnit, 'µM', mw)
    if (converted !== null) {
      return { value: converted, unit: 'µM' }
    }
    // Fallback to manual calculation
    // mass (g/mL) / MW (g/mol) = mol/L = M
    const massInGML = mass * getMassVolumeFactor(massUnit)
    const molarConc = massInGML / mw
    return { value: molarConc * 1e6, unit: 'µM' }
  }

  function convertMolarToMass(
    molar: number,
    molarUnit: MolarityUnit,
    mw: number
  ): ConcentrationValue {
    // Convert M to mass using MW
    const converted = convert(molar, molarUnit, 'µg/mL', mw)
    if (converted !== null) {
      return { value: converted, unit: 'µg/mL' }
    }
    // Fallback to manual calculation
    // mol/L * MW (g/mol) = g/L = mg/mL
    const molarInM = molar * getMolarityFactor(molarUnit)
    const massConc = molarInM * mw * 1e6 // µg/mL
    return { value: massConc, unit: 'µg/mL' }
  }

  function getMassVolumeFactor(unit: MassVolumeUnit): number {
    const factors: Record<MassVolumeUnit, number> = {
      'pg/mL': 1e-12,
      'ng/mL': 1e-9,
      'µg/mL': 1e-6,
      'mg/mL': 1e-3,
      'g/mL': 1,
    }
    return factors[unit]
  }

  function getMolarityFactor(unit: MolarityUnit): number {
    const factors: Record<MolarityUnit, number> = {
      'pM': 1e-12,
      'nM': 1e-9,
      'µM': 1e-6,
      'mM': 1e-3,
      'M': 1,
    }
    return factors[unit]
  }

  function generateWellConcentrations(
    result: SerialDilutionResult,
    wellIds: string[]
  ): WellConcentration[] {
    if (!result.valid || result.steps.length === 0) return []

    return result.steps.slice(0, wellIds.length).map((step, index) => ({
      wellId: wellIds[index],
      concentration: step.concentration,
      volume: step.transferVolume,
    }))
  }

  return {
    volumeUnits: VOLUME_UNITS,
    calculateDilution,
    calculateSerialDilution,
    convertMassToMolar,
    convertMolarToMass,
    convertVolume,
    formatVolume,
    generateWellConcentrations,
  }
}
