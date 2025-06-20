import { ResourceType } from '../database'

export interface ResourceMetadata {
    id: string
    type: ResourceType
    url: string
}
