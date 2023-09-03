import { Terminal, Waves, AlertCircle } from 'lucide-react'
import { Alert, AlertTitle, AlertDescription } from '../ui/alert'

export function AlertDemo({ text }) {
    return (
        <Alert className="bg-primary">
            <Terminal className="h-4 w-4" />
            <AlertTitle>Info!</AlertTitle>
            <AlertDescription>
                {text}
            </AlertDescription>
        </Alert>
    )
}

export function AlertDestructive({ text }) {
    return (
        <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
                {text}
            </AlertDescription>
        </Alert>
    )
}