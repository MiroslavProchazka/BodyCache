import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'

export const TemplateEmptyState = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>No templates yet</CardTitle>
        <CardDescription>Milestone 2 adds ordered template exercises and suggested set schemes</CardDescription>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">Templates will support starting a session in one click</CardContent>
    </Card>
  )
}
