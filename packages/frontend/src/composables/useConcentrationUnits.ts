import { computed, type ComputedRef } from 'vue'

// Concentration unit types
export type MolarityUnit = 'pM' | 'nM' | 'µM' | 'mM' | 'M'
export type MassVolumeUnit = 'pg/mL' | 'ng/mL' | 'µg/mL' | 'mg/mL' | 'g/mL'
export type PercentageUnit = '% v/v' | '% w/v' | '% w/w'
export type ConcentrationUnit = MolarityUnit | MassVolumeUnit | PercentageUnit | string

export interface ConcentrationValue {
  value: number
  unit: ConcentrationUnit
}

export interface UnitCategory {
  label: string
  units: ConcentrationUnit[]
}

export interface UseConcentrationUnitsReturn {
  unitCategories: ComputedRef<UnitCategory[]>
  molarityUnits: MolarityUnit[]
  massVolumeUnits: MassVolumeUnit[]
  percentageUnits: PercentageUnit[]
  convert: (value: number, from: ConcentrationUnit, to: ConcentrationUnit, mw?: number) => number | null
  formatWithUnit: (concentration: ConcentrationValue, precision?: number) => string
  parseConcentration: (input: string) => ConcentrationValue | null
  getBaseUnit: (unit: ConcentrationUnit) => ConcentrationUnit
  getConversionHint: (concentration: ConcentrationValue) => string | null
  isMolarity: (unit: ConcentrationUnit) => boolean
  isMassVolume: (unit: ConcentrationUnit) => boolean
  isPercentage: (unit: ConcentrationUnit) => boolean
}

// Conversion factors to base unit (M for molarity, g/mL for mass/volume)
const MOLARITY_FACTORS: Record<MolarityUnit, number> = {
  'pM': 1e-12,
  'nM': 1e-9,
  'µM': 1e-6,
  'mM': 1e-3,
  'M': 1,
}

const MASS_VOLUME_FACTORS: Record<MassVolumeUnit, number> = {
  'pg/mL': 1e-12,
  'ng/mL': 1e-9,
  'µg/mL': 1e-6,
  'mg/mL': 1e-3,
  'g/mL': 1,
}

// Percentage conversion factors (for potential future use)
// const PERCENTAGE_FACTORS: Record<PercentageUnit, number> = {
//   '% v/v': 0.01,
//   '% w/v': 0.01,
//   '% w/w': 0.01,
// }

const MOLARITY_UNITS: MolarityUnit[] = ['pM', 'nM', 'µM', 'mM', 'M']
const MASS_VOLUME_UNITS: MassVolumeUnit[] = ['pg/mL', 'ng/mL', 'µg/mL', 'mg/mL', 'g/mL']
const PERCENTAGE_UNITS: PercentageUnit[] = ['% v/v', '% w/v', '% w/w']

export function useConcentrationUnits(): UseConcentrationUnitsReturn {
  const unitCategories = computed<UnitCategory[]>(() => [
    { label: 'Molarity', units: MOLARITY_UNITS },
    { label: 'Mass/Volume', units: MASS_VOLUME_UNITS },
    { label: 'Percentage', units: PERCENTAGE_UNITS },
  ])

  function isMolarity(unit: ConcentrationUnit): unit is MolarityUnit {
    return MOLARITY_UNITS.includes(unit as MolarityUnit)
  }

  function isMassVolume(unit: ConcentrationUnit): unit is MassVolumeUnit {
    return MASS_VOLUME_UNITS.includes(unit as MassVolumeUnit)
  }

  function isPercentage(unit: ConcentrationUnit): unit is PercentageUnit {
    return PERCENTAGE_UNITS.includes(unit as PercentageUnit)
  }

  function getBaseUnit(unit: ConcentrationUnit): ConcentrationUnit {
    if (isMolarity(unit)) return 'M'
    if (isMassVolume(unit)) return 'g/mL'
    if (isPercentage(unit)) return '% w/v'
    return unit
  }

  function convert(
    value: number,
    from: ConcentrationUnit,
    to: ConcentrationUnit,
    mw?: number
  ): number | null {
    if (from === to) return value
    if (value === 0) return 0

    // Same category conversion
    if (isMolarity(from) && isMolarity(to)) {
      const baseValue = value * MOLARITY_FACTORS[from]
      return baseValue / MOLARITY_FACTORS[to]
    }

    if (isMassVolume(from) && isMassVolume(to)) {
      const baseValue = value * MASS_VOLUME_FACTORS[from]
      return baseValue / MASS_VOLUME_FACTORS[to]
    }

    if (isPercentage(from) && isPercentage(to)) {
      // Percentage conversions within same category are direct
      return value
    }

    // Cross-category conversion (requires molecular weight)
    if (mw && mw > 0) {
      // Molarity to Mass/Volume
      if (isMolarity(from) && isMassVolume(to)) {
        // Convert to M, then to g/mL using MW, then to target unit
        const molarConc = value * MOLARITY_FACTORS[from]
        const massConc = molarConc * mw // g/mL (MW in g/mol, concentration in mol/L = g/L)
        return massConc / MASS_VOLUME_FACTORS[to]
      }

      // Mass/Volume to Molarity
      if (isMassVolume(from) && isMolarity(to)) {
        // Convert to g/mL, then to M using MW, then to target unit
        const massConc = value * MASS_VOLUME_FACTORS[from]
        const molarConc = massConc / mw // M (g/mL / g/mol = mol/L)
        return molarConc / MOLARITY_FACTORS[to]
      }
    }

    return null // Cannot convert without MW or between incompatible units
  }

  function formatWithUnit(concentration: ConcentrationValue, precision: number = 3): string {
    const { value, unit } = concentration
    if (value === 0) return `0 ${unit}`

    // Use appropriate precision based on value magnitude
    let formattedValue: string
    if (Math.abs(value) >= 1000) {
      formattedValue = value.toExponential(precision - 1)
    } else if (Math.abs(value) < 0.001) {
      formattedValue = value.toExponential(precision - 1)
    } else {
      formattedValue = value.toPrecision(precision)
    }

    // Remove trailing zeros after decimal point
    formattedValue = formattedValue.replace(/\.?0+$/, '')
    formattedValue = formattedValue.replace(/\.?0+e/, 'e')

    return `${formattedValue} ${unit}`
  }

  function parseConcentration(input: string): ConcentrationValue | null {
    const trimmed = input.trim()
    if (!trimmed) return null

    // Match number followed by optional unit
    const match = trimmed.match(/^([-+]?\d*\.?\d+(?:[eE][-+]?\d+)?)\s*(.*)$/)
    if (!match) return null

    const value = parseFloat(match[1])
    if (isNaN(value)) return null

    let unit = match[2].trim()
    if (!unit) {
      return null // Unit is required
    }

    // Normalize common variations
    unit = unit
      .replace(/uM/i, 'µM')
      .replace(/um/i, 'µM')
      .replace(/ug\/ml/i, 'µg/mL')
      .replace(/ng\/ml/i, 'ng/mL')
      .replace(/mg\/ml/i, 'mg/mL')
      .replace(/pg\/ml/i, 'pg/mL')
      .replace(/g\/ml/i, 'g/mL')

    return { value, unit }
  }

  function getConversionHint(concentration: ConcentrationValue): string | null {
    const { value, unit } = concentration
    if (value === 0) return null

    // Find adjacent unit for conversion hint
    if (isMolarity(unit)) {
      const index = MOLARITY_UNITS.indexOf(unit)
      // If value is large, suggest next higher unit
      if (value >= 1000 && index < MOLARITY_UNITS.length - 1) {
        const nextUnit = MOLARITY_UNITS[index + 1]
        const converted = convert(value, unit, nextUnit)
        if (converted !== null) {
          return formatWithUnit({ value: converted, unit: nextUnit })
        }
      }
      // If value is small, suggest next lower unit
      if (value < 1 && index > 0) {
        const prevUnit = MOLARITY_UNITS[index - 1]
        const converted = convert(value, unit, prevUnit)
        if (converted !== null) {
          return formatWithUnit({ value: converted, unit: prevUnit })
        }
      }
    }

    if (isMassVolume(unit)) {
      const index = MASS_VOLUME_UNITS.indexOf(unit)
      if (value >= 1000 && index < MASS_VOLUME_UNITS.length - 1) {
        const nextUnit = MASS_VOLUME_UNITS[index + 1]
        const converted = convert(value, unit, nextUnit)
        if (converted !== null) {
          return formatWithUnit({ value: converted, unit: nextUnit })
        }
      }
      if (value < 1 && index > 0) {
        const prevUnit = MASS_VOLUME_UNITS[index - 1]
        const converted = convert(value, unit, prevUnit)
        if (converted !== null) {
          return formatWithUnit({ value: converted, unit: prevUnit })
        }
      }
    }

    return null
  }

  return {
    unitCategories,
    molarityUnits: MOLARITY_UNITS,
    massVolumeUnits: MASS_VOLUME_UNITS,
    percentageUnits: PERCENTAGE_UNITS,
    convert,
    formatWithUnit,
    parseConcentration,
    getBaseUnit,
    getConversionHint,
    isMolarity,
    isMassVolume,
    isPercentage,
  }
}
