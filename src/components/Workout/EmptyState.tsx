import { Button } from '../ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card'

type EmptyStateProps = {
  title: string
  description: string
  actionLabel?: string
}

export const EmptyState = ({ title, description, actionLabel = 'Coming soon' }: EmptyStateProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Button variant="outline" type="button">
          {actionLabel}
        </Button>
      </CardContent>
    </Card>
  )
}
