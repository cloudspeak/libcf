export interface Resource {
    Type: string
    Properties: any

    CreationPolicy: any
    setCreationPolicy(value: any): Resource

    DeletionPolicy: any
    setDeletionPolicy(value: any): Resource

    DependsOn: any
    setDependsOn(value: any): Resource

    Metadata: any
    setMetadata(value: any): Resource

    UpdatePolicy: any
    setUpdatePolicy(value: any): Resource

    UpdateReplacePolicy: any
    setUpdateReplacePolicy(value: any): Resource
}