# Cloudspeak libcf

Libcf is a library which helps you to write AWS CloudFormation templates in pure JavaScript/TypeScript.

There are three goals of libcf:

* Facilitate the imperative, programmatic generation of CloudFormation templates
* Provide strong typing and intellisense when used with a compatible IDE such as [VSCode](https://code.visualstudio.com/)
* Provide simpler, more readable and writable syntax

Libcf contains almost no logic.  Its main contribution is a set of documented classes and interfaces representing CloudFormation resource and property types, a class representing a CloudFormation template, and functions which provide easier access to CloudFormation's intrinsic functions.

## Installation

To use libcf in your project, install it using `yarn` or `npm`:

```
yarn add cloudspeak-libcf
```

and import the components you need using CommonJS modules (e.g. for node.js JavaScript):

```
const { Cf, Template } = require('cloudspeak-libcf')
```

or using ES6 imports (e.g. for TypeScript):

```
import { Cf, Template } from 'cloudspeak-libcf'
```

## Getting started

CloudFormation resources each have their own class within the `Cf` namespace, and are named and namespaced according to their [full CloudFormation resource type names](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-template-resource-type-ref.html).  The constructor always takes the resource type's properties as its argument.  For example, an [S3 bucket resource](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket.html) can be created with the following code:

```javascript
let bucket = new Cf.AWS.S3.Bucket({
    BucketName: "MyBucketName"
})
```

To generate a template with resources, create an instance of the `Template` class, which takes the resources as its constructor argument:

```javascript
let template = new Template({
    MyBucket: new Cf.AWS.S3.Bucket({
        BucketName: "MyBucketName"
    }),
    MySnsTopic: new Cf.AWS.SNS.Topic({
        DisplayName: "TestTopic"
    })
})

console.log("Template JSON:", template.json)
```

The `Template` class and resource classes naturally serialize to valid CloudFormation templates, although the `json` and `prettyJson` accessors are provided for convenience.


## Other template properties

Libcf does not yet provide strong typing for template attributes other than `Resources`, such as `Metadata`, `Outputs`, etc., however these attributes do exist on the template class.  There are also methods named `setMetadata`, `setOutputs`, etc. which return the template object, thus allowing them to be used in a builder-like pattern:

```javascript
let template = new Template({
    MyBucket: new Cf.AWS.S3.Bucket({
        BucketName: "MyBucketName"
    })
})
.setDescription("My example template")
.setOutputs({
    MyBucketName: {
        Value : "MyBucket",
        Export : { Name : "BucketName" }
    }
})
```

## Property types

Libcf provides an interface for each CloudFormation property type.  These may be useful when, for example, re-using certain property values across different resources.  To create a property type in JavaScript, you should use the static methods which exist on each resource type class.  For example, the following code shows how to create a [DynamoDB KeySchema](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-keyschema.html) property and store it for re-use by multiple resources:

```javascript
    let usersKeySchema = Cf.AWS.DynamoDB.Table.KeySchema({
            AttributeName: "UserId",
            KeyType: "HASH"
    })

    let template = new Template({
        UsersTable: new Cf.AWS.DynamoDB.Table({
            KeySchema: [ usersKeySchema ]
        }),
        UserProfilesTable: new Cf.AWS.DynamoDB.Table({
            KeySchema: [ usersKeySchema ]
        })
    })
```

(Note the use of the static `Cf.AWS.DynamoDB.Table.KeySchema` method - this convenience method simply returns the input without doing anything, however it has type information attached to it, which allows the VSCode's intellisense and type checking to work).

In TypeScript, the interface can be used directly:

```typescript
    let usersKeySchema: Cf.AWS.DynamoDB.TableKeySchema = ({
            AttributeName: "UserId",
            KeyType: "HASH"
    })
```

Note that the property type name (`KeySchema`) is prefixed by the resource type name (`Table`), due to name clashes which would occur otherwise.

## Other resource properties

Libcf does not yet provide strong typing for resource attributes other than `Properties`, such as `CreationPolicy`, `DependsOn`, etc., however these attributes do exist on all resource classes.  There are also methods named `setCreationPolicy`, `setDependsOn`, etc. which return the resource object, thus allowing them to be used in a builder-like pattern:

```javascript
let template = new Template({
    MyBucket: new Cf.AWS.S3.Bucket({
        BucketName: "MyBucketName"
    })
    .setDeletionPolicy("Retain")
    .setDependsOn([ "MyOtherResource" ])
})
```

## Intrinsic functions

Libcf also provides support for CloudFormation's [intrinsic functions](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/intrinsic-function-reference.html) such as `Ref` and `Fn::GetAtt`.  To match CloudFormation's syntax, all functions except `Ref` are located in the `Fn` namespace.  The functions also have simpler syntax so are easier to use than CloudFunction's unwieldy arrays used to pass parameters.

The following is an example of several intrinsic functions:

```javascript
let template = new Template({
    MySubnet: new cf.Cf.AWS.EC2.Subnet({
        AssignIpv6AddressOnCreation: true,
        CidrBlock: Fn.Select(0,
            Fn.Cidr(Fn.GetAtt("ExampleVpc", "CidrBlock"), 1, 8)
        ),
        Ipv6CidrBlock: Fn.Select(0,
            Fn.Cidr(
                Fn.Select(0, Fn.GetAtt("ExampleVpc", "Ipv6CidrBlocks"))
            ), 1, 64)
        ),
        VpcId: Ref("ExampleVpc")
    })
})
```

**Note:** libcf's intrinsic functions actually abuse the type system because their type signatures claim to return the *type that the CloudFormation function resolves to when the template is processed*, despite the fact that they _actually_ return CloudFormation syntax.  For example, the function call `Fn.GetAtt("MyRes", "MyAtt")` claims to return a `string`, since this allows its result to be used for a string resource property, as we would expect.  But what it actually returns is:

```
{
    "Fn::GetAtt": [ "MyRes", "MyAtt" ]
}
```

Usually this is not a problem, and it necessary for strict type checking of CloudFormation templates.  However in rare cases it may be necessary to force a value to take on a certain type using casting, discussed next.

## Casting values

In rare cases, it may be necessary to force the type system to ignore the types for a particular value.  For example, suppose that you need to insert some specific CloudFormation syntax which libcf does not support (perhaps because it is new):

```javascript
let template = new Template({
    MyBucket: new Cf.AWS.S3.Bucket({
        BucketName: {
            "Fn::SomeNewFunction": [ "param1" ]
        }
    })
})
```

This will yield a type error, since `BucketName` expects a `string`, and does not know that the `Fn::SomeNewFunction` function actually resolves to a string when the template is processed.  In such a situation, libcf provides a `Cast` function, which prompts the type system to ignore the types for this value:

```javascript
const { Cf, Template, Fn, Cast } = require('cloudspeak-libcf')

let template = new Template({
    MyBucket: new Cf.AWS.S3.Bucket({
        BucketName: Cast({
            "Fn::SomeNewFunction": [ "param1" ]
        })
    })
})
```
