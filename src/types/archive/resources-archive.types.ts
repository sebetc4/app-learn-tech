export type ResourceType = 'GITHUB' | 'STACKBLITZ'
  
export interface ResourceArchive {
    id: string  
    type: ResourceType
    url: string
}
