import { ResourceType } from './ResourceType';
import { PropertyType } from './PropertyType';
import { RootNode } from './RootNode';

export class NamespaceNode extends RootNode {

    resource: ResourceType
    properties: PropertyType[]

    constructor(private name: string) {
        super()
        this.properties = []
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

        let propertyCode = this.properties.reduce((array: string[], prop: PropertyType) => {
            return array.concat(prop.generateNamespaceInterface())
        }, [])
        childrenCode = childrenCode.concat(propertyCode)

        if (this.resource) {
            childrenCode = childrenCode.concat(this.resource.generateCode())
        }

        return [
            `export namespace ${this.name} {`,
            ...childrenCode.map(s => `  ${s}`),
            '}'
        ]
    }

}
