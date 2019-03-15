const JsDocGenerator = require('./JsDocGenerator')
const CloudFormationUtils = require('./CloudFormationUtils')
const NamespaceNode = require('./NamespaceNode')
const PropertyType = require('./PropertyType')

/**
 * Represents an entire CF resource namespace, which includes a resource type and all of its
 * property types
 * @property {CfPropertyTypeData} propertyTypes
 */
module.exports = class OrphanPropertyTypeNode extends NamespaceNode {

    /**
     * @param {TypeName} parsedName 
     * @param {CfPropertyTypeData} data 
     */
    constructor(parsedName, data) {
        super()
        this.parsedName = parsedName
        this.data = data
        this.propertyType = new PropertyType(this.parsedName, this.data)
    }

    generateCode(assignment) {
        return [
            ...this.propertyType.generateTypedef(),
            ...this.propertyType.generateCastFunctionComment(),
            `${assignment} function(properties) { return properties; }`
        ]
    }

    generateTypedef() {
        return JsDocGenerator.generatePropertiesTypedef(this.parsedName, this.data.Properties)
    }


}