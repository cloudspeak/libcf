module.exports = class JsDocGenerator {

    static generateNamespace(namespaceName) {
        return JsDocGenerator.generateComment([ `@namespace ${namespaceName}` ])
    }

    /**
     * Generates a JsDoc comment (like this one) from the given lines of content
     * @param {string[]} lines 
     */
    static generateComment(lines) {
        return ['/**'].concat(lines.map(l => ` * ${l}`)).concat([' */'])
    }
}