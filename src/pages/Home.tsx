import { Activity, Clock3, Download, TrendingUp } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'

const milestones = [
  { label: 'Logging MVP', icon: Activity, status: 'next' },
  { label: 'Templates', icon: Clock3, status: 'planned' },
  { label: 'Analytics', icon: TrendingUp, status: 'planned' },
  { label: 'Backup', icon: Download, status: 'planned' }
]

export const Home = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>BodyCache</CardTitle>
          <CardDescription>Local first gym tracker, milestone 0 foundation ready</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            PWA shell, Evolu schema, seed pipeline, and app routes are in place, next milestone focuses on active
            workout logging
          </p>
        </CardContent>
      </Card>
      <div className="grid gap-4 sm:grid-cols-2">
        {milestones.map(({ label, icon: Icon, status }) => (
          <Card key={label}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Icon className="h-4 w-4" />
                {label}
              </CardTitle>
              <CardDescription>Status {status}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  )
}
