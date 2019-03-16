const cf = require('../libcf')


test('Base64 function returns correct object', () => {
    let libTemplate = json(cf.Fn.Base64("AWS CloudFormation"))
    let expected = norm('{ "Fn::Base64" : "AWS CloudFormation" }')
    expect(libTemplate).toBe(expected)
})

test('Cidr function returns correct object', () => {
    let libTemplate = json(cf.Fn.Cidr("192.168.0.0/24", "6", "5"))
    let expected = norm('{ "Fn::Cidr" : [ "192.168.0.0/24", "6", "5"] }')
    expect(libTemplate).toBe(expected)
})

test('FindInMap function returns correct object', () => {
    let libTemplate = json(cf.Fn.FindInMap("RegionMap", { "Ref": "AWS::Region"}, "HVM64"))
    let expected = norm('{"Fn::FindInMap": [ "RegionMap", { "Ref" : "AWS::Region" }, "HVM64"]}')
    expect(libTemplate).toBe(expected)
})

test('GetAtt function returns correct object', () => {
    let libTemplate = json(cf.Fn.GetAtt("myELB", "DNSName"))
    let expected = norm('{ "Fn::GetAtt" : [ "myELB" , "DNSName" ] }')
    expect(libTemplate).toBe(expected)
})

test('GetAZs function returns correct object', () => {
    let libTemplate = json(cf.Fn.GetAZs("us-east-1"))
    let expected = norm('{ "Fn::GetAZs" : "us-east-1" }')
    expect(libTemplate).toBe(expected)
})

test('ImportValue function returns correct object', () => {
    let libTemplate = json(cf.Fn.ImportValue({"Fn::Sub": "${NetworkStackNameParameter}-SubnetID" }))
    let expected = norm('{ "Fn::ImportValue" : {"Fn::Sub": "${NetworkStackNameParameter}-SubnetID" } }')
    expect(libTemplate).toBe(expected)
})

test('Join function returns correct object', () => {
    let libTemplate = json(cf.Fn.Join(":", [ "a", "b", "c" ]))
    let expected = norm('{ "Fn::Join" : [ ":", [ "a", "b", "c" ] ] }')
    expect(libTemplate).toBe(expected)
})

test('Select function returns correct object', () => {
    let libTemplate = json(cf.Fn.Select("1", ["apples", "grapes", "oranges", "mangoes"]))
    let expected = norm('{ "Fn::Select" : [ "1", [ "apples", "grapes", "oranges", "mangoes" ] ] }')
    expect(libTemplate).toBe(expected)
})

test('Split function returns correct object', () => {
    let libTemplate = json(cf.Fn.Split("|", "a|b|c"))
    let expected = norm('{ "Fn::Split" : [ "|" , "a|b|c" ] }')
    expect(libTemplate).toBe(expected)
})

test('Sub function returns correct object', () => {
    let libTemplate = json(cf.Fn.Sub("www.${Domain}", { "Domain": {"Ref" : "RootDomainName" } }))
    let expected = norm('{ "Fn::Sub": [ "www.${Domain}", { "Domain": {"Ref" : "RootDomainName" }} ]}')
    expect(libTemplate).toBe(expected)
})

test('Transform function returns correct object', () => {
    let libTemplate = json(cf.Fn.Transform("AWS::Include", { "Location" : { "Ref" : "InputValue" } }))
    let expected = norm('{ "Fn::Transform" : { "Name" : "AWS::Include", "Parameters" : { "Location" : { "Ref" : "InputValue" } } } }')
    expect(libTemplate).toBe(expected)
})

test('And function returns correct object', () => {
    let libTemplate = json(cf.Fn.And([{"Fn::Equals": ["sg-mysggroup", {"Ref": "ASecurityGroup"}]}, {"Condition": "SomeOtherCondition"}] ))
    let expected = norm('{ "Fn::And": [ {"Fn::Equals": ["sg-mysggroup", {"Ref": "ASecurityGroup"}]}, {"Condition": "SomeOtherCondition"} ] }')
    expect(libTemplate).toBe(expected)
})

test('If function returns correct object', () => {
    let libTemplate = json(cf.Fn.If("CreateNewSecurityGroup", {"Ref" : "NewSecurityGroup"}, {"Ref" : "ExistingSecurityGroup"}))
    let expected = norm('{"Fn::If" : ["CreateNewSecurityGroup",{"Ref" : "NewSecurityGroup"},{"Ref" : "ExistingSecurityGroup"}]}')
    expect(libTemplate).toBe(expected)
})

test('Not function returns correct object', () => {
    let libTemplate = json(cf.Fn.Not({"Fn::Equals" : [{"Ref" : "EnvironmentType"},"prod"]}))
    let expected = norm('{"Fn::Not" : [{"Fn::Equals" : [{"Ref" : "EnvironmentType"},"prod"]}]}')
    expect(libTemplate).toBe(expected)
})

test('Or function returns correct object', () => {
    let libTemplate = json(cf.Fn.Or([{"Fn::Equals" : ["sg-mysggroup", {"Ref" : "ASecurityGroup"}]},{"Condition" : "SomeOtherCondition"}]))
    let expected = norm('{"Fn::Or" : [{"Fn::Equals" : ["sg-mysggroup", {"Ref" : "ASecurityGroup"}]},{"Condition" : "SomeOtherCondition"}]}')
    expect(libTemplate).toBe(expected)
})

test('Ref function returns correct object', () => {
    let libTemplate = json(cf.Ref("MyEC2Instance"))
    let expected = norm('{ "Ref" : "MyEC2Instance" }')
    expect(libTemplate).toBe(expected)
})

test('Intrinsic functions 1', () => {
    let libTemplate = json(
        {
            "AssignIpv6AddressOnCreation": true,
            "CidrBlock": cf.Fn.Select(0, cf.Fn.Cidr(cf.Fn.GetAtt("ExampleVpc", "CidrBlock"), 1, 8)),
            "Ipv6CidrBlock": cf.Fn.Select(0, cf.Fn.Cidr(cf.Fn.Select(0, cf.Fn.GetAtt("ExampleVpc", "Ipv6CidrBlocks")), 1, 64)),
            "VpcId": { "Ref": "ExampleVpc" }
        }
    )
    let expected = norm(`
        {
            "AssignIpv6AddressOnCreation" : true,
            "CidrBlock" : { "Fn::Select" : [ 0, { "Fn::Cidr" : [{ "Fn::GetAtt" : [ "ExampleVpc", "CidrBlock" ]}, 1, 8 ]}]},
            "Ipv6CidrBlock" : { "Fn::Select" : [ 0, { "Fn::Cidr" : [{ "Fn::Select" : [ 0, { "Fn::GetAtt" : [ "ExampleVpc", "Ipv6CidrBlocks" ]}]}, 1, 64 ]}]},
            "VpcId" : { "Ref" : "ExampleVpc" }
        }`)
    expect(libTemplate).toBe(expected)
})

test('Intrinsic functions 2', () => {
    let libTemplate = json(
        cf.Fn.ImportValue(cf.Fn.Sub("${NetworkStackNameParameter}-SubnetID"))
    )
    let expected = norm('{ "Fn::ImportValue" : {"Fn::Sub": "${NetworkStackNameParameter}-SubnetID" } }')
    expect(libTemplate).toBe(expected)
})

test('Intrinsic functions 3', () => {
    let libTemplate = json(
        cf.Fn.Select("2", cf.Fn.Split(",", cf.Fn.ImportValue("AccountSubnetIDs")))
    )
    let expected = norm(`{ "Fn::Select" : [ "2", { "Fn::Split": [",", {"Fn::ImportValue": "AccountSubnetIDs"}]}] }`)
    expect(libTemplate).toBe(expected)
})

test('Conditional functions 1', () => {
    let libTemplate = json(
        cf.Fn.And([
            cf.Fn.Equals("sg-mysggroup", cf.Ref("ASecurityGroup")),
            { Condition: "SomeOtherCondition"}
        ])
    )
    let expected = norm(`{
        "Fn::And": [
           {"Fn::Equals": ["sg-mysggroup", {"Ref": "ASecurityGroup"}]},
           {"Condition": "SomeOtherCondition"}
        ]
     }`)
    expect(libTemplate).toBe(expected)
})

test('Conditional functions 2', () => {
    let libTemplate = json(
        cf.Fn.Not(cf.Fn.Equals(cf.Ref("EnvironmentType"), "prod"))
    )
    let expected = norm(`{
        "Fn::Not" : [{
           "Fn::Equals" : [
              {"Ref" : "EnvironmentType"},
              "prod"
           ]
        }]
     }`)
    expect(libTemplate).toBe(expected)
})


function json(object) {
    return JSON.stringify(object)
}

function norm(json) {
    return JSON.stringify(JSON.parse(json))
}