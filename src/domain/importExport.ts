import { z } from 'zod'

const rowSchema = z.object({
  id: z.string(),
  updatedAt: z.string()
})

const payloadSchema = z.object({
  exercises: z.array(rowSchema).default([]),
  workoutTemplates: z.array(rowSchema).default([]),
  templateExercises: z.array(rowSchema).default([]),
  workoutSessions: z.array(rowSchema).default([]),
  sessionExercises: z.array(rowSchema).default([]),
  setEntries: z.array(rowSchema).default([])
})

export type ImportPayload = z.infer<typeof payloadSchema>

export type ImportReport = {
  inserted: number
  updated: number
  skipped: number
  errors: number
}

export const parseImportPayload = (value: unknown) => payloadSchema.safeParse(value)

export const mergeRowsByUpdatedAt = <TRow extends { id: string; updatedAt: string }>(
  existingRows: TRow[],
  incomingRows: TRow[]
) => {
  const report: ImportReport = { inserted: 0, updated: 0, skipped: 0, errors: 0 }
  const map = new Map(existingRows.map((row) => [row.id, row]))

  for (const incoming of incomingRows) {
    const existing = map.get(incoming.id)
    if (!existing) {
      map.set(incoming.id, incoming)
      report.inserted += 1
      continue
    }

    if (incoming.updatedAt > existing.updatedAt) {
      map.set(incoming.id, incoming)
      report.updated += 1
      continue
    }

    report.skipped += 1
  }

  return { rows: [...map.values()], report }
}
