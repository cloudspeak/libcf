const CloudFormationUtils = require('./CloudFormationUtils')

const CfTypeList = "List"

module.exports = class JsDocGenerator {

    /**
     * @param {TypeName} typeName
     */
    static getPropertyTypeTypedefName(typeName) {
        return typeName.propertyName
    }

    /**
     * Converts a CloudFormation primitive type name to a JSDoc primitive type
     * @param {string} type A CloudFormation primitive type
     */
    static cfPrimitiveToJsDocPrimitive(type) {
        switch (type) {
            case "String": return "string";
            case "Long": return "number";
            case "Integer": return "number";
            case "Double": return "number";
            case "Boolean": return "boolean";
            case "Timestamp": return "string";
            //case "Json": return "object|string"; // Would like JSON to act as object in future
            case "Json": return "string";
            case "Map": return "object";
            default: throw Error("Unrecognized CF primitive type: " + type)
        }
    }
    
    

    static getPropertyJsDocType(parentParsedName, property) {
        if (property.Type === CfTypeList && property.PrimitiveItemType) {
            return this.cfPrimitiveToJsDocPrimitive(property.PrimitiveItemType) + "[]"
        }
        else if (property.Type === "List" && property.ItemType) {
            let fullPropertyName = CloudFormationUtils.getFullPropertyTypeName(parentParsedName, property.ItemType)
            return this.getPropertyTypeTypedefName(fullPropertyName) + [];
        }
        else if (property.PrimitiveType) {
            return this.cfPrimitiveToJsDocPrimitive(property.PrimitiveType)
        }
        else if (property.Type) {
            let fullPropertyName = CloudFormationUtils.getFullPropertyTypeName(parentParsedName, property.Type)
            return this.getPropertyTypeTypedefName(fullPropertyName);
        }
        // else throw new Error(`Unable to determine datatype for property `)
    }


    static generateNamespace(namespaceName) {
        return JsDocGenerator.generateComment([ `@namespace ${namespaceName}` ])
    }

    /**
     * Generates a JsDoc comment (like this one) from the given lines of content
     * @param {string[]} lines 
     */
    static generateComment(lines) {
        return ['/**'].concat(lines.map(l => ` * ${l}`)).concat([' */'])
    }
}