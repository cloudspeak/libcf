import * as fs from 'fs'
import * as path from 'path';
import { CfDefinitions } from './CloudFormationDefinitionTypes'
import { FileUtils } from './FileUtils';
import { CloudFormationUtils } from './CloudFormationUtils'
import { ResourceType } from './ResourceType'
import { NamespaceNode } from './NamespaceNode'
import { RootNode } from './RootNode';
import { PropertyType } from './PropertyType';

module.exports = class Generator {

    fileUtils: FileUtils
    outputFile: string
    data: CfDefinitions

    constructor(outputFile: string) {
        this.fileUtils = new FileUtils()
        this.outputFile = outputFile;
    }
    



    generate(filename: string) {

        this.data = CloudFormationUtils.loadSpec(filename)
        
        
        let exportsTree = this.createExportsTreeWithResourceTypes()
        let orphanProperties = this.addPropertyTypesToExportTree(exportsTree)
        let orphanCode = this.generateOrphanCode(orphanProperties)

        let codeLines = [ 
            '// *************************************************************************',
            '// This file was generated by cloudspeak-libcf-generator.  Do not modify',
            '// *************************************************************************',
            ...this.generateExportsCode(exportsTree),
            ...orphanCode
        ]
        let fileContent = codeLines.join('\n')
        this.fileUtils.createFolderTree(path.parse(this.outputFile).dir)
        fs.writeFileSync(this.outputFile, fileContent)
    }

    createExportsTreeWithResourceTypes(): RootNode {

        let root = new RootNode()

        for (let resourceTypeName in this.data.ResourceTypes) {
            let resourceTypeData = this.data.ResourceTypes[resourceTypeName]
            let parsedName = CloudFormationUtils.parseTypeName(resourceTypeName)

            let tree = root
            let namespaceLeaf: NamespaceNode

            for (let namespacePart of parsedName.namespace.slice(0, -1) ) {
                if (!tree.get(namespacePart)) {
                    tree.set(namespacePart, new NamespaceNode(namespacePart))
                }
                namespaceLeaf = tree.get(namespacePart)
                tree = tree.get(namespacePart)
            }

            namespaceLeaf.resources.push(new ResourceType(parsedName, resourceTypeData))
        }

        return root
    }

    addPropertyTypesToExportTree(root: RootNode): any {
        let orphanProperties = []

        for (let propertyTypeName in this.data.PropertyTypes) {
            let propertyTypeData = this.data.PropertyTypes[propertyTypeName]
            let parsedName = CloudFormationUtils.parseTypeName(propertyTypeName)


            let tree = root
            let namespaceLeaf: NamespaceNode

            for (let namespacePart of parsedName.namespace.slice(0, -1) ) {
                namespaceLeaf = tree.get(namespacePart)
                tree = tree.get(namespacePart)
            }

            if (namespaceLeaf) {
                let propertyType = new PropertyType(parsedName, propertyTypeData)
                namespaceLeaf.addProperty(propertyType)

                let resourceType = namespaceLeaf.resources.find(r => r.parsedName.resourceName === parsedName.resourceName)
                resourceType.addPropertyType(propertyType)
            }
            else {
                orphanProperties.push(propertyTypeName)
            }

            
        }
        return orphanProperties
    }

    
    /**
     * @param {NamespaceNode} exportsTree 
     */
    generateOrphanCode(orphanProperties) {

        let code: string[]

        for (let propertyTypeName of orphanProperties) {
            if (propertyTypeName === "Tag") {
                let propertyTypeData = this.data.PropertyTypes[propertyTypeName]
                let parsedName = CloudFormationUtils.getFullPropertyTypeName(null, propertyTypeName)
                let propertyType = new PropertyType(parsedName, propertyTypeData)
                code = [
                    ...propertyType.generatePropertyTypeInterface(),
                    ...propertyType.generateCastFunction()
                ]
            }
            else {
                throw new Error("Unknown global property " + propertyTypeName)
            }
        }

        return code
    }
    /**
     * 
     * @param {NamespaceNode} exportsTree
     * @returns {string[]}
     */
    generateExportsCode(exportsTree: RootNode) {
        let exportsCode = exportsTree.generateCode()
        return exportsCode
    }
    

}