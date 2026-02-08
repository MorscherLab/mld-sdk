// Types
export interface ParsedElement {
  symbol: string
  count: number
}

export interface FormulaParseResult {
  elements: Record<string, number>
  valid: boolean
  error?: string
}

export type FormulaPartType = 'element' | 'subscript' | 'superscript' | 'paren' | 'dot' | 'charge'

export interface FormulaPart {
  type: FormulaPartType
  text: string
}

// ~30 common elements with atomic weights
export const ATOMIC_WEIGHTS: Record<string, number> = {
  H: 1.008, He: 4.003, Li: 6.941, Be: 9.012, B: 10.81,
  C: 12.011, N: 14.007, O: 15.999, F: 18.998, Ne: 20.180,
  Na: 22.990, Mg: 24.305, Al: 26.982, Si: 28.086, P: 30.974,
  S: 32.065, Cl: 35.453, Ar: 39.948, K: 39.098, Ca: 40.078,
  Mn: 54.938, Fe: 55.845, Co: 58.933, Ni: 58.693, Cu: 63.546,
  Zn: 65.38, Br: 79.904, Ag: 107.868, I: 126.904, Au: 196.967,
}

function parseFormulaSegment(formula: string): FormulaParseResult {
  const elements: Record<string, number> = {}
  const stack: Record<string, number>[] = [{}]
  let i = 0

  while (i < formula.length) {
    const ch = formula[i]

    if (ch === '(') {
      stack.push({})
      i++
    } else if (ch === ')') {
      if (stack.length < 2) {
        return { elements: {}, valid: false, error: 'Unmatched closing parenthesis' }
      }
      i++
      // Read multiplier after closing paren
      let numStr = ''
      while (i < formula.length && /\d/.test(formula[i])) {
        numStr += formula[i]
        i++
      }
      const multiplier = numStr ? parseInt(numStr, 10) : 1
      const top = stack.pop()!
      const current = stack[stack.length - 1]
      for (const [el, count] of Object.entries(top)) {
        current[el] = (current[el] || 0) + count * multiplier
      }
    } else if (/[A-Z]/.test(ch)) {
      // Element symbol: uppercase letter optionally followed by lowercase
      let symbol = ch
      i++
      while (i < formula.length && /[a-z]/.test(formula[i])) {
        symbol += formula[i]
        i++
      }
      // Validate element
      if (!(symbol in ATOMIC_WEIGHTS)) {
        return { elements: {}, valid: false, error: `Unknown element: ${symbol}` }
      }
      // Read count
      let numStr = ''
      while (i < formula.length && /\d/.test(formula[i])) {
        numStr += formula[i]
        i++
      }
      const count = numStr ? parseInt(numStr, 10) : 1
      const current = stack[stack.length - 1]
      current[symbol] = (current[symbol] || 0) + count
    } else {
      return { elements: {}, valid: false, error: `Unexpected character: ${ch}` }
    }
  }

  if (stack.length !== 1) {
    return { elements: {}, valid: false, error: 'Unmatched opening parenthesis' }
  }

  Object.assign(elements, stack[0])
  return { elements, valid: true }
}

export function useChemicalFormula() {
  function parseFormula(formula: string): FormulaParseResult {
    const trimmed = formula.trim()
    if (!trimmed) {
      return { elements: {}, valid: false, error: 'Empty formula' }
    }

    // Split on hydrate separator (· or .)
    const parts = trimmed.split(/[·.]/)
    const combined: Record<string, number> = {}

    for (const part of parts) {
      const segment = part.trim()
      if (!segment) continue

      // Check for leading coefficient (e.g., 5H2O)
      let coefficient = 1
      let formulaStr = segment
      const coeffMatch = segment.match(/^(\d+)([A-Z].*)$/)
      if (coeffMatch) {
        coefficient = parseInt(coeffMatch[1], 10)
        formulaStr = coeffMatch[2]
      }

      const result = parseFormulaSegment(formulaStr)
      if (!result.valid) {
        return result
      }

      for (const [el, count] of Object.entries(result.elements)) {
        combined[el] = (combined[el] || 0) + count * coefficient
      }
    }

    return { elements: combined, valid: true }
  }

  function calculateMW(elements: Record<string, number>): number {
    let mw = 0
    for (const [el, count] of Object.entries(elements)) {
      const weight = ATOMIC_WEIGHTS[el]
      if (weight !== undefined) {
        mw += weight * count
      }
    }
    return Math.round(mw * 1000) / 1000
  }

  function renderFormulaParts(formula: string): FormulaPart[] {
    const parts: FormulaPart[] = []
    const trimmed = formula.trim()
    let i = 0

    while (i < trimmed.length) {
      const ch = trimmed[i]

      // Hydrate dot separator
      if (ch === '·' || (ch === '.' && i > 0 && /\d/.test(trimmed[i - 1]) && i + 1 < trimmed.length && /\d/.test(trimmed[i + 1]))) {
        // Disambiguate: '.' as hydrate separator only if followed by a digit then uppercase
        // For simplicity, treat '·' always as dot
        if (ch === '·') {
          parts.push({ type: 'dot', text: '·' })
          i++
          continue
        }
      }

      // Parentheses
      if (ch === '(' || ch === ')') {
        parts.push({ type: 'paren', text: ch })
        i++
        // After ')' check for subscript number
        if (ch === ')' && i < trimmed.length && /\d/.test(trimmed[i])) {
          let numStr = ''
          while (i < trimmed.length && /\d/.test(trimmed[i])) {
            numStr += trimmed[i]
            i++
          }
          parts.push({ type: 'subscript', text: numStr })
        }
        continue
      }

      // Charge notation: ^2+, ^2-, 2+, 2- at end, or +, -
      if (ch === '^') {
        i++
        let chargeStr = ''
        while (i < trimmed.length && /[\d+\-]/.test(trimmed[i])) {
          chargeStr += trimmed[i]
          i++
        }
        if (chargeStr) {
          parts.push({ type: 'charge', text: chargeStr })
        }
        continue
      }

      // Element symbol: uppercase followed by optional lowercase
      if (/[A-Z]/.test(ch)) {
        let symbol = ch
        i++
        while (i < trimmed.length && /[a-z]/.test(trimmed[i])) {
          symbol += trimmed[i]
          i++
        }
        parts.push({ type: 'element', text: symbol })

        // Check for subscript number after element
        if (i < trimmed.length && /\d/.test(trimmed[i])) {
          let numStr = ''
          while (i < trimmed.length && /\d/.test(trimmed[i])) {
            numStr += trimmed[i]
            i++
          }
          parts.push({ type: 'subscript', text: numStr })

          // Check for charge after subscript (e.g., Fe2+ or SO4^2-)
          if (i < trimmed.length && (trimmed[i] === '+' || trimmed[i] === '-')) {
            parts.push({ type: 'charge', text: numStr + trimmed[i] })
            // Remove the subscript we just added since it's actually part of charge
            // Actually, for cases like Fe2+, the 2+ is the charge, not a subscript
            // But for H2O the 2 is a subscript. We need context.
            // Simplification: if followed by +/-, treat trailing digits as part of charge
            parts.splice(parts.length - 2, 1) // Remove the subscript
            i++
            continue
          }
        }
        continue
      }

      // Leading digit (hydrate coefficient like 5H2O)
      if (/\d/.test(ch)) {
        let numStr = ''
        while (i < trimmed.length && /\d/.test(trimmed[i])) {
          numStr += trimmed[i]
          i++
        }
        // Could be a subscript or coefficient depending on context
        // If next char is uppercase, it's a coefficient (render as element-like text)
        // If at end or followed by +/-, it's a charge component
        if (i < trimmed.length && (trimmed[i] === '+' || trimmed[i] === '-')) {
          parts.push({ type: 'charge', text: numStr + trimmed[i] })
          i++
        } else {
          parts.push({ type: 'subscript', text: numStr })
        }
        continue
      }

      // Standalone + or - (charge)
      if (ch === '+' || ch === '-') {
        parts.push({ type: 'charge', text: ch })
        i++
        continue
      }

      // Dot as hydrate separator
      if (ch === '.') {
        parts.push({ type: 'dot', text: '·' })
        i++
        continue
      }

      // Skip whitespace
      if (/\s/.test(ch)) {
        i++
        continue
      }

      // Unknown character, skip
      i++
    }

    return parts
  }

  return {
    parseFormula,
    calculateMW,
    renderFormulaParts,
  }
}
