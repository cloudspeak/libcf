import { ResourceType } from './ResourceType';
import { PropertyType } from './PropertyType';
import { RootNode } from './RootNode';
import { OrphanedPropertyType } from './OrphanedPropertyType';

export class NamespaceNode extends RootNode {

    resources: ResourceType[] = []
    properties: PropertyType[] = []
    orphanedProperties: OrphanedPropertyType[] = []

    constructor(private name: string) {
        super()
    }

    addProperty(property: PropertyType) {
        this.properties.push(property)
    }

    /**
     * @returns {string[]}
     */

    generateCode(): string[] {
        let childrenCode = Object.keys(this.children).reduce((array: string[], key: string) => {
            return array.concat(this.children[key].generateCode())
        }, [])

        let propertyInterfaceCode = this.properties.reduce((array: string[], prop: PropertyType) => {
            return array.concat(prop.generatePropertyTypeInterface())
        }, [])
        childrenCode = childrenCode.concat(propertyInterfaceCode)

        let partialPropertyInterfaceCode = this.properties.reduce((array: string[], prop: PropertyType) => {
            return array.concat(prop.generatePropertyTypeInterface(true))
        }, [])
        childrenCode = childrenCode.concat(partialPropertyInterfaceCode)

        let resourceCode = this.resources.reduce((array: string[], res: ResourceType) => {
            return array.concat(res.generateCode())
        }, [])
        childrenCode = childrenCode.concat(resourceCode)

        let orphanCode = this.orphanedProperties.reduce((array: string[], prop: OrphanedPropertyType) => {
            return array.concat(prop.generateCode())
        }, [])
        childrenCode = childrenCode.concat(orphanCode)

        return [
            `export namespace ${this.name} {`,
            ...childrenCode.map(s => `  ${s}`),
            '}'
        ]
    }

}
