

    // Documentation last updated 2019-03-15

    export function Cast<T>(arg: any): T {
        return arg as unknown as T
    }

    /**
     * The intrinsic function Ref returns the value of the specified parameter or resource.
     *  * When you specify a parameter's logical name, it returns the value of the parameter.
     *  * When you specify a resource's logical name, it returns a value that you can typically use to refer to that resource, such as a physical ID.
     * 
     * When you are declaring a resource in a template and you need to specify another template
     * resource by name, you can use the Ref to refer to that other resource. In general, Ref
     * returns the name of the resource. For example, a reference to an
     * `AWS::AutoScaling::AutoScalingGroup` returns the name of that Auto Scaling group resource.
     * For some resources, an identifier is returned that has another significant meaning in the
     * context of the resource. An `AWS::EC2::EIP` resource, for instance, returns the IP address,
     * and an `AWS::EC2::Instance` returns the instance ID.
     * 
     * See https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/intrinsic-function-reference-ref.html
     * 
     * @param logicalName The logical name of the resource or parameter you want to dereference
     * @returns The physical ID of the resource or the value of the parameter.
     */
    export function Ref(logicalName: string): string {
        return {
            Ref: logicalName
        } as unknown as string
    }

    export namespace Fn {

        /**
         * The intrinsic function `Fn::Base64` returns the Base64 representation of the input string.
         * This function is typically used to pass encoded data to Amazon EC2 instances by way of the
         * `UserData` property.
         * 
         * See https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/intrinsic-function-reference-base64.html
         * @param {string} valueToEncode The string value you want to convert to Base64
         * @returns {string} The original string, in Base64 representation
         */
        export function Base64(valueToEncode: string): string {
            return {
                "Fn::Base64": valueToEncode
            } as unknown as string
        }

        /**
         * The intrinsic function `Fn::Cidr` returns an array of CIDR address blocks. The number of
         * CIDR blocks returned is dependent on the count parameter.
         * 
         * See https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/intrinsic-function-reference-cidr.html
         * @param {string} ipBlock The user-specified CIDR address block to be split into smaller
         *      CIDR blocks.
         * @param {number|string} count The number of CIDRs to generate. Valid range is between 1 and 256.
         * @param {number|string} cidrBits The number of subnet bits for the CIDR. For example, specifying
         *     a value "8" for this parameter will create a CIDR with a mask of "/24".
         * 
         *      **Note:** Subnet bits is the inverse of subnet mask. To calculate the required host
         *      bits for a given subnet bits, subtract the subnet bits from 32 for IPv4 or 128 for
         *      IPv6.
         * @returns {string[]} An array of CIDR address blocks.
         */
        export function Cidr(ipBlock: string, count: number | string, cidrBits: number | string): string[] {
            return {
                "Fn::Cidr": [ipBlock, count, cidrBits]
            } as unknown as string[]
        }

        /**
         * The intrinsic function `Fn::FindInMap` returns the value corresponding to keys in a
         * two-level map that is declared in the `Mappings` section.
         * 
         * See https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/intrinsic-function-reference-findinmap.html
         * @param {string} mapName The logical name of a mapping declared in the Mappings section
         *      that contains the keys and values.
         * @param {string} topLevelKey The top-level key name. Its value is a list of key-value
         *      pairs.
         * @param {string} secondLevelKey The second-level key name, which is set to one of the
         *      keys from the list assigned to `TopLevelKey`.
         * @returns {string} The value that is assigned to `SecondLevelKey`.
         */
        export function FindInMap(mapName: string, topLevelKey: string, secondLevelKey: string): string {
            return {
                "Fn::FindInMap": [mapName, topLevelKey, secondLevelKey]
            } as unknown as string
        }

        /**
         * The `Fn::GetAtt` intrinsic function returns the value of an attribute from a resource
         * in the template.
         * 
         * See https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/intrinsic-function-reference-getatt.html
         * @param {string} logicalNameOfResource The logical name (also called *logical ID*) of the
         *      resource that contains the attribute that you want.
         * @param {string} The name of the resource-specific attribute whose value you want. See
         *      the resource's reference page for details about the attributes available for that
         *      resource type.
         * @returns The attribute value.
         */
        export function GetAtt<T>(logicalNameOfResource: string, attributeName): T {
            return {
                "Fn::GetAtt": [
                    logicalNameOfResource,
                    attributeName
                ]
            } as unknown as T
        }

        /**
         * The intrinsic function `Fn::GetAZs` returns an array that lists Availability Zones for a
         * specified region. Because customers have access to different Availability Zones, the
         * intrinsic function `Fn::GetAZs` enables template authors to write templates that adapt to
         * the calling user's access. That way you don't have to hard-code a full list of
         * Availability Zones for a specified region.
         * 
         * See https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/intrinsic-function-reference-getavailabilityzones.html
         * @param {string} region The name of the region for which you want to get the Availability
         *      Zones.
         *
         *      You can use the `AWS::Region` pseudo parameter to specify the region in which the
         *      stack is created. Specifying an empty string is equivalent to specifying
         *      `AWS::Region`.
         * 
         * @returns {string[]} The list of Availability Zones for the region.
         */
        export function GetAZs(region: string): string[] {
            return {
                "Fn::GetAZs": region
            } as unknown as string[]
        }

        /**
         * The intrinsic function `Fn::ImportValue` returns the value of an output exported by
         * another stack. You typically use this function to create cross-stack references. In the
         * following example template snippets, Stack A exports VPC security group values and Stack
         * B imports them.
         * 
         * See https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/intrinsic-function-reference-importvalue.html
         * @param {string} sharedValueToImport The stack output value that you want to import.
         */
        export function ImportValue<T>(sharedValueToImport: string): T {
            return {
                "Fn::ImportValue" : sharedValueToImport
            } as unknown as T
        }

        /**
         * The intrinsic function `Fn::Join` appends a set of values into a single value, separated
         * by the specified delimiter. If a delimiter is the empty string, the set of values are
         * concatenated with no delimiter.
         * 
         * See https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/intrinsic-function-reference-join.html
         * @param {string} delimiter The value you want to occur between fragments. The delimiter
         *      will occur between fragments only. It will not terminate the final value.
         * @param {string[]} listOfValues The list of values you want combined.
         * @returns {string} The combined string.
         */
        export function Join(delimiter: string, listOfValues: string[]): string {
            return {
                "Fn::Join": [ delimiter, listOfValues ]
            } as unknown as string
        }

        /**
         * The intrinsic function `Fn::Select` returns a single object from a list of objects by
         * index.
         * 
         * See https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/intrinsic-function-reference-select.html
         * @template T
         * @param {number|string} index The index of the object to retrieve. This must be a value from
         *      zero to N-1, where N represents the number of elements in the array.
         * @param {T[]} listOfObjects The list of objects to select from. This list must not
         *      be null, nor can it have null entries.
         * @returns {T} The selected object.
         */
        export function Select<T>(index: number | string, listOfObjects: T[]): T {
            return {
                "Fn::Select" : [ index, listOfObjects ]
            } as unknown as T
        }

        /**
         * To split a string into a list of string values so that you can select an element from
         * the resulting string list, use the `Fn::Split` intrinsic function. Specify the location
         * of splits with a delimiter, such as , (a comma). After you split a string, use the
         * `Fn::Select` function to pick a specific element.
         * 
         * For example, if a comma-delimited string of subnet IDs is imported to your stack
         * template, you can split the string at each comma. From the list of subnet IDs, use the
         * `Fn::Select` intrinsic function to specify a subnet ID for a resource.
         * 
         * See https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/intrinsic-function-reference-split.html
         * @param {string} delimiter A string value that determines where the source string is divided.
         * @param {string} sourceString The string value that you want to split.
         * @returns {string[]} A list of string values.
         */
        export function Split(delimiter: string, sourceString: string): string[] {
            return { "Fn::Split":
                [ delimiter, sourceString ]
            } as unknown as string[]
        }

        /**
         * The intrinsic function Fn::Sub substitutes variables in an input string with values that
         * you specify. In your templates, you can use this function to construct commands or
         * outputs that include values that aren't available until you create or update a stack.
         * 
         * See https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/intrinsic-function-reference-sub.html
         * @param {string} string A string with variables that AWS CloudFormation substitutes with
         *      their associated values at runtime. Write variables as `${MyVarName}`. Variables
         *      can be template parameter names, resource logical IDs, resource attributes, or a
         *      variable in a key-value map. If you specify only template parameter names, resource
         *      logical IDs, and resource attributes, don't specify a key-value map.
         * 
         *      If you specify template parameter names or resource logical IDs, such as
         *      `${InstanceTypeParameter}`, AWS CloudFormation returns the same values as if you
         *      used the Ref intrinsic function. If you specify resource attributes, such as
         *      `${MyInstance.PublicIp}`, AWS CloudFormation returns the same values as if you used
         *      the `Fn::GetAtt` intrinsic function.
         * 
         *      To write a dollar sign and curly braces (`${}`) literally, add an exclamation point
         *      (`!`) after the open curly brace, such as `${!Literal}`. AWS CloudFormation
         *      resolves this text as `${Literal}`.
         * @param {object} [variableMap] An object where each key is the name of a variable that
         *      you included in the `string` parameter, and each value is the value that AWS
         *      CloudFormation substitutes for the associated variable name at runtime.
         * @returns {string} AWS CloudFormation returns the original string, substituting the
         *      values for all of the variables.
         */
        export function Sub(string: string, variableMap?: {[key: string]: any}): string {
            if (variableMap) {
                return {
                    "Fn::Sub": [ string, variableMap ]
                } as unknown as string
            }
            else {
                return {
                    "Fn::Sub": string
                } as unknown as string
            }
        }

        /**
         * The intrinsic function `Fn::Transform` specifies a macro to perform custom processing
         * on part of a stack template. Macros enable you to perform custom processing on
         * templates, from simple actions like find-and-replace operations to extensive
         * transformations of entire templates. For more information, see [Using AWS CloudFormation
         * Macros to Perform Custom Processing on Templates](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/template-macros.html).
         * 
         * You can also use `Fn::Transform` to call the `AWS::Include` Transform transform, which
         * is a macro hosted by AWS CloudFormation.
         * 
         * See https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/intrinsic-function-reference-transform.html
         * @param {string} macroName The name of the macro you want to perform the processing.
         * @param {object} parameters The list parameters, specified as key-value pairs, to pass
         *      to the macro.
         * @returns {unknown} The processed template snippet to be included in the processed stack
         *      template.
         */
        export function Transform<T>(macroName: string, parameters: object): T {
            return {
                "Fn::Transform" : {
                    "Name" : macroName,
                    "Parameters" : parameters
                }
            } as unknown as T

        }

        /**
         * Returns `true` if all the specified conditions evaluate to `true`, or returns `false`
         * if any one of the conditions evaluates to false. `Fn::And` acts as an AND operator.
         * The minimum number of conditions that you can include is 2, and the maximum is 10.
         * 
         * See https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/intrinsic-function-reference-conditions.html#intrinsic-function-reference-conditions-and
         * @param {any[]} conditions A list of conditions that evaluate to `true` or `false`.
         */
        export function And(conditions: boolean[]): boolean {
            return {
                "Fn::And": conditions
            } as unknown as boolean
            
        }

        /**
         * Compares if two values are equal. Returns `true` if the two values are equal or `false`
         * if they aren't.
         * 
         * See https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/intrinsic-function-reference-conditions.html#intrinsic-function-reference-conditions-equals
         * @param {any} value1 A value of any type that you want to compare.
         * @param {any} value2 A value of any type that you want to compare.
         */
        export function Equals<T>(value1: T, value2: T): boolean {
            return {
                "Fn::Equals" : [ value1, value2 ]
            } as unknown as boolean
        }

        /**
         * Returns one value if the specified condition evaluates to `true` and another value if
         * the specified condition evaluates to `false`. Currently, AWS CloudFormation supports
         * the `Fn::If` intrinsic function in the metadata attribute, update policy attribute,
         * and property values in the Resources section and Outputs sections of a template. You
         * can use the `AWS::NoValue` pseudo parameter as a return value to remove the
         * corresponding property.
         * 
         * See https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/intrinsic-function-reference-conditions.html#intrinsic-function-reference-conditions-if
         * @param {string} conditionName A reference to a condition in the Conditions section. Use
         *      the condition's name to reference it.
         * @param {any} valueIfTrue A value to be returned if the specified condition evaluates to
         *      `true`.
         * @param {any} valueIfFalse A value to be returned if the specified condition evaluates
         *      to `false`.
         */
        export function If<T,U>(conditionName: string, valueIfTrue: T, valueIfFalse: U): T|U {
            return {
                "Fn::If": [ conditionName, valueIfTrue, valueIfFalse]
            } as unknown as T|U
        }

        /**
         * Returns `true` for a condition that evaluates to `false` or returns `false` for a
         * condition that evaluates to `true`. `Fn::Not` acts as a NOT operator.
         * 
         * See https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/intrinsic-function-reference-conditions.html#intrinsic-function-reference-conditions-not
         * @param {any} condition A condition such as `Fn::Equals` that evaluates to `true` or
         *      `false`.
         */
        export function Not(condition: boolean): boolean {
            return {
                "Fn::Not": [ condition ]
            } as unknown as boolean
        }

        /**
         * Returns `true` if any one of the specified conditions evaluate to `true`, or returns
         * `false` if all of the conditions evaluates to false. `Fn::Or` acts as an OR operator.
         * The minimum number of conditions that you can include is 2, and the maximum is 10.
         * 
         * See https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/intrinsic-function-reference-conditions.html#intrinsic-function-reference-conditions-or
         * @param {any[]} An array of conditions that evaluate to `true` or `false`.
         */
        export function Or(conditions: boolean[]): boolean {
            return {
                "Fn::Or": conditions
            } as unknown as boolean
        }
    }

