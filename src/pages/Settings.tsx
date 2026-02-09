import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'

export const SettingsPage = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Settings and backup</CardTitle>
        <CardDescription>Milestone 5 adds import, export, merge report, and PWA update controls</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">No backend is used, Evolu local store remains the source of truth</p>
      </CardContent>
    </Card>
  )
}
