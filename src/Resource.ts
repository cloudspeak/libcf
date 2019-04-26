/**
 * @file Interface which represents a CloudFormation resource.
 */


/**
 * Represents a CloudFormation resource, as specified by the CloudFormation template specification.
 * 
 * See https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/resources-section-structure.html
 */
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