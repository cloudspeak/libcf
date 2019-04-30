//@ts-check

const { Template, Cf, Fn, Cast } = require('..')
const assert = require('assert');

test('When setResource is called for a nonexistent key then it is added', () => {

    let libTemplate = new Template({
        MyResource1: new Cf.AWS.S3.Bucket({ BucketName: "MyBucket1" })
    })

    let result = libTemplate.setResource("MyResource2", new Cf.AWS.S3.Bucket({ BucketName: "MyBucket2" }))

    expect(libTemplate.Resources["MyResource1"]).toBeDefined()
    expect(libTemplate.Resources["MyResource1"]["Properties"]["BucketName"]).toBe("MyBucket1")
    expect(libTemplate.Resources["MyResource2"]).toBeDefined()
    expect(libTemplate.Resources["MyResource2"]["Properties"]["BucketName"]).toBe("MyBucket2")

    expect(result).toBe(libTemplate)
})

test('When setResource is called for a existing key then it is overwritten', () => {

    let libTemplate = new Template({
        MyResource1: new Cf.AWS.S3.Bucket({ BucketName: "MyBucket1" }),
        MyResource2: new Cf.AWS.S3.Bucket({ BucketName: "MyBucket2a" })
    })

    let result = libTemplate.setResource("MyResource2", new Cf.AWS.S3.Bucket({ BucketName: "MyBucket2b" }))

    expect(libTemplate.Resources["MyResource1"]).toBeDefined()
    expect(libTemplate.Resources["MyResource1"]["Properties"]["BucketName"]).toBe("MyBucket1")
    expect(libTemplate.Resources["MyResource2"]).toBeDefined()
    expect(libTemplate.Resources["MyResource2"]["Properties"]["BucketName"]).toBe("MyBucket2b")

    expect(result).toBe(libTemplate)
})

test('When addResource is called for a nonexistent key then it is added', () => {

    let libTemplate = new Template({
        MyResource1: new Cf.AWS.S3.Bucket({ BucketName: "MyBucket1" })
    })

    let result = libTemplate.addResource("MyResource2", new Cf.AWS.S3.Bucket({ BucketName: "MyBucket2" }))

    expect(libTemplate.Resources["MyResource1"]).toBeDefined()
    expect(libTemplate.Resources["MyResource1"]["Properties"]["BucketName"]).toBe("MyBucket1")
    expect(libTemplate.Resources["MyResource2"]).toBeDefined()
    expect(libTemplate.Resources["MyResource2"]["Properties"]["BucketName"]).toBe("MyBucket2")

    expect(result).toBe(libTemplate)
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

    let result = libTemplate.addResources({
        MyResource2: new Cf.AWS.S3.Bucket({ BucketName: "MyBucket2" }),
        MyResource3: new Cf.AWS.S3.Bucket({ BucketName: "MyBucket3" })
    })

    expect(libTemplate.Resources["MyResource1"]).toBeDefined()
    expect(libTemplate.Resources["MyResource1"]["Properties"]["BucketName"]).toBe("MyBucket1")
    expect(libTemplate.Resources["MyResource2"]).toBeDefined()
    expect(libTemplate.Resources["MyResource2"]["Properties"]["BucketName"]).toBe("MyBucket2")
    expect(libTemplate.Resources["MyResource3"]).toBeDefined()
    expect(libTemplate.Resources["MyResource3"]["Properties"]["BucketName"]).toBe("MyBucket3")

    expect(result).toBe(libTemplate)
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

test('When addParameters is called for multiple nonexistent keys then multiple parameters are added', () => {

    let libTemplate = new Template({})
        .setParameters({
            MyParam1: {
                Type: "MyType1",
                Description: "MyParam1"
            }
        })

    let result = libTemplate.addParameters({
        MyParam2: {
            Type: "MyType2",
            Description: "MyParam2"
        },
        MyParam3: {
            Type: "MyType3",
            Description: "MyParam3"
        }
    })

    expect(libTemplate.Parameters["MyParam1"]).toBeDefined()
    expect(libTemplate.Parameters["MyParam1"].Description).toBe("MyParam1")
    expect(libTemplate.Parameters["MyParam2"]).toBeDefined()
    expect(libTemplate.Parameters["MyParam2"].Description).toBe("MyParam2")
    expect(libTemplate.Parameters["MyParam3"]).toBeDefined()
    expect(libTemplate.Parameters["MyParam3"].Description).toBe("MyParam3")

    expect(result).toBe(libTemplate)
})

test('When addParameters is called for multiple nonexistent keys and one existing key then error is thrown and none are added', () => {

    let libTemplate = new Template({})
        .setParameters({
            MyParam1: {
                Type: "MyType1a",
                Description: "MyParam1a"
            }
        })

    expect(() => {
        libTemplate.addParameters({
            MyParam1: {
                Type: "MyType1b",
                Description: "MyParam1b"
            },
            MyParam2: {
                Type: "MyType2",
                Description: "MyParam2"
            }
        })
    }).toThrowError("A parameter with the logical ID 'MyParam1' already exists")

    expect(libTemplate.Parameters["MyParam1"]).toBeDefined()
    expect(libTemplate.Parameters["MyParam1"].Description).toBe("MyParam1a")
    expect(libTemplate.Parameters["MyParam2"]).not.toBeDefined()
})

test('When addMappings is called for multiple nonexistent keys then multiple parameters are added', () => {

    let libTemplate = new Template({})
        .setMappings({
            MyMapping1: "MyValue1"
        })

    let result = libTemplate.addMappings({
        MyMapping2: "MyValue2",
        MyMapping3: "MyValue3"
    })

    expect(libTemplate.Mappings["MyMapping1"]).toBeDefined()
    expect(libTemplate.Mappings["MyMapping1"]).toBe("MyValue1")
    expect(libTemplate.Mappings["MyMapping2"]).toBeDefined()
    expect(libTemplate.Mappings["MyMapping2"]).toBe("MyValue2")
    expect(libTemplate.Mappings["MyMapping3"]).toBeDefined()
    expect(libTemplate.Mappings["MyMapping3"]).toBe("MyValue3")

    expect(result).toBe(libTemplate)
})

test('When addMappings is called for multiple nonexistent keys and one existing key then error is thrown and none are added', () => {

    let libTemplate = new Template({})
        .setMappings({
            MyMapping1: "MyValue1a"
        })

    expect(() => {
        libTemplate.addMappings({
            MyMapping1: "MyValue1b",
            MyMapping2: "MyValue2"
        })
    }).toThrowError("A mapping with the logical ID 'MyMapping1' already exists")

    expect(libTemplate.Mappings["MyMapping1"]).toBeDefined()
    expect(libTemplate.Mappings["MyMapping1"]).toBe("MyValue1a")
    expect(libTemplate.Mappings["MyMapping2"]).not.toBeDefined()
})

test('When addConditions is called for multiple nonexistent keys then multiple parameters are added', () => {

    let libTemplate = new Template({})
        .setConditions({
            MyCond1: Fn.Equals(1, 1)
        })

    let result = libTemplate.addConditions({
        MyCond2: Fn.Equals(2, 2),
        MyCond3: Fn.Equals(3, 3)
    })

    expect(libTemplate.Conditions["MyCond1"]).toBeDefined()
    expect(libTemplate.Conditions["MyCond1"]).toEqual(Fn.Equals(1, 1))
    expect(libTemplate.Conditions["MyCond2"]).toBeDefined()
    expect(libTemplate.Conditions["MyCond2"]).toEqual(Fn.Equals(2, 2))
    expect(libTemplate.Conditions["MyCond3"]).toBeDefined()
    expect(libTemplate.Conditions["MyCond3"]).toEqual(Fn.Equals(3, 3))

    expect(result).toBe(libTemplate)
})

test('When addConditions is called for multiple nonexistent keys and one existing key then error is thrown and none are added', () => {

    let libTemplate = new Template({})
        .setConditions({
            MyCond1: Fn.Equals("1a", "1a")
        })

    expect(() => {
        libTemplate.addConditions({
            MyCond1: Fn.Equals("1b", "1b"),
            MyCond2: Fn.Equals("2", "2")
        })
    }).toThrowError("A condition with the logical ID 'MyCond1' already exists")

    expect(libTemplate.Conditions["MyCond1"]).toBeDefined()
    expect(libTemplate.Conditions["MyCond1"]).toEqual(Fn.Equals("1a", "1a"))
    expect(libTemplate.Conditions["MyCond2"]).not.toBeDefined()
})

test('When addTransforms is called for multiple transforms then they are added', () => {

    let libTemplate = new Template({})
        .setTransform([
            "trans1"
        ])

    let result = libTemplate.addTransforms([
        "trans2", "trans3"
    ])

    expect(libTemplate.Transform.length).toBe(3)
    expect(libTemplate.Transform).toContain("trans1")
    expect(libTemplate.Transform).toContain("trans2")
    expect(libTemplate.Transform).toContain("trans3")

    expect(result).toBe(libTemplate)
})

test('When addTransforms is called for multiple transforms and one duplicate then error is thrown and none are added', () => {

    let libTemplate = new Template({})
        .setTransform([
            "trans1"
        ])

    expect(() => {
        libTemplate.addTransforms([
            "trans1", "trans2"
        ])
    }).toThrowError("The transform 'trans1' already exists on the template")

    expect(libTemplate.Transform.length).toBe(1)
    expect(libTemplate.Transform).toContain("trans1")
})

test('When addOutputs is called for multiple nonexistent keys then multiple outputs are added', () => {

    let libTemplate = new Template({})
        .setOutputs({
            MyOutput1: {
                Value: "MyVal1"
            }
        })

    let result = libTemplate.addOutputs({
        MyOutput2: {
            Value: "MyVal2"
        },
        MyOutput3: {
            Value: "MyVal3"
        }
    })

    expect(libTemplate.Outputs["MyOutput1"]).toBeDefined()
    expect(libTemplate.Outputs["MyOutput1"].Value).toEqual("MyVal1")
    expect(libTemplate.Outputs["MyOutput2"]).toBeDefined()
    expect(libTemplate.Outputs["MyOutput2"].Value).toEqual("MyVal2")
    expect(libTemplate.Outputs["MyOutput3"]).toBeDefined()
    expect(libTemplate.Outputs["MyOutput3"].Value).toEqual("MyVal3")

    expect(result).toBe(libTemplate)
})

test('When addOutputs is called for multiple nonexistent keys and one existing key then error is thrown and none are added', () => {

    let libTemplate = new Template({})
        .setOutputs({
            MyOutput1: {
                Value: "MyVal1a"
            }
        })

    expect(() => {
        libTemplate.addOutputs({
            MyOutput1: {
                Value: "MyVal1b"
            },
            MyOutput2: {
                Value: "MyVal2"
            }
        })
    }).toThrowError("An output with the logical ID 'MyOutput1' already exists")

    expect(libTemplate.Outputs["MyOutput1"]).toBeDefined()
    expect(libTemplate.Outputs["MyOutput1"].Value).toEqual("MyVal1a")
    expect(libTemplate.Outputs["MyOutput2"]).not.toBeDefined()
})

function norm(object) {
    return JSON.parse(JSON.stringify(object))
}


/*
addOutputs
*/