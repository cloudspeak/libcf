import { CfPropertyData } from "./CloudFormationDefinitionTypes";
import { TypeName } from "./TypeName";
import { CloudFormationUtils } from "./CloudFormationUtils";
import { JsDocGenerator } from "./JsDocGenerator";

const CfTypeList = "List"
const CfTypeMap = "Map"

export class TsGenerator {

    static get CfResourceInterface(): string {
        return "Resource"
    }
    
    static get CfResourceInterfaceAlias(): string {
        return "LibcfResource"
    }

    static get CfNamespaceName(): string {
        return "Cf"
    }

    static getResourceTypePropertiesInterfaceName(parsedName: TypeName) {
        return parsedName.namespace[parsedName.namespace.length - 1] + "Properties"
    }

    static getPropertyTypeInterfaceName(parsedName: TypeName) {
        if (parsedName.fullname === "Tag") {  // Special case as it is the only global property
            return parsedName.fullname + "Properties"
        }
        else if (parsedName.namespace) {
            return parsedName.namespace[parsedName.namespace.length - 1] + parsedName.propertyName
        }
        else {
            return parsedName.propertyName
        }
    }
    
    static generatePropertyList(parsedName: TypeName, properties: {[key: string]: CfPropertyData}) {
        
        let tsPropertyList = Object.keys(properties).reduce((array, propertyName) => {
            let property = properties[propertyName]
            let tsType = TsGenerator.getPropertyTsType(parsedName, property)
            let tsFieldName = property.Required ? propertyName : `${propertyName}?`
            let requiredString = property.Required ? "(required)" : "(optional)"
            let updateTypeComment = property.UpdateType ? [                    
                `Update type is ${property.UpdateType}.`,
                ``,
            ] : []

            

            let commentLines = JsDocGenerator.generateComment([
                `Property ${parsedName.fullname} ${requiredString}`,
                '',
                ...updateTypeComment,
                '',
                `See ${property.Documentation}`
            ])
            return array.concat([
                ...commentLines,
                `${tsFieldName}: ${tsType}`
            ])

            // return array.concat([
            //     `@property {${jsDocType}} ${nameJsDoc} ${propertyName} property ${requiredString}.`,
            //     ``,
            //     ...updateTypeComment,
            //     `       See ${property.Documentation}`
            // ])
        }, [])
        //return JsDocGenerator.generateComment([ jsDocTypedef ].concat(jsDocProperties))
        return tsPropertyList
    }

    
    static getPropertyTsType(parentParsedName: TypeName, property: CfPropertyData) {
        if (property.Type === CfTypeList && property.PrimitiveItemType) {
            return this.cfPrimitiveToTsPrimitive(property.PrimitiveItemType) + "[]"
        }
        else if (property.Type === CfTypeList && property.ItemType) {
            let fullPropertyName = CloudFormationUtils.getFullPropertyTypeName(parentParsedName, property.ItemType)
            return TsGenerator.getPropertyTypeInterfaceName(fullPropertyName) + "[]";
        }
        if (property.Type === CfTypeMap && property.PrimitiveItemType) {
            return `{[key: string]: ${this.cfPrimitiveToTsPrimitive(property.PrimitiveItemType)}}` 
        }
        else if (property.Type === CfTypeMap && property.ItemType) {
            let fullPropertyName = CloudFormationUtils.getFullPropertyTypeName(parentParsedName, property.ItemType)
            return `{[key: string]: ${TsGenerator.getPropertyTypeInterfaceName(fullPropertyName)}}`
        }
        else if (property.PrimitiveType) {
            return TsGenerator.cfPrimitiveToTsPrimitive(property.PrimitiveType)
        }
        else if (property.Type) {
            let fullPropertyName = CloudFormationUtils.getFullPropertyTypeName(parentParsedName, property.Type)
            return TsGenerator.getPropertyTypeInterfaceName(fullPropertyName);
        }
        else throw new Error(`Unable to determine datatype for property `)
    }
    
    static cfPrimitiveToTsPrimitive(type: string) {
        switch (type) {
            case "String": return "string";
            case "Long": return "number";
            case "Integer": return "number";
            case "Double": return "number";
            case "Boolean": return "boolean";
            case "Timestamp": return "string";
            //case "Json": return "object|string"; // Would like JSON to act as object in future
            case "Json": return "object";
            case "Map": return "object";
            default: throw Error("Unrecognized CF primitive type: " + type)
        }
    }

}