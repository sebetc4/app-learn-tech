export type ResourceType = 'GITHUB' | 'STACKBLITZ'

export interface ResourceMetadata {
    id: string
    type: ResourceType
    url: string
}
