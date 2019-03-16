const cf = require('../libcf')


test('Base64 function returns correct object', () => {
    let libTemplate = json(cf.Fn.Base64("AWS CloudFormation"))
    let expected = norm('{ "Fn::Base64" : "AWS CloudFormation" }')
    expect(libTemplate).toBe(expected)
})

test('Cidr function returns correct object', () => {
    let libTemplate = json(cf.Fn.Cidr("192.168.0.0/24", 6, 5))
    let expected = norm('{ "Fn::Cidr" : [ "192.168.0.0/24", "6", "5"] }')
    expect(libTemplate).toBe(expected)
})

test('FindInMap function returns correct object', () => {
    let libTemplate = json(cf.Fn.FindInMap("RegionMap", { "Ref": "AWS::Region"}, "HVM64"))
    let expected = norm('{"Fn::FindInMap": [ "RegionMap", { "Ref" : "AWS::Region" }, "HVM64"]}')
    expect(libTemplate).toBe(expected)
})

test('Base64 function returns correct object', () => {
    let libTemplate = json(cf.Fn.Base64("AWS CloudFormation"))
    let expected = norm('{ "Fn::Base64" : "AWS CloudFormation" }')
    expect(libTemplate).toBe(expected)
})

test('GetAtt function returns correct object', () => {
    let libTemplate = json(cf.Fn.GetAtt("myELB", "DNSName"))
    let expected = norm('{ "Fn::GetAtt" : [ "myELB" , "DNSName" ] }')
    expect(libTemplate).toBe(expected)
})

function json(object) {
    return JSON.stringify(object)
}

function norm(json) {
    return JSON.stringify(JSON.parse(json))
}