/**
 * @file Interface which represents a CloudFormation output.
 */


/**
 * Represents a CloudFormation output, as specified by the CloudFormation template specification.
 * 
 * See https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/outputs-section-structure.html
 */
export interface Output {

    /**
     * A String type that describes the output value. The value for the description declaration
     * must be a literal string that is between 0 and 1024 bytes in length. You cannot use a
     * parameter or function to specify the description. The description can be a maximum of 4 K
     * in length.
     */
    Description?: string

    /**
     * The value of the property returned by the aws cloudformation describe-stacks command. The
     * value of an output can include literals, parameter references, pseudo-parameters, a mapping
     * value, or intrinsic functions.
     */
    Value: any

    /**
     * The name of the resource output to be exported for a cross-stack reference.
     */
    Export?: {Name: string}
}