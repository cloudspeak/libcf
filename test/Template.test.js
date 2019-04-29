//@ts-check

const { Template, Cf, Cast } = require('..')
const assert = require('assert');

test('Empty Template', () => {
    
    let libTemplate = norm(new Template({}))
    
    let expected = JSON.parse(`{
        "AWSTemplateFormatVersion" : "${Template.DefaultVersion}",
        "Resources": {}
    }`)
    assert.deepStrictEqual(libTemplate, expected)
})

test('When clearVersion is called, version is not present', () => {
    
    let libTemplate = norm(new Template({})
            .clearVersion())
    
    let expected = JSON.parse(`{
        "Resources": {}
    }`)
    assert.deepStrictEqual(libTemplate, expected)
})


test('Non-resource attributes', () => {

    let libTemplate = norm(new Template({})
            .setVersion("myver")
            .setDescription("mydescription")
            .setMetadata({ "met": "met1" })
        )
    
    let expected = JSON.parse(`{
        "AWSTemplateFormatVersion" : "myver",
        "Description": "mydescription",
        "Resources": {},
        "Metadata": { "met": "met1" }
    }`)
    assert.deepStrictEqual(libTemplate, expected)
})

test('Simple resource', () => {

    let libTemplate = norm(new Template({
        MyBucket: new Cf.AWS.S3.Bucket({
            BucketName: "TestBucket"
        })
    }))
    
    let expected = JSON.parse(`{
        "AWSTemplateFormatVersion" : "2010-09-09",
        "Resources": {
            "MyBucket": {
                "Type": "AWS::S3::Bucket",
                "Properties": {
                    "BucketName": "TestBucket"
                }
            }
        }
    }`)
    assert.deepStrictEqual(libTemplate, expected)
})


test('AWS Example Template', () => {
    let libTemplate = norm(new Template({
        S3Bucket: new Cf.AWS.S3.Bucket({
            AccessControl : "PublicRead",
            WebsiteConfiguration : {
                IndexDocument : "index.html",
                ErrorDocument : "error.html"
            }
        })
        .setDeletionPolicy("Retain")
    })
    .setDescription("AWS CloudFormation Sample Template")
    .setOutputs({
        "WebsiteURL" : {
          "Value" : { "Fn::GetAtt" : [ "S3Bucket", "WebsiteURL" ] },
          "Description" : "URL for website hosted on S3"
        },
        "S3BucketSecureURL" : {
          "Value" : { "Fn::Join" : [ "", [ "https://", { "Fn::GetAtt" : [ "S3Bucket", "DomainName" ] } ] ] },
          "Description" : "Name of S3 bucket to hold website content"
        }
      })
    )
    let expected = JSON.parse(`{
        "AWSTemplateFormatVersion" : "2010-09-09",
        "Description" : "AWS CloudFormation Sample Template",
        "Resources" : {
          "S3Bucket" : {
            "Type" : "AWS::S3::Bucket",
            "Properties" : {
              "AccessControl" : "PublicRead",
              "WebsiteConfiguration" : {
                "IndexDocument" : "index.html",
                "ErrorDocument" : "error.html"
               }
            },
            "DeletionPolicy" : "Retain"
          }
        },
        "Outputs" : {
          "WebsiteURL" : {
            "Value" : { "Fn::GetAtt" : [ "S3Bucket", "WebsiteURL" ] },
            "Description" : "URL for website hosted on S3"
          },
          "S3BucketSecureURL" : {
            "Value" : { "Fn::Join" : [ "", [ "https://", { "Fn::GetAtt" : [ "S3Bucket", "DomainName" ] } ] ] },
            "Description" : "Name of S3 bucket to hold website content"
          }
        }
    }`)
    assert.deepStrictEqual(libTemplate, expected)
})


test('When setResource is called for a nonexistent key then it is added', () => {

    let libTemplate = new Template({
        MyResource1: new Cf.AWS.S3.Bucket({ BucketName: "MyBucket1" })
    })

    libTemplate.setResource("MyResource2", new Cf.AWS.S3.Bucket({ BucketName: "MyBucket2" }))

    expect(libTemplate.Resources["MyResource1"]).toBeDefined()
    expect(libTemplate.Resources["MyResource1"]["Properties"]["BucketName"]).toBe("MyBucket1")
    expect(libTemplate.Resources["MyResource2"]).toBeDefined()
    expect(libTemplate.Resources["MyResource2"]["Properties"]["BucketName"]).toBe("MyBucket2")
})

test('When setResource is called for a existing key then it is overwritten', () => {

    let libTemplate = new Template({
        MyResource1: new Cf.AWS.S3.Bucket({ BucketName: "MyBucket1" }),
        MyResource2: new Cf.AWS.S3.Bucket({ BucketName: "MyBucket2a" })
    })

    libTemplate.setResource("MyResource2", new Cf.AWS.S3.Bucket({ BucketName: "MyBucket2b" }))

    expect(libTemplate.Resources["MyResource1"]).toBeDefined()
    expect(libTemplate.Resources["MyResource1"]["Properties"]["BucketName"]).toBe("MyBucket1")
    expect(libTemplate.Resources["MyResource2"]).toBeDefined()
    expect(libTemplate.Resources["MyResource2"]["Properties"]["BucketName"]).toBe("MyBucket2b")
})

test('When addResource is called for a nonexistent key then it is added', () => {

    let libTemplate = new Template({
        MyResource1: new Cf.AWS.S3.Bucket({ BucketName: "MyBucket1" })
    })

    libTemplate.addResource("MyResource2", new Cf.AWS.S3.Bucket({ BucketName: "MyBucket2" }))

    expect(libTemplate.Resources["MyResource1"]).toBeDefined()
    expect(libTemplate.Resources["MyResource1"]["Properties"]["BucketName"]).toBe("MyBucket1")
    expect(libTemplate.Resources["MyResource2"]).toBeDefined()
    expect(libTemplate.Resources["MyResource2"]["Properties"]["BucketName"]).toBe("MyBucket2")
})

test('When addResource is called for a existing key then an error is thrown', () => {

    let libTemplate = new Template({
        MyResource1: new Cf.AWS.S3.Bucket({ BucketName: "MyBucket1a" })
    })

    expect(() => {
        libTemplate.addResource("MyResource1", new Cf.AWS.S3.Bucket({ BucketName: "MyBucket1b" }))
    }).toThrowError("A resource with the logical ID 'MyResource1' already exists")

    expect(libTemplate.Resources["MyResource1"]).toBeDefined()
    expect(libTemplate.Resources["MyResource1"]["Properties"]["BucketName"]).toBe("MyBucket1a")
})

test('When addResources is called for multiple nonexistent keys then multiple resources are added', () => {

    let libTemplate = new Template({
        MyResource1: new Cf.AWS.S3.Bucket({ BucketName: "MyBucket1" })
    })

    libTemplate.addResources({
        MyResource2: new Cf.AWS.S3.Bucket({ BucketName: "MyBucket2" }),
        MyResource3: new Cf.AWS.S3.Bucket({ BucketName: "MyBucket3" })
    })

    expect(libTemplate.Resources["MyResource1"]).toBeDefined()
    expect(libTemplate.Resources["MyResource1"]["Properties"]["BucketName"]).toBe("MyBucket1")
    expect(libTemplate.Resources["MyResource2"]).toBeDefined()
    expect(libTemplate.Resources["MyResource2"]["Properties"]["BucketName"]).toBe("MyBucket2")
    expect(libTemplate.Resources["MyResource3"]).toBeDefined()
    expect(libTemplate.Resources["MyResource3"]["Properties"]["BucketName"]).toBe("MyBucket3")
})

test('When addResources is called for multiple nonexistent keys and one existing key then error is thrown and none are added', () => {

    let libTemplate = new Template({
        MyResource1: new Cf.AWS.S3.Bucket({ BucketName: "MyBucket1a" })
    })

    expect(() => {
        libTemplate.addResources({
            MyResource2: new Cf.AWS.S3.Bucket({ BucketName: "MyBucket2" }),
            MyResource1: new Cf.AWS.S3.Bucket({ BucketName: "MyBucket1b" }),
            MyResource3: new Cf.AWS.S3.Bucket({ BucketName: "MyBucket3" })
        })
    }).toThrowError("A resource with the logical ID 'MyResource1' already exists")

    expect(libTemplate.Resources["MyResource1"]).toBeDefined()
    expect(libTemplate.Resources["MyResource1"]["Properties"]["BucketName"]).toBe("MyBucket1a")
    expect(libTemplate.Resources["MyResource2"]).not.toBeDefined()
    expect(libTemplate.Resources["MyResource3"]).not.toBeDefined()
})

test('Outputs attribute', () => {

    let libTemplate = norm(new Template({})
            .setOutputs({
                myOutput: {
                    Description: "myDescription",
                    Export: {
                        Name: "myexportname"
                    },
                    Value: "myvalue"
                }
            })
        )
    
    let expected = JSON.parse(`{
        "AWSTemplateFormatVersion" : "${Template.DefaultVersion}",
        "Resources": {},
        "Outputs": {
            "myOutput": {
                "Description": "myDescription",
                "Export": {
                    "Name": "myexportname"
                },
                "Value": "myvalue"
            }
        }
    }`)
    assert.deepStrictEqual(libTemplate, expected)
})

test('Transform attribute', () => {

    let libTemplate = norm(new Template({})
            .setTransform(["mytrans1", "mytrans2"])
        )
    
    let expected = JSON.parse(`{
        "AWSTemplateFormatVersion" : "${Template.DefaultVersion}",
        "Resources": {},
        "Transform": ["mytrans1", "mytrans2"]
    }`)
    assert.deepStrictEqual(libTemplate, expected)
})

test('Conditions attribute', () => {

    let libTemplate = norm(new Template({})
            .setConditions({
                "CreateProdResources" : Cast({"Fn::Equals" : [{"Ref" : "EnvType"}, "prod"]})
            })
        )
    
    let expected = JSON.parse(`{
        "AWSTemplateFormatVersion" : "${Template.DefaultVersion}",
        "Resources": {},
        "Conditions": {
            "CreateProdResources" : {"Fn::Equals" : [{"Ref" : "EnvType"}, "prod"]}
        }
    }`)
    assert.deepStrictEqual(libTemplate, expected)
})

test('Mappings attribute', () => {

    let libTemplate = norm(new Template({})
            .setMappings({
                "RegionAndInstanceTypeToAMIID" : {
                    "us-east-1": {
                      "test": "ami-8ff710e2",
                      "prod": "ami-f5f41398"
                    },
                }
            })
        )
    
    let expected = JSON.parse(`{
        "AWSTemplateFormatVersion" : "${Template.DefaultVersion}",
        "Resources": {},
        "Mappings": {
            "RegionAndInstanceTypeToAMIID": {
                "us-east-1": {
                  "test": "ami-8ff710e2",
                  "prod": "ami-f5f41398"
                }
            }
        }
    }`)
    assert.deepStrictEqual(libTemplate, expected)
})

test('Parameters attribute', () => {

    let libTemplate = norm(new Template({})
            .setParameters({
                "MyParam": {
                    AllowedPattern: "myAllowedPattern",
                    AllowedValues: [ "myAllowedValue1", "myAllowedValue2" ],
                    ConstraintDescription: "myConstraintDesc",
                    Default: "myDefault",
                    Description: "myDesc",
                    MaxLength: 123,
                    MaxValue: 234,
                    MinLength: 345,
                    MinValue: 456,
                    NoEcho: true,
                    Type: "myType"
                }
            })
        )
    
    let expected = JSON.parse(`{
        "AWSTemplateFormatVersion" : "${Template.DefaultVersion}",
        "Resources": {},
        "Parameters": {
            "MyParam": {
                "AllowedPattern": "myAllowedPattern",
                "AllowedValues": [ "myAllowedValue1", "myAllowedValue2" ],
                "ConstraintDescription": "myConstraintDesc",
                "Default": "myDefault",
                "Description": "myDesc",
                "MaxLength": 123,
                "MaxValue": 234,
                "MinLength": 345,
                "MinValue": 456,
                "NoEcho": true,
                "Type": "myType"
            }
        }
    }`)
    assert.deepStrictEqual(libTemplate, expected)
})

test('When json is called, valid JSON is returned', () => {
    
    let template = new Template({
        MyBucket: new Cf.AWS.S3.Bucket({
            BucketName: "TestBucket"
        })
    })

    let outputJson = template.json    
    let expectedJson = `{"AWSTemplateFormatVersion":"2010-09-09","Resources":{"MyBucket":{"Type":"AWS::S3::Bucket","Properties":{"BucketName":"TestBucket"}}}}`

    expect(outputJson).toBe(expectedJson)
})

test('When prettyJson is called, formatted JSON is returned', () => {
    
    let template = new Template({
        MyBucket: new Cf.AWS.S3.Bucket({
            BucketName: "TestBucket"
        })
    })

    let outputJson = template.prettyJson    
    let expectedJson = `{
  "AWSTemplateFormatVersion": "2010-09-09",
  "Resources": {
    "MyBucket": {
      "Type": "AWS::S3::Bucket",
      "Properties": {
        "BucketName": "TestBucket"
      }
    }
  }
}`

    expect(outputJson).toBe(expectedJson)
})


function norm(object) {
    return JSON.parse(JSON.stringify(object))
}
