import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Input } from '../components/ui/input'
import {
  createDefaultWorkoutName,
  getActiveWorkoutSession,
  getRecentWorkoutSessions,
  type LocalWorkoutSession
} from '../domain/workoutSession'
import { finishWorkoutSession, renameWorkoutSession, startWorkoutSession } from '../db/mutations'

const formatDateTime = (value: string) => {
  return new Date(value).toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

export const WorkoutActive = () => {
  const [activeSession, setActiveSession] = useState<LocalWorkoutSession | null>(() => getActiveWorkoutSession())
  const [sessionName, setSessionName] = useState(() => getActiveWorkoutSession()?.name ?? createDefaultWorkoutName())
  const [recentSessions, setRecentSessions] = useState(() => getRecentWorkoutSessions().slice(0, 5))

  const onStartSession = async () => {
    const session = await startWorkoutSession(sessionName)
    setActiveSession(session)
    setSessionName(session.name)
  }

  const onRenameSession = (nextName: string) => {
    setSessionName(nextName)
    const renamedSession = renameWorkoutSession(nextName)
    if (renamedSession) {
      setActiveSession(renamedSession)
    }
  }

  const onFinishSession = () => {
    const finishedSession = finishWorkoutSession()
    if (!finishedSession) return

    setActiveSession(null)
    setSessionName(createDefaultWorkoutName())
    setRecentSessions(getRecentWorkoutSessions().slice(0, 5))
  }

  if (!activeSession) {
    return (
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Start workout session</CardTitle>
            <CardDescription>Start a session, autosave edits, and continue anytime from this device</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground" htmlFor="session-name">
                Session name
              </label>
              <Input
                id="session-name"
                onChange={(event) => setSessionName(event.target.value)}
                placeholder="Push Day"
                value={sessionName}
              />
            </div>
            <Button onClick={onStartSession} type="button">
              Start session
            </Button>
          </CardContent>
        </Card>

        {recentSessions.length > 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>Recent sessions</CardTitle>
              <CardDescription>Locally completed sessions in this browser</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                {recentSessions.map((session) => (
                  <li className="rounded-md border border-border p-2" key={session.id}>
                    <div className="font-medium">{session.name}</div>
                    <div className="text-muted-foreground">Started {formatDateTime(session.startedAt)}</div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ) : null}
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Current session</CardTitle>
        <CardDescription>Inline edits are autosaved instantly on every change</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-2">
          <label className="text-sm text-muted-foreground" htmlFor="session-name">
            Session name
          </label>
          <Input id="session-name" onChange={(event) => onRenameSession(event.target.value)} value={sessionName} />
        </div>
        <p className="text-sm text-muted-foreground">Started {formatDateTime(activeSession.startedAt)}</p>
        <div className="flex flex-wrap gap-2">
          <Button asChild type="button" variant="outline">
            <Link to={`/workout/${activeSession.id}`}>Open detail</Link>
          </Button>
          <Button onClick={onFinishSession} type="button">
            Finish session
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
