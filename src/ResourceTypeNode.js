const JsDocGenerator = require('./JsDocGenerator')
const CloudFormationUtils = require('./CloudFormationUtils')
const NamespaceNode = require('./NamespaceNode')
const PropertyType = require('./PropertyType')

/**
 * Represents an entire CF resource namespace, which includes a resource type and all of its
 * property types
 * @property {CfPropertyTypeData} propertyTypes
 */
module.exports = class ResourceTypeNode extends NamespaceNode {

    /**
     * @param {TypeName} parsedName 
     * @param {CfResourceTypeData} data 
     */
    constructor(parsedName, data) {
        super()
        this.parsedName = parsedName
        this.data = data
        /** @type {PropertyType[]} */
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
            ...this.generateTypedef(),
            ...this.generateConstructorComment(),
            ...this.generateConstructor(),
            ...this.generatePropertiesGetter(),
            ...this.generateAttributeBuilder('CreationPolicy'),
            ...this.generateAttributeBuilder('DeletionPolicy'),
            ...this.generateAttributeBuilder('DependsOn'),
            ...this.generateAttributeBuilder('Metadata'),
            ...this.generateAttributeBuilder('UpdatePolicy'),
            ...this.generateAttributeBuilder('UpdateReplacePolicy'),
            ...propertyCode
        ].map(line => '  ' + line)

        return [
            'class {',
            ...innerCode,
            '}'
        ]
    }

    generateTypedef() {
        return JsDocGenerator.generatePropertiesTypedef(this.parsedName, this.data.Properties)
    }

    generateConstructorComment() {
        let typedefName = JsDocGenerator.getPropertyTypeTypedefName(this.parsedName)
        return JsDocGenerator.generateComment([
            `Create a new ${this.parsedName.fullname}`,
            `@param {${typedefName}} properties`
        ])
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
            `add${name}(value) {`,
            `    this.${name} = value;`,
            `    return this;`,
            '}'
        ]
    }

}