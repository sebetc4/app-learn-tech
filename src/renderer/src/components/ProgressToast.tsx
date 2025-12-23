interface ProgressToastProps {
    progress: number
    message: string
}

export function ProgressToast({ progress, message }: ProgressToastProps) {
    return (
        <div className="flex flex-col gap-2 w-full">
            <p className="text-sm font-medium">{message}</p>
            <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                />
            </div>
            <p className="text-xs text-gray-500">{progress}%</p>
        </div>
    )
}
