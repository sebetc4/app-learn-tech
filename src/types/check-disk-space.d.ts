declare module 'check-disk-space' {
    export interface DiskSpace {
        free: number
        size: number
        diskPath: string
    }

    export class InvalidPathError extends Error {}
    export class NoMatchError extends Error {}

    const checkDiskSpaceModule: {
        default: (directoryPath: string) => Promise<DiskSpace>
        InvalidPathError: typeof InvalidPathError
        NoMatchError: typeof NoMatchError
        getFirstExistingParentPath: (path: string) => Promise<string>
    }

    export default checkDiskSpaceModule
}
