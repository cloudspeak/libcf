const ObjectUtils = require('./ObjectUtils')
const JsDocGenerator = require('./JsDocGenerator')

module.exports = class NamespaceNode {
    
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

    generateCode(assignment) {
        let codeMap = ObjectUtils.mapObject(this.children,
                (key, value) => value.generateCode(`${key}: `))                     // Map children to code arrays
        codeMap = ObjectUtils.mapObject(codeMap, (key, value) => [                  // Add namespace
            ...JsDocGenerator.generateNamespace(key),
            ...value
        ])
        let codeArrays = ObjectUtils.objectToArray(codeMap)                         // Convert to array of string[]

        for (let i = 0; i < codeArrays.length - 1; i++) {                           // Append with commas except last
            if (codeArrays[i]) {
                codeArrays[i][codeArrays[i].length - 1] += ','
            }
        }

        let codeArray = codeArrays.reduce((array, code) => array.concat(code), [])  // Flatten to a single array
        codeArray = codeArray.map(line => '  ' + line)                              // Indentation

        return [
            `${assignment}{`,
            ...codeArray,
            '}'
        ]
    }

}
