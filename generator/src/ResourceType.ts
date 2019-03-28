import { JsDocGenerator } from './JsDocGenerator'
import { CloudFormationUtils } from './CloudFormationUtils'
import { NamespaceNode } from './NamespaceNode'
import { PropertyType } from './PropertyType'
import { TypeName } from './TypeName';
import { CfResourceTypeData } from './CloudFormationDefinitionTypes';

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
        let propertyCode = this._propertyTypes.reduce((array, p) => array.concat(p.generateCode()), [])
        let innerCode = [
            ...this.generateInstanceVariables(),
            ...this.generateConstructorComment(),
            ...this.generateConstructor(),
            ...this.generatePropertiesGetter(),
            // ...this.generateAttributeBuilder('CreationPolicy'),
            // ...this.generateAttributeBuilder('DeletionPolicy'),
            // ...this.generateAttributeBuilder('DependsOn'),
            // ...this.generateAttributeBuilder('Metadata'),
            // ...this.generateAttributeBuilder('UpdatePolicy'),
            // ...this.generateAttributeBuilder('UpdateReplacePolicy'),
            ...propertyCode
        ].map(line => '  ' + line)

        return [
            `export class ${this.parsedName.namespace[this.parsedName.namespace.length - 1]} {`,
            ...innerCode,
            '}'
        ]
    }

    generateConstructorComment() {
        let typedefName = JsDocGenerator.getPropertyTypeTypedefName(this.parsedName)
        return JsDocGenerator.generateComment([
            `Create a new ${this.parsedName.fullname}`,
            ``,
            `See ${this.data.Documentation}`,
            `@param {${typedefName}} properties`
        ])
    }

    generateInstanceVariables() {
        return [
            'Type: string',
            'Properties: any'
        ]
        
    }

    generateConstructor() {
        return [
            'constructor(properties) {',
            `    this.Type = "${this.parsedName.fullname}";`,
            '    this.Properties = properties;',
            '}'
        ]
    }

    generatePropertiesGetter() {
        return [
            'get properties() {',
            '    return this.Properties;',
            '}'
        ]
    }
    
    generateAttributeBuilder(name) {
        return [
            `set${name}(value) {`,
            `    this.${name} = value;`,
            `    return this;`,
            '}'
        ]
    }

}