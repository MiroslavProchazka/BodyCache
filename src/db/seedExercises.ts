import type { SeedExercise } from './schema'

export const seedExercises: SeedExercise[] = [
  {
    name: 'Barbell Back Squat',
    primaryMuscles: ['quads'],
    secondaryMuscles: ['glutes', 'core'],
    equipment: ['barbell', 'rack'],
    movementPattern: 'squat'
  },
  {
    name: 'Barbell Bench Press',
    primaryMuscles: ['chest'],
    secondaryMuscles: ['triceps', 'front delts'],
    equipment: ['barbell', 'bench'],
    movementPattern: 'push'
  },
  {
    name: 'Deadlift',
    primaryMuscles: ['hamstrings', 'glutes'],
    secondaryMuscles: ['back', 'core'],
    equipment: ['barbell'],
    movementPattern: 'hinge'
  },
  {
    name: 'Pull Up',
    primaryMuscles: ['lats'],
    secondaryMuscles: ['biceps', 'upper back'],
    equipment: ['pull up bar'],
    movementPattern: 'pull'
  },
  {
    name: 'Overhead Press',
    primaryMuscles: ['shoulders'],
    secondaryMuscles: ['triceps', 'core'],
    equipment: ['barbell'],
    movementPattern: 'push'
  }
]
