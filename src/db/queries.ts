import { evolu } from './evolu'

export const queryExercises = () =>
  (evolu as any).createQuery((db: any) =>
    db.selectFrom('exercises').selectAll().where('archivedAt', 'is', null).orderBy('name', 'asc')
  )

export const querySessions = () =>
  (evolu as any).createQuery((db: any) => db.selectFrom('workoutSessions').selectAll().orderBy('startedAt', 'desc'))
