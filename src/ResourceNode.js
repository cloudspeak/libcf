const CloudFormationUtils = require('./CloudFormationUtils')
const NamespaceNode = require('./NamespaceNode')

/**
 * Represents an entire CF resource namespace, which includes a resource type and all of its
 * property types
 * @property {CfPropertyTypeData} propertyTypes
 */
module.exports = class ResourceNode extends NamespaceNode {

    /**
     * @typedef {object} CfResourceType
     * @property {TypeName} parsedName
     * @property {CfResourceTypeData} data
     */

    /**
     * @typedef {object} CfPropertyType
     * @property {TypeName} parsedName
     * @property {CfPropertyTypeData} data
     */

    /**
     * 
     * @param {CfResourceType} resourceType
     */
    constructor(resourceType) {
        super()
        this._resourceType = resourceType
        this._propertyTypes = []
    }

    /**
     * @param {CfPropertyType} propertyType 
     */
    addPropertyType(propertyType) {
        this._propertyTypes.push(propertyType)
    }

    generateCode() {
        return [ "ResourceCode"]
    }

}

