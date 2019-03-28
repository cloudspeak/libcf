import { JsDocGenerator } from './JsDocGenerator'
import { TypeName } from './TypeName';
import { CfPropertyTypeData } from './CloudFormationDefinitionTypes';

export class PropertyType {

    parsedName: TypeName
    data: CfPropertyTypeData

    constructor(parsedName, data) {
        this.parsedName = parsedName
        this.data = data
    }

    /**
     * @returns {string[]}
     */
    generateCode() {
        return [
            //...this.generateTypedef(),
            ...this.generateCastFunctionComment(),
            ...this.generateCastFunction()
        ]
    }

    generateTypedef() {
        // if (this.data.Properties) {
        //     return JsDocGenerator.generatePropertiesTypedef(this.parsedName, this.data.Properties)
        // }
        // else if (this.data.PrimitiveType) {
        //     let jsDocType = JsDocGenerator.cfPrimitiveToJsDocPrimitive(this.data.PrimitiveType)
        //     let jsDocTypedef = `@typedef {${jsDocType}} ${JsDocGenerator.getPropertyTypeTypedefName(this.parsedName)}`
        //     return JsDocGenerator.generateComment([ jsDocTypedef ])
        // }
        // else if (this.data.Type) {
        //     let jsDocType = JsDocGenerator.getPropertyJsDocType(this.parsedName, this.data)
        //     let jsDocTypedef = `@typedef {${jsDocType}} ${JsDocGenerator.getPropertyTypeTypedefName(this.parsedName)}`
        //     return JsDocGenerator.generateComment([ jsDocTypedef ])
        // }
        // else {
        //     throw new Error(`Type ${this.parsedName.fullname} does not have properties or a primitive type`)
        // }
    }


    generateCastFunctionComment() {
        let typedefName = JsDocGenerator.getPropertyTypeTypedefName(this.parsedName)
        return JsDocGenerator.generateComment([
            `Create a new ${this.parsedName.fullname}`,
            ``,
            `See ${this.data.Documentation}`,
            `@param {${typedefName}} properties`,
            `@returns {${typedefName}}`
        ])
    }

    generateCastFunction() {
        return [
            `static ${this.parsedName.propertyName}(properties) { return properties; }`
        ]
    }


}