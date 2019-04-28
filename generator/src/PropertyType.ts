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

    generateCastFunctionComment() {
        return JsDocGenerator.generateComment([
            `Create a new ${this.parsedName.fullname}`,
            ``,
            this.data.Documentation ? `See ${this.data.Documentation}` : ''
        ])
    }

    generateCastFunction() {
        return [
            ...this.generateCastFunctionComment(),
            `export function ${this.parsedName.propertyName}(properties: ${TsGenerator.getPropertyTypeInterfaceName(this.parsedName)}) ` + 
                    `: ${TsGenerator.getPropertyTypeInterfaceName(this.parsedName)} {`,
                    `  return properties;`,
                    `}`
        ]
    }

    generateStaticCastFunction() {
        return [
            ...this.generateCastFunctionComment(),
            `static ${this.parsedName.propertyName}(properties: ${TsGenerator.getPropertyTypeInterfaceName(this.parsedName)}) ` + 
                    `: ${TsGenerator.getPropertyTypeInterfaceName(this.parsedName)} {`,
                    `  return properties;`,
                    `}`
        ]
    }

    generateStaticTypeNameFunction() {
        return [
            `/**`,
            ` * Returns the ${this.parsedName.propertyName} property type name (\`"${this.parsedName.fullname}"\`)`,
            ` */`,
            `static get ${this.parsedName.propertyName}TypeName(): string {`,
            `  return "${this.parsedName.fullname}"`,
            `}`
        ]
    }

}