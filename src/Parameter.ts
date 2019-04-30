/**
 * @file Interface which represents a CloudFormation parameter.
 */


/**
 * Represents a CloudFormation parameter, as specified by the CloudFormation template specification.
 * 
 * See https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/parameters-section-structure.html
 */
export interface Parameter {
    /**
     * A regular expression that represents the patterns to allow for `String` types.
     */
    AllowedPattern?: string

    /**
     * An array containing the list of values allowed for the parameter.
     */
    AllowedValues?: any[]

    /**
     * A string that explains a constraint when the constraint is violated. For example, without
     * a constraint description, a parameter that has an allowed pattern of `[A-Za-z0-9]+`
     * displays the following error message when the user specifies an invalid value:
     * 
     * `Malformed input-Parameter MyParameter must match pattern [A-Za-z0-9]+`
     * 
     * By adding a constraint description, such as must only contain letters (uppercase and
     * lowercase) and numbers, you can display the following customized error message:
     * 
     * `Malformed input-Parameter MyParameter must only contain uppercase and lowercase letters and numbers`
     */
    ConstraintDescription?: string

    /**
     * A value of the appropriate type for the template to use if no value is specified when a
     * stack is created. If you define constraints for the parameter, you must specify a value
     * that adheres to those constraints.
     */
    Default?: any

    /**
     * A string of up to 4000 characters that describes the parameter.
     */
    Description?: string

    /**
     * An integer value that determines the largest number of characters you want to allow for
     * `String` types.
     */
    MaxLength?: number

    /**
     * A numeric value that determines the largest numeric value you want to allow for `Number`
     * types.
     */
    MaxValue?: number

    /**
     * An integer value that determines the smallest number of characters you want to allow for
     * `String` types.
     */
    MinLength?: number

    /**
     * A numeric value that determines the smallest numeric value you want to allow for `Number`
     * types.
     */
    MinValue?: number

    /**
     * Whether to mask the parameter value when a call is made that describes the stack. If
     * you set the value to `true`, the parameter value is masked with asterisks (`*****`).
     */
    NoEcho?: boolean

    /**
     * The data type for the parameter (DataType).
     * 
     * See https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/parameters-section-structure.html
     */
    Type: string
}