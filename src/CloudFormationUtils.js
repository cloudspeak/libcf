const fs = require('fs');

/**
 * @typedef {Object} CfPropertyData
 * @property {string} Documentation
 * @property {boolean} Required
 * @property {string} UpdateType
 * @property {boolean} [DuplicatesAllowed]
 * @property {string} [Type]
 * @property {string} [PrimitiveType]
 * @property {string} [ItemType]
 * @property {string} [ItemPrimitiveType]
 */

/**
 * @typedef {Object.<string,CfPropertyData>} CfProperties
 */

/**
 * @typedef {Object} CfResourceTypeData
 * @property {string} Documentation
 * @property {CfProperties} Properties
 * @property {CfProperties} Attributes
 */

/**
 * @typedef {Object} CfPropertyTypeData
 * @property {string} Documentation
 * @property {CfProperties} Properties
 */


/**
 * @typedef {Object} CfDefinitions
 * @property {Object.<string,CfPropertyTypeData>} PropertyTypes
 * @property {Object.<string,CfResourceTypeData>} ResourceTypes
 * @property {string} ResourceSpecificationVersion
 */

module.exports = class CloudFormationUtils {

    /**
     * @typedef {Object} TypeName
     * @property {string} resourceName
     * @property {string} propertyName
     * @property {string[]} namespace
     */

    /**
     * @param {string} typeName
     * @returns {TypeName}
     */
    static parseTypeName(typeName) {
        let resourceName, propertyName
        [ resourceName, propertyName ] = typeName.split('.')
        let namespace = resourceName.split('::')

        return {
            resourceName,
            propertyName,
            namespace
        }
    }

    /**
     * @param {TypeName} parentTypeName 
     * @param {string} propertyName 
     */
    static getFullPropertyTypeName(parentTypeName, propertyName) {
        return {
            resourceName: parentTypeName.resourceName,
            propertyName: propertyName,
            namespace: parentTypeName.namespace
        }
    }

    /**
     * @param {string} filename 
     * @returns {CfDefinitions}
     */
    static loadSpec(filename) {
        return JSON.parse(fs.readFileSync(filename, 'utf8'));
    }

}