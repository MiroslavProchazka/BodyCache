import { Activity, Clock3, Download, TrendingUp } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'

const milestones = [
  { label: 'Logging MVP', icon: Activity, status: 'in progress' },
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
          <CardDescription>Local first gym tracker, milestone 1 workout logging in progress</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Active session start, rename, add exercise, and finish flows now work with local-first persistence and e2e
            coverage
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
