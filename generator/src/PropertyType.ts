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

    hasPropertyList() {
        return this.data.hasOwnProperty('Properties')
    }

    generatePropertyTypeInterface(partial: boolean = false) {

        if (!this.hasPropertyList()) {
            if (partial) {
                return []
            }

            let tsName = TsGenerator.getPropertyTypeInterfaceName(this.parsedName)
            return [
                `type ${tsName} = ${TsGenerator.getPropertyTsType(this.parsedName, this.data as CfPropertyData)}`
            ]
        }
        else {
            let propertyTypeData = this.data as CfPropertyTypeData
            let propertyListCode = TsGenerator.generatePropertyList(this.parsedName, propertyTypeData.Properties, !partial)
            propertyListCode = propertyListCode.map(s => `  ${s}`)

            let tsName = partial
                    ? TsGenerator.getPartialPropertyTypeInterfaceName(this.parsedName)
                    : TsGenerator.getPropertyTypeInterfaceName(this.parsedName)

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


    generatePartialCastFunctionComment() {
        return JsDocGenerator.generateComment([
            `Create a new partial ${this.parsedName.fullname}.  Partial property objects have the`,
            `same fields as full property objects, except that all of their fields are optional.`,
            `This may be useful when capturing the value of only some of the property type's`,
            `fields without causing a type error.`,
            ``,
            this.data.Documentation ? `See ${this.data.Documentation}` : ''
        ])
    }

    generatePartialStaticCastFunction() {
        if (!this.hasPropertyList()) {
            return []
        }

        return [
            ...this.generatePartialCastFunctionComment(),
            `static ${this.parsedName.propertyName}${TsGenerator.PartialPropertyTypeInterfaceSuffix}` + 
                    `(properties: ${TsGenerator.getPartialPropertyTypeInterfaceName(this.parsedName)}) ` + 
                    `: ${TsGenerator.getPartialPropertyTypeInterfaceName(this.parsedName)} {`,
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