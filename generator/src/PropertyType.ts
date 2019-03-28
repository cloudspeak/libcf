import { JsDocGenerator } from './JsDocGenerator'
import { TypeName } from './TypeName';
import { CfPropertyTypeData, CfPropertyData } from './CloudFormationDefinitionTypes';
import { TsGenerator } from './TsGenerator';

export class PropertyType {

    parsedName: TypeName
    data: CfPropertyTypeData | CfPropertyData

    constructor(parsedName, data) {
        this.parsedName = parsedName
        this.data = data
    }

    generatePropertyTypeInterface() {
        let tsName = TsGenerator.getPropertyTypeInterfaceName(this.parsedName)

        if (!this.data.hasOwnProperty('Properties')) {
            console.log("No props:", this.parsedName.fullname)
            return [
                `type ${tsName} = ${TsGenerator.getPropertyTsType(this.parsedName, this.data as CfPropertyData)}`
            ]
        }
        else {
            let propertyTypeData = this.data as CfPropertyTypeData
            let propertyListCode = TsGenerator.generatePropertyList(this.parsedName, propertyTypeData.Properties)
            propertyListCode = propertyListCode.map(s => `  ${s}`)

            return [
                `export interface ${tsName} {`,
                ...propertyListCode,
                '}'
            ]
        }
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