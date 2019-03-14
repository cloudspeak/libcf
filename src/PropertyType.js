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
        if (this.parsedName.namespace === "AWS::EC2::LaunchTemplate" &&  this.parsedName.propertyName === "CapacityReservationPreference") 
        { try{throw new Error()}catch(e) {} }

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
        else if (this.data.PrimitiveType) {
            let jsDocType = JsDocGenerator.cfPrimitiveToJsDocPrimitive(this.data.PrimitiveType)
            let jsDocTypedef = `@typedef {${jsDocType}} ${JsDocGenerator.getPropertyTypeTypedefName(this.parsedName)}`
            return JsDocGenerator.generateComment([ jsDocTypedef ])
        }
        else if (this.data.Type) {
            let jsDocType = JsDocGenerator.getPropertyJsDocType(this.parsedName, this.data)
            let jsDocTypedef = `@typedef {${jsDocType}} ${JsDocGenerator.getPropertyTypeTypedefName(this.parsedName)}`
            return JsDocGenerator.generateComment([ jsDocTypedef ])
        }
        else {
            throw new Error(`Type ${this.parsedName.fullname} does not have properties or a primitive type`)
        }
        
    }


}