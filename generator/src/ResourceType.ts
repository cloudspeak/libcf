import { JsDocGenerator } from './JsDocGenerator'
import { PropertyType } from './PropertyType'
import { TypeName } from './TypeName';
import { CfResourceTypeData } from './CloudFormationDefinitionTypes';
import { TsGenerator } from './TsGenerator';

/**
 * Represents an entire CF resource namespace, which includes a resource type and all of its
 * property types
 * @property {CfPropertyTypeData} propertyTypes
 */
export class ResourceType {

    parsedName: TypeName
    data: CfResourceTypeData
    _propertyTypes: PropertyType[]

    constructor(parsedName, data) {
        this.parsedName = parsedName
        this.data = data
        this._propertyTypes = []
    }

    /**
     * @param {PropertyType} propertyType
     */
    addPropertyType(propertyType) {
        this._propertyTypes.push(propertyType)
    }

    generateCode() {
        let propertyCode = this._propertyTypes.reduce((array, p) => array.concat(p.generateStaticCastFunction()), [])
        let innerCode = [
            ...this.generateInstanceVariables(),
            ...this.generateConstructorComment(),
            ...this.generateConstructor(),
            ...this.generateAttributeBuilder('CreationPolicy'),
            ...this.generateAttributeBuilder('DeletionPolicy'),
            ...this.generateAttributeBuilder('DependsOn'),
            ...this.generateAttributeBuilder('Metadata'),
            ...this.generateAttributeBuilder('UpdatePolicy'),
            ...this.generateAttributeBuilder('UpdateReplacePolicy'),
            ...propertyCode
        ].map(line => '  ' + line)

        return [
            ...this.generatePropertiesInterface(),
            `export class ${this.parsedName.namespace[this.parsedName.namespace.length - 1]} implements ${TsGenerator.CfResourceInterfaceAlias} {`,
            ...innerCode,
            '}'
        ]
    }

    generateConstructorComment() {
        return JsDocGenerator.generateComment([
            `Create a new ${this.parsedName.fullname}`,
            ``,
            `See ${this.data.Documentation}`
        ])
    }

    generateInstanceVariables() {
        return [
            'Type: string',
            `Properties: ${TsGenerator.getResourceTypePropertiesInterfaceName(this.parsedName)}`
        ]
        
    }

    generatePropertiesInterface() {
        let tsName = TsGenerator.getResourceTypePropertiesInterfaceName(this.parsedName)
        let propertyListCode = TsGenerator.generatePropertyList(this.parsedName, this.data.Properties)
        propertyListCode = propertyListCode.map(s => `  ${s}`)

        return [
            `export interface ${tsName} {`,
            ...propertyListCode,
            '}'
        ]
    }

    generateConstructor() {
        return [
            `constructor(properties: ${TsGenerator.getResourceTypePropertiesInterfaceName(this.parsedName)}) {`,
            `    this.Type = "${this.parsedName.fullname}";`,
            '    this.Properties = properties;',
            '}'
        ]
    }

    generatePropertiesGetter() {
        return [
            `get properties(): ${TsGenerator.getResourceTypePropertiesInterfaceName(this.parsedName)} {`,
            '    return this.Properties;',
            '}'
        ]
    }
    
    generateAttributeBuilder(name) {
        return [
            `${name}: any`,
            `set${name}(value: any): ${this.parsedName.namespace[this.parsedName.namespace.length - 1]} {`,
            `    this.${name} = value;`,
            `    return this;`,
            '}'
        ]
    }

}