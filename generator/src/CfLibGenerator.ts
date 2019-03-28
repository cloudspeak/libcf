import * as fs from 'fs'
import * as path from 'path';
import { CfDefinitions } from './CloudFormationDefinitionTypes'
import { FileUtils } from './FileUtils';
import { CloudFormationUtils } from './CloudFormationUtils'
import { ResourceType } from './ResourceType'
import { OrphanPropertyTypeNode } from './OrphanPropertyTypeNode'
import { NamespaceNode } from './NamespaceNode'
import { RootNode } from './RootNode';
import { PropertyType } from './PropertyType';

module.exports = class Generator {

    fileUtils: FileUtils
    outputPath: string
    data: CfDefinitions

    constructor(outputPath: string) {
        this.fileUtils = new FileUtils()
        this.outputPath = outputPath;
    }
    



    generate(filename: string) {

        this.data = CloudFormationUtils.loadSpec(filename)
        
        
        let exportsTree = this.createExportsTreeWithResourceTypes()
        let orphanProperties = this.addPropertyTypesToExportTree(exportsTree)

        console.log("ORPHS", orphanProperties)

        //this.addOrphanedPropertyTypesToExportTree(exportsTree, orphanProperties)

        let codeLines = [ 
            '// *************************************************************************',
            '// This file was generated by cloudspeak-libcf-generator.  Do not modify',
            '// *************************************************************************',
            ...this.generateExportsCode(exportsTree)
        ]
        let fileContent = codeLines.join('\n')

        let outputFile = path.join(this.outputPath, "cfDefinitions.ts")
        this.fileUtils.createFolderTree(this.outputPath)
        fs.writeFileSync(outputFile, fileContent)        
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
                namespaceLeaf.addProperty(new PropertyType(parsedName, propertyTypeData))
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
    addOrphanedPropertyTypesToExportTree(exportsTree, orphanProperties) {

        for (let propertyTypeName of orphanProperties) {
            if (propertyTypeName === "Tag") {
                let propertyTypeData = this.data.PropertyTypes[propertyTypeName]
                let parsedName = {
                    propertyName: propertyTypeName,
                    resourceName: null,
                    namespace: null,
                    fullname: propertyTypeName
                }
                exportsTree.set(propertyTypeName, new OrphanPropertyTypeNode(parsedName, propertyTypeData))
            }
            else {
                throw new Error("Unknown global property " + propertyTypeName)
            }
        }
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