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
 * @typedef {Object} CfResourceTypeData
 * @property {string} Documentation
 * @property {Object.<string,CfPropertyData>} Properties
 * @property {Object.<string,CfPropertyData>} Attributes
 */

/**
 * @typedef {Object} CfPropertyTypeData
 * @property {string} Documentation
 * @property {Object.<string,CfPropertyData>} Properties
 */


/**
 * @typedef {Object} CfDefinitions
 * @property {Object.<string,CfPropertyTypeData>} PropertyTypes
 * @property {Object.<string,CfResourceTypeData>} ResourceTypes
 * @property {string} ResourceSpecificationVersion
 */

module.exports = class CloudFormationUtils {

    /**
     * @param {string} filename 
     * @returns {CfDefinitions}
     */
    static loadSpec(filename) {
        return JSON.parse(fs.readFileSync(filename, 'utf8'));
    }

}