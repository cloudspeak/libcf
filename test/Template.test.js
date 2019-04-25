//@ts-check

const { Template, Cf } = require('..')
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
            .setConditions({ "cond": "cond1" })
            .setMappings({ "map": "map1" })
            .setMetadata({ "met": "met1" })
            .setOutputs({ "out": "out1" })
            .setParameters({ "par": "par1" })
            .setTransform({ "tran": "tran1" })
        )
    
    let expected = JSON.parse(`{
        "AWSTemplateFormatVersion" : "myver",
        "Description": "mydescription",
        "Resources": {},
        "Conditions": { "cond": "cond1" },
        "Mappings": { "map": "map1" },
        "Metadata": { "met": "met1" },
        "Outputs": { "out": "out1" },
        "Parameters": { "par": "par1" },
        "Transform": { "tran": "tran1" }
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


// test('AWS Example Template', () => {
//     let libTemplate = json(new cf.Template({

//     }))
//     let expected = norm(`{
//         "AWSTemplateFormatVersion" : "2010-09-09",
//         "Description" : "AWS CloudFormation Sample Template",
//         "Resources" : {
//           "S3Bucket" : {
//             "Type" : "AWS::S3::Bucket",
//             "Properties" : {
//               "AccessControl" : "PublicRead",
//               "WebsiteConfiguration" : {
//                 "IndexDocument" : "index.html",
//                 "ErrorDocument" : "error.html"
//                }
//             },
//             "DeletionPolicy" : "Retain"
//           }
//         },
//         "Outputs" : {
//           "WebsiteURL" : {
//             "Value" : { "Fn::GetAtt" : [ "S3Bucket", "WebsiteURL" ] },
//             "Description" : "URL for website hosted on S3"
//           },
//           "S3BucketSecureURL" : {
//             "Value" : { "Fn::Join" : [ "", [ "https://", { "Fn::GetAtt" : [ "S3Bucket", "DomainName" ] } ] ] },
//             "Description" : "Name of S3 bucket to hold website content"
//           }
//         }
//       }`)
//     expect(libTemplate).toBe(expected)
// })

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
