import { Search } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Input } from '../components/ui/input'

export const Exercises = () => {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Exercise library</CardTitle>
          <CardDescription>Seed data is prepared and custom exercise management lands in milestone 2</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input className="pl-9" placeholder="Search exercises" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
