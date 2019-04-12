import { JsDocGenerator } from './JsDocGenerator'
import { NamespaceNode } from './NamespaceNode'
import { PropertyType } from './PropertyType'
import { TypeName } from './TypeName';
import { CfPropertyTypeData } from './CloudFormationDefinitionTypes';

/**
 * Represents an entire CF resource namespace, which includes a resource type and all of its
 * property types
 * @property {CfPropertyTypeData} propertyTypes
 */
export class OrphanPropertyTypeNode {

    parsedName: TypeName
    data: CfPropertyTypeData
    propertyType: PropertyType

    constructor(parsedName, data) {
        this.parsedName = parsedName
        this.data = data
        this.propertyType = new PropertyType(this.parsedName, this.data)
    }

    generateCode(assignment) {
        return [
            //...this.propertyType.generateTypedef(),
            ...this.propertyType.generateCastFunctionComment(),
            `${assignment} function(properties) { return properties; }`
        ]
    }

    generateTypedef() {
        return JsDocGenerator.generatePropertiesTypedef(this.parsedName, this.data.Properties)
    }


}