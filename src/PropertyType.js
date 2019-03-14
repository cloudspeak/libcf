const JsDocGenerator = require('./JsDocGenerator')

module.exports = class PropertyType {

    /**
     * @param {TypeName} parsedName 
     * @param {CfPropertyTypeData} data 
     */
    constructor(parsedName, data) {
        this.parsedName = parsedName
        this.data = data
    }

    /**
     * @returns {string[]}
     */
    generateCode() {
        return this.generateTypedef()
    }

    generateTypedef() {
        if (this.data.Properties) {
            let jsDocTypedef = `@typedef {Object} ${JsDocGenerator.getPropertyTypeTypedefName(this.parsedName)}`
            let jsDocProperties = Object.keys(this.data.Properties).map(propertyName => {
                let property = this.data.Properties[propertyName]
                let jsDocType = JsDocGenerator.getPropertyJsDocType(this.parsedName, property)
                return `@property {${jsDocType}} ${propertyName} ${propertyName}.`
            })
            return JsDocGenerator.generateComment([ jsDocTypedef ].concat(jsDocProperties))
        }
    }


}