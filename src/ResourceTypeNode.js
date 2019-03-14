const CloudFormationUtils = require('./CloudFormationUtils')
const NamespaceNode = require('./NamespaceNode')
const PropertyType = require('./PropertyType')

/**
 * Represents an entire CF resource namespace, which includes a resource type and all of its
 * property types
 * @property {CfPropertyTypeData} propertyTypes
 */
module.exports = class ResourceTypeNode extends NamespaceNode {

    /**
     * @param {TypeName} parsedName 
     * @param {CfResourceTypeData} data 
     */
    constructor(parsedName, data) {
        super()
        this.parsedName = parsedName
        this.data = data
        /** @type {PropertyType[]} */
        this._propertyTypes = []
    }

    /**
     * @param {PropertyType} propertyType
     */
    addPropertyType(propertyType) {
        this._propertyTypes.push(propertyType)
    }

    generateCode() {
        let propertyCode = this._propertyTypes.reduce((array, p) => array.concat(p.generateCode()), [])
        propertyCode = propertyCode.map(line => '  ' + line)

        return [
            'class {',
            ...propertyCode,
            '}'
        ]
    }

}

