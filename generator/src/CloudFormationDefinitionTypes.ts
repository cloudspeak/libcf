export interface CfPropertyData {
    Documentation: string
    Required: boolean
    UpdateType: string
    DuplicatesAllowed?: boolean
    Type?: string
    PrimitiveType?: string
    ItemType?: string
    PrimitiveItemType?: string
}

export interface CfResourceTypeData {
    Documentation: string
    Properties: {[key: string]: CfPropertyData}
    Attributes: {[key: string]: CfPropertyData}
}

export interface CfPropertyTypeData {
    Documentation: string
    Properties: {[key: string]: CfPropertyData}
}

export interface CfDefinitions {
    PropertyTypes: {[key: string]: CfPropertyTypeData | CfPropertyData }
    ResourceTypes: {[key: string]: CfResourceTypeData}
    ResourceSpecificationVersion: string    
}


    
