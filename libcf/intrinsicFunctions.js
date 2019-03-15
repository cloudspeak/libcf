module.exports = {

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
     * @param {string} logicalName The logical name of the resource or parameter you want to dereference
     * @returns {string} The physical ID of the resource or the value of the parameter.
     */
    Ref: function(logicalName) {
        return {
            Ref: logicalName
        }
    },

    Fn: {

        /**
         * The intrinsic function `Fn::Base64` returns the Base64 representation of the input string.
         * This function is typically used to pass encoded data to Amazon EC2 instances by way of the
         * `UserData` property.
         * @param {string} valueToEncode The string value you want to convert to Base64
         * @returns {string} The original string, in Base64 representation
         */
        Base64: function(valueToEncode) {
            return {
                "Fn::Base64": valueToEncode
            }
        },


        GetAtt: function(logicalNameOfResource, attributeName) {
            return {
                "Fn::GetAtt": [
                    logicalNameOfResource,
                    attributeName
                ]
            }
        }
    }
}
