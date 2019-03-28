import { ObjectUtils } from './ObjectUtils'
import { JsDocGenerator } from './JsDocGenerator'
import { ResourceType } from './ResourceType';
import { PropertyType } from './PropertyType';
import { RootNode } from './RootNode';

export class NamespaceNode extends RootNode {

    resource: ResourceType
    properties: PropertyType[]

    constructor(private name: string) {
        super()
    }

    /**
     * @returns {string[]}
     */

    generateCode(): string[] {
        let childrenCode = Object.keys(this.children).reduce((array: string[], key: string) => {
            return array.concat(this.children[key].generateCode())
        }, [])

        return [
            `export namespace ${this.name} {`,
            ...childrenCode.map(s => `  ${s}`),
            '}'
        ]

        // let codeMap = ObjectUtils.mapObject(this.children,
        //         (key, value) => value.generateCode(``))                             // Map children to code arrays
        // codeMap = ObjectUtils.mapObject(codeMap, (key, value) => [                  // Add namespace
        //     ...JsDocGenerator.generateNamespace(key),
        //     ...value
        // ])
        // let codeArrays = ObjectUtils.objectToArray(codeMap)                         // Convert to array of string[]

        // for (let i = 0; i < codeArrays.length - 1; i++) {                           // Append with commas except last
        //     if (codeArrays[i]) {
        //         codeArrays[i][codeArrays[i].length - 1] += ','
        //     }
        // }

        // let codeArray = codeArrays.reduce((array, code) => array.concat(code), [])  // Flatten to a single array
        // codeArray = codeArray.map(line => '  ' + line)                              // Indentation

        // return [
        //     `export namespace ${this.name} {`,
        //     ...codeArray,
        //     '}'
        // ]
    }

}
