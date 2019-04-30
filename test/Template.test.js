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

test('Metadata attribute', () => {

    let libTemplate = norm(new Template({})
            .setMetadata({
                "SomeData": "SomeValue"
            })
        )
    
    let expected = JSON.parse(`{
        "AWSTemplateFormatVersion" : "${Template.DefaultVersion}",
        "Resources": {},
        "Metadata": {
            "SomeData": "SomeValue"
        }
    }`)
    assert.deepStrictEqual(libTemplate, expected)
})

test('Description attribute', () => {

    let libTemplate = norm(new Template({})
            .setDescription("myDescription")
        )
    
    let expected = JSON.parse(`{
        "AWSTemplateFormatVersion" : "${Template.DefaultVersion}",
        "Resources": {},
        "Description": "myDescription"
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
