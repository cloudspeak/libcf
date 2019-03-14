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
    generateCode() {
        let codeMap = ObjectUtils.mapObject(this.children, (_, value) => value.generateCode())  // Map children to code arrays
        codeMap = ObjectUtils.mapObject(codeMap, (key, value) => [                              // Add field assignment
            ...JsDocGenerator.generateNamespace(key),
            `${key}: ${value[0]}`,
            ...value.slice(1)
        ])
        let codeArrays = ObjectUtils.objectToArray(codeMap)                                      // Convert to array of string[]

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
