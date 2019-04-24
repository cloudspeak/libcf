import { Resource } from "./Resource";

 /**
  * Represents a CloudFormation template.  Resources can be added to the template either by using
  * the constructor:
  * 
  * ```
  * new cf.Template({
  *         MyBucket: new cf.AWS.S3.Bucket({
  *         BucketName: "MyTestBucket"
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
  * serialised directly to JSON, although the `json` accessor is also provided for
  * convenience.
  * 
  * By default, the template version will be set to the default value.  This can be overidden
  * using the `setVersion` or `clearVersion` methods.
  * 
  */
export class Template {
    AWSTemplateFormatVersion: string
    Description: string
    Resources: {[key: string]: Resource}
    Metadata: any
    Parameters: any
    Mappings: any
    Conditions: any
    Transform: any
    Outputs: any

    /**
     * The default version for CloudFormation templates.
     * 
     * See https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/format-version-structure.html
     */
    static get DefaultVersion() {
        return "2010-09-09";
    }

    /**
     * Create a new CloudFormation template from the given resources.
     * 
     * The template will be given the default template version.
     * @param {object} [resources] The template resources
     */
    constructor(resources: {[key: string]: Resource}) {
        if (!resources) {
            resources = {}
        }
        this.AWSTemplateFormatVersion = Template.DefaultVersion;
        this.Resources = resources;
    }

    /**
     * Returns the template as a JSON string
     * @returns {string}
     */
    get json(): string {
        return JSON.stringify(this);
    }

    /**
     * Returns the template as a formatted JSON string
     * @returns {string}
     */
    get prettyJson(): string {
        return JSON.stringify(this, null, 2);
    }

    /**
     * Builder pattern method which sets the template version
     * 
     * See https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/format-version-structure.html
     * @param {string} version Template version
     * @returns {Template} This template
     */
    setVersion(version: string): Template {
        this.AWSTemplateFormatVersion = version;
        return this;
    }

    /**
     * Builder pattern method which clears the template version.  The version is set by default,
     * so this method allows the version field to be removed.
     * 
     * See https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/format-version-structure.html
     * @returns {Template} This template
     */
    clearVersion(): Template {
        delete this.AWSTemplateFormatVersion;
        return this;
    }

    /**
     * Builder pattern method which sets the template description
     * 
     * See https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/template-description-structure.html
     * @param {string} description Template description
     * @returns {Template} This template
     */
    setDescription(description: string): Template {
        this.Description = description;
        return this;
    }

    /**
     * Builder pattern method which inserts or updates a resource on the
     * template.
     * 
     * See https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/resources-section-structure.html
     * @param {string} name The logical name of the resource in the template
     * @param {Resource} resourceDescription The resource description object
     * @returns {Template} This template
     */
    setResource(name: string, resourceDescription: Resource): Template {
        this.Resources[name] = resourceDescription;
        return this;
    }

    /**
     * Builder pattern method which sets the template metadata
     * 
     * See https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/metadata-section-structure.html
     * @param {object} metadata Template metadata
     * @returns {Template} This template
     */
    setMetadata(metadata: any): Template {
        this.Metadata = metadata;
        return this;
    }

    /**
     * Builder pattern method which sets the template parameters
     * 
     * See https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/parameters-section-structure.html
     * @param {object} parameters Template parameters
     * @returns {Template} This template
     */
    setParameters(parameters: any): Template {
        this.Parameters = parameters;
        return this;
    }
    
    /**
     * Builder pattern method which sets the template mappings
     * 
     * See https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/mappings-section-structure.html
     * @param {object} mappings Template mappings
     * @returns {Template} This template
     */
    setMappings(mappings: any): Template {
        this.Mappings = mappings;
        return this;
    }
    
    /**
     * Builder pattern method which sets the template conditions
     * 
     * See https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/conditions-section-structure.html
     * @param {object} conditions Template conditions
     * @returns {Template} This template
     */
    setConditions(conditions: any): Template {
        this.Conditions = conditions;
        return this;
    }

    /**
     * Builder pattern method which sets the template transforms
     * 
     * See https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/transform-section-structure.html
     * @param {object} transforms Template transforms
     * @returns {Template} This template
     */
    setTransform(transforms: any): Template {
        this.Transform = transforms;
        return this;
    }

    /**
     * Builder pattern method which sets the template outputs
     * 
     * See https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/outputs-section-structure.html
     * @param {object} outputs Template outputs
     * @returns {Template} This template
     */
    setOutputs(outputs: any): Template {
        this.Outputs = outputs;
        return this;
    }
}