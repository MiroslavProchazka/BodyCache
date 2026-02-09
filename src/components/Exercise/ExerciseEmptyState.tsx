import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'

export const ExerciseEmptyState = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>No exercise selected</CardTitle>
        <CardDescription>Milestone 1 and 3 add active hints and exercise-level history</CardDescription>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">Use the exercise library to start a session flow</CardContent>
    </Card>
  )
}
