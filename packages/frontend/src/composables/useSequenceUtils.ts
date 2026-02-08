export type SequenceType = 'dna' | 'rna' | 'protein' | 'auto'

export interface SequenceStats {
  length: number
  gcPercent?: number
  molecularWeight?: number
}

const DNA_CHARS = /[^ATCGNatcgn]/g
const RNA_CHARS = /[^AUCGNaucgn]/g
const PROTEIN_CHARS = /[^ACDEFGHIKLMNPQRSTVWYacdefghiklmnpqrstvwy]/g

const DNA_COMPLEMENT: Record<string, string> = {
  A: 'T', T: 'A', C: 'G', G: 'C', N: 'N',
  a: 't', t: 'a', c: 'g', g: 'c', n: 'n',
}

const RNA_COMPLEMENT: Record<string, string> = {
  A: 'U', U: 'A', C: 'G', G: 'C', N: 'N',
  a: 'u', u: 'a', c: 'g', g: 'c', n: 'n',
}

// Average molecular weights per residue
const MW_DNA_NT = 330 // Da per nucleotide (average)
const MW_RNA_NT = 340 // Da per nucleotide (average)
const MW_PROTEIN_AA = 110 // Da per amino acid (average)

export function useSequenceUtils() {
  function detectSequenceType(seq: string): 'dna' | 'rna' | 'protein' {
    const upper = seq.toUpperCase()

    // If contains U but not T, it's RNA
    if (upper.includes('U') && !upper.includes('T')) {
      return 'rna'
    }

    // If only contains ATCGN characters, it's DNA
    if (/^[ATCGN]+$/i.test(seq)) {
      return 'dna'
    }

    return 'protein'
  }

  function validateSequence(seq: string, type: SequenceType): string {
    const effectiveType = type === 'auto' ? detectSequenceType(seq) : type

    switch (effectiveType) {
      case 'dna':
        return seq.replace(DNA_CHARS, '')
      case 'rna':
        return seq.replace(RNA_CHARS, '')
      case 'protein':
        return seq.replace(PROTEIN_CHARS, '')
      default:
        return seq
    }
  }

  function reverseComplement(seq: string, type: 'dna' | 'rna'): string {
    const complementMap = type === 'dna' ? DNA_COMPLEMENT : RNA_COMPLEMENT

    return seq
      .split('')
      .reverse()
      .map(ch => complementMap[ch] ?? ch)
      .join('')
  }

  function calculateStats(seq: string, type: 'dna' | 'rna' | 'protein'): SequenceStats {
    const length = seq.length
    const stats: SequenceStats = { length }

    if (type === 'dna' || type === 'rna') {
      const upper = seq.toUpperCase()
      let gcCount = 0
      for (const ch of upper) {
        if (ch === 'G' || ch === 'C') gcCount++
      }
      stats.gcPercent = length > 0 ? Math.round((gcCount / length) * 10000) / 100 : 0
      stats.molecularWeight = length * (type === 'dna' ? MW_DNA_NT : MW_RNA_NT)
    } else {
      stats.molecularWeight = length * MW_PROTEIN_AA
    }

    return stats
  }

  function formatFasta(seq: string, lineWidth: number = 60): string {
    const lines: string[] = []
    for (let i = 0; i < seq.length; i += lineWidth) {
      lines.push(seq.slice(i, i + lineWidth))
    }
    return lines.join('\n')
  }

  return {
    detectSequenceType,
    validateSequence,
    reverseComplement,
    calculateStats,
    formatFasta,
  }
}
