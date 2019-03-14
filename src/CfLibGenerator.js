// @ts-check

const fs = require('fs');
const path = require('path');
const FileUtils = require('./FileUtils')
const JsDocGenerator = require('./JsDocGenerator')
const CloudFormationUtils = require('./CloudFormationUtils')
const ResourceTypeNode = require('./ResourceTypeNode')
const NamespaceNode = require('./NamespaceNode')
const Property = require('./PropertyType')

//const ResourceNamespace = require('./ResourceNamespace')




            //todo documemtation
            //todo required
            // todo need to test json type, which currently will act as object
            // exports





module.exports = class Generator {

    constructor(outputPath) {
        this.fileUtils = new FileUtils()
        this.outputPath = outputPath;
    }
    



    generate(filename) {

        this.data = CloudFormationUtils.loadSpec(filename)
        
        
        let exportsTree = this.createExportsTreeWithResourceTypes(new NamespaceNode())
        let orphanProperties = this.addPropertyTypesToExportTree(exportsTree)
        let codeLines = [ '// @ts-check', ...this.generateExportsCode(exportsTree) ]
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
            let parsedName = CloudFormationUtils.parseTypeName(resourceTypeName)

            let tree = exportsTree

            for (let namespacePart of parsedName.namespace.slice(0, -1) ) {
                if (!tree.get(namespacePart)) tree.set(namespacePart, new NamespaceNode())
                tree = tree.get(namespacePart)
            }

            tree.set(parsedName.namespace[parsedName.namespace.length - 1],
                    new ResourceTypeNode(parsedName, resourceTypeData
            ));
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
            let parsedName = CloudFormationUtils.parseTypeName(propertyTypeName)

            let tree = exportsTree
            for (let namespacePart of parsedName.namespace) {
                tree = tree.get(namespacePart)
            }

            /** @type {ResourceTypeNode} */
            let resourceNamespace = (/** @type {ResourceNamespace} */ tree);
            
            if (resourceNamespace) {
                resourceNamespace.addPropertyType(new Property(parsedName, propertyTypeData))
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