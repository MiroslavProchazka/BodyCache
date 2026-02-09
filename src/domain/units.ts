export type WeightUnit = 'kg' | 'lb'

const LB_TO_KG = 0.45359237

export const toKg = (value: number, unit: WeightUnit) => (unit === 'kg' ? value : value * LB_TO_KG)

export const fromKg = (value: number, unit: WeightUnit) => (unit === 'kg' ? value : value / LB_TO_KG)
