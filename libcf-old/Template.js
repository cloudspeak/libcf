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

 /**
  * Represents a CloudFormation template.  Resources can be added to the template either by using
  * the constructor:
  * 
  * ```
  * new cf.Template({
  *     MyBucket: new cf.AWS.S3.Bucket({
  *     BucketName: "MyTestBucket"
  *     })
  * })
  * ```
  * 
  * or by using the `setResource` builder method:
  * 
  * ```
  * new cf.Template()
  *     .setResource("MyBucket", new cf.AWS.S3.Bucket({
  *                 BucketName: "MyTestBucket"
  *             })
  * ```
  * 
  * The Template class naturally has the same structure as a CloudFormation template so can be
  * serialised directly to JSON, although the `templateJSON` accessor is also provided for
  * convenience.
  * 
  * By default, the template version will be set to the default value.  This can be overidden
  * using the `setVersion` or `clearVersion` methods.
  * 
  */
module.exports = class Template {

    /**
     * The default version for CloudFormation templates.
     * 
     * See https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/format-version-structure.html
     */
    static get DefaultVersion() {
        return "2010-09-09"
    }

    /**
     * Create a new CloudFormation template from the given resources.
     * 
     * The template will be given the default template version.
     * @param {object} [resources] The template resources
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
     * Returns the template as a JSON string
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
     * @returns {Template} This template
     */
    setVersion(version) {
        this.template.AWSTemplateFormatVersion = version;
        return this;
    }

    /**
     * Builder pattern method which clears the template version.  The version is set by default,
     * so this method allows the version field to be removed.
     * 
     * See https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/format-version-structure.html
     * @returns {Template} This template
     */
    clearVersion() {
        delete this.template.AWSTemplateFormatVersion;
        return this;
    }

    /**
     * Builder pattern method which sets the template description
     * 
     * See https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/template-description-structure.html
     * @param {string} description Template description
     * @returns {Template} This template
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
     * @returns {Template} This template
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
     * @returns {Template} This template
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
     * @returns {Template} This template
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
     * @returns {Template} This template
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
     * @returns {Template} This template
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
     * @returns {Template} This template
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
     * @returns {Template} This template
     */
    setOutputs(outputs) {
        this.template.Outputs = outputs;
        return this;
    }
}