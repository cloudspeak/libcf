/**
 * @typedef {object} CfTemplate
 * @property {string} [Version]
 * @property {string} [Description]
 * @property {object} [Metadata]
 * @property {object} [Parameters]
 * @property {object} [Mappings]
 * @property {object} [Conditions]
 * @property {object} [Transform]
 * @property {object} Resources
 * @property {object} [Outputs]
 */

module.exports = class Stack {

    /**
     * The default version for CloudFormation templates.
     * 
     * See https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/format-version-structure.html
     */
    static get DefaultVersion() {
        return "2010-09-09"
    }

    /**
     * Create a new CloudFormation stack template from the given resources.
     * 
     * The stack will be given the default template version.
     * @param {object} [resources] The stack resources
     */
    constructor(resources) {
        /** @type {CfTemplate} */
        this.template = {};
        
        if (!resources) {
            resources = {}
        }
        this.template.Resources = resources;
    }

    /**
     * Returns the stack template as a JSON string
     * @returns {string}
     */
    get templateJson() {
        return JSON.stringify(this.template)
    }

    /**
     * Builder pattern method which sets the template version
     * 
     * See https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/format-version-structure.html
     * @param {string} version Template version
     * @returns {Stack} This stack
     */
    setVersion(version) {
        this.template.Version = version;
        return this;
    }

    /**
     * Builder pattern method which sets the template description
     * 
     * See https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/template-description-structure.html
     * @param {string} description Template description
     * @returns {Stack} This stack
     */
    setDescription(description) {
        this.template.Description = description;
        return this;
    }

    /**
     * Builder pattern method which inserts or updates a resource on the
     * template.
     * 
     * See https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/resources-section-structure.html
     * @param {string} name The logical name of the resource in the template
     * @param {object} resourceDescription The resource description object
     * @returns {Stack} This stack
     */
    setResource(name, resourceDescription) {
        this.template.Resources[name] = resourceDescription
        return this;
    }

    /**
     * Builder pattern method which sets the template metadata
     * 
     * See https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/metadata-section-structure.html
     * @param {object} metadata Template metadata
     * @returns {Stack} This stack
     */
    setMetadata(metadata) {
        this.template.Metadata = metadata;
        return this;
    }

    /**
     * Builder pattern method which sets the template parameters
     * 
     * See https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/parameters-section-structure.html
     * @param {object} parameters Template parameters
     * @returns {Stack} This stack
     */
    setParameters(parameters) {
        this.template.Parameters = parameters;
        return this;
    }
    
    /**
     * Builder pattern method which sets the template mappings
     * 
     * See https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/mappings-section-structure.html
     * @param {object} mappings Template mappings
     * @returns {Stack} This stack
     */
    setMappings(mappings) {
        this.template.Mappings = mappings;
        return this;
    }
    
    /**
     * Builder pattern method which sets the template conditions
     * 
     * See https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/conditions-section-structure.html
     * @param {object} conditions Template conditions
     * @returns {Stack} This stack
     */
    setConditions(conditions) {
        this.template.Conditions = conditions;
        return this;
    }

    /**
     * Builder pattern method which sets the template transforms
     * 
     * See https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/transform-section-structure.html
     * @param {object} transforms Template transforms
     * @returns {Stack} This stack
     */
    setTransform(transforms) {
        this.template.Transform = transforms;
        return this;
    }

    /**
     * Builder pattern method which sets the template outputs
     * 
     * See https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/outputs-section-structure.html
     * @param {object} outputs Template outputs
     * @returns {Stack} This stack
     */
    setOutputs(outputs) {
        this.template.Outputs = outputs;
        return this;
    }
}