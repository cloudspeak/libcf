// @ts-check
//import './CfTypes'

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

/**
 * @typedef {Object} TypeName
 * @property {string} resourceName
 * @property {string} propertyName
 * @property {string[]} namespace
 */

const fs = require('fs');
const path = require('path');
const FileUtils = require('./FileUtils')
const JsDocGenerator = require('./JsDocGenerator')
//const ResourceNamespace = require('./ResourceNamespace')




            //todo documemtation
            //todo required
            // todo need to test json type, which currently will act as object
            // exports

function mapObject(object, callback) {
    return Object.keys(object).reduce(
        (newObject, key) => {
            newObject[key] = callback(key, object[key])
            return newObject;
        }, {})
}

function objectToArray(object) {
    return Object.keys(object).reduce(
        (array, key) => {
            return array.concat([ object[key] ])
        }, [])
}


class NamespaceNode {
    
    constructor() {
        /** @type {Object.<string,NamespaceNode>} */
        this.children = {}
    }

    /**
     * @param {string} key
     */
    get(key) {
        return this.children[key]
    }
    
    /**
     * @param {string} key
     * @param {NamespaceNode} value
     */
    set(key, value) {
        this.children[key] = value
    }

    /**
     * @returns {string[]}
     */
    generateCode() {
        let codeMap = mapObject(this.children, (_, value) => value.generateCode())  // Map children to code arrays
        codeMap = mapObject(codeMap, (key, value) => [                              // Add field assignment
            ...JsDocGenerator.generateNamespace(key),
            `${key}: ${value[0]}`,
            ...value.slice(1)
        ])
        let codeArrays = objectToArray(codeMap)                                      // Convert to array of string[]

        for (let i = 0; i < codeArrays.length - 1; i++) {                            // Append with commas except last
            if (codeArrays[i]) {
                codeArrays[i][codeArrays[i].length - 1] += ','
            }
        }

        let codeArray = codeArrays.reduce((array, code) => array.concat(code), [])  // Flatten to a single array
        codeArray = codeArray.map(line => '  ' + line)                              // Indentation

        return [
            '{',
            ...codeArray,
            '}'
        ]
    }

}




/**
 * Represents an entire CF resource namespace, which includes a resource type and all of its
 * property types
 * @property {CfPropertyTypeData} propertyTypes
 */
class ResourceNamespace extends NamespaceNode {

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

module.exports = class Generator {

    constructor(outputPath) {
        this.fileUtils = new FileUtils()
        this.outputPath = outputPath;
    }
    


    /**
     * @param {string} typeName
     * @returns {TypeName}
     */
    parseTypeName(typeName) {
        let resourceName, propertyName
        [ resourceName, propertyName ] = typeName.split('.')
        let namespace = resourceName.split('::')

        return {
            resourceName,
            propertyName,
            namespace
        }
    }

    generate(filename) {

        /** @type {CfDefinitions} */
        this.data = JSON.parse(fs.readFileSync(filename, 'utf8'));
        
        let exportsTree = this.createExportsTreeWithResourceTypes(new NamespaceNode())
        let orphanProperties = this.addPropertyTypesToExportTree(exportsTree)
        let codeLines = this.generateExportsCode(exportsTree)
        let fileContent = codeLines.join('\n')

        let outputFile = path.join(this.outputPath, "cflib.js")
        this.fileUtils.createFolderTree(this.outputPath)
        fs.writeFileSync(outputFile, fileContent)        
    }

    /**
     * @param {NamespaceNode} exportsTree 
     */
    createExportsTreeWithResourceTypes(exportsTree) {

        for (let resourceTypeName in this.data.ResourceTypes) {
            let resourceTypeData = this.data.ResourceTypes[resourceTypeName]
            let parsedName = this.parseTypeName(resourceTypeName)

            let tree = exportsTree

            for (let namespacePart of parsedName.namespace.slice(0, -1) ) {
                if (!tree.get(namespacePart)) tree.set(namespacePart, new NamespaceNode())
                tree = tree.get(namespacePart)
            }

            tree.set(parsedName.namespace[parsedName.namespace.length - 1], new ResourceNamespace({
                parsedName,
                data: resourceTypeData
            }));
        }

        return exportsTree
    }

    
    /**
     * @param {NamespaceNode} exportsTree 
     */
    addPropertyTypesToExportTree(exportsTree) {
        let orphanProperties = []

        for (let propertyTypeName in this.data.PropertyTypes) {
            let propertyTypeData = this.data.PropertyTypes[propertyTypeName]
            let parsedName = this.parseTypeName(propertyTypeName)

            let tree = exportsTree
            for (let namespacePart of parsedName.namespace) {
                tree = tree.get(namespacePart)
            }

            /** @type {ResourceNamespace} */
            let resourceNamespace = (/** @type {ResourceNamespace} */ tree);
            
            if (resourceNamespace) {
                resourceNamespace.addPropertyType({
                    parsedName,
                    data: propertyTypeData
                })
            }
            else {
                orphanProperties.push(propertyTypeName)
            }
            
        }
        return orphanProperties
    }

    /**
     * 
     * @param {NamespaceNode} exportsTree
     * @returns {string[]}
     */
    generateExportsCode(exportsTree) {
        let exportsCode = exportsTree.generateCode()
        exportsCode[0] = `module.exports = ${exportsCode[0]}`
        return exportsCode
    }
    

}