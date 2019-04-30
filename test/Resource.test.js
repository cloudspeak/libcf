const { Cf } = require('..')

test('Resource type classes have static TypeName methods', () => {
    expect(Cf.AWS.S3.Bucket.TypeName).toBe("AWS::S3::Bucket")
})

test('Resource type classes have static methods for property types', () => {
    expect(Cf.AWS.S3.Bucket.BucketEncryptionTypeName).toBe("AWS::S3::Bucket.BucketEncryption")
})

test('Resource type classes have static cast methods for property types which return input value', () => {
    expect(Cf.AWS.S3.Bucket.FilterRule).toBeDefined()
    expect(Cf.AWS.S3.Bucket.FilterRule({
        Name: "MyName",
        Value: "MyValue"
    })).toEqual({
        Name: "MyName",
        Value: "MyValue"
    })
})

test('Resource type classes have static cast methods for partial property types which return input value', () => {
    expect(Cf.AWS.S3.Bucket.FilterRulePartial).toBeDefined()
    expect(Cf.AWS.S3.Bucket.FilterRulePartial({
        Name: "MyName",
        Value: "MyValue"
    })).toEqual({
        Name: "MyName",
        Value: "MyValue"
    })
})

test('Resource type classes have static cast methods for resource properties which return input value', () => {
    expect(Cf.AWS.S3.Bucket.Properties).toBeDefined()
    expect(Cf.AWS.S3.Bucket.Properties({
        BucketName: "MyName"
    })).toEqual({
        BucketName: "MyName"
    })
})

test('Resource type classes have static cast methods for partial resource properties which return input value', () => {
    expect(Cf.AWS.S3.Bucket.PropertiesPartial).toBeDefined()
    expect(Cf.AWS.S3.Bucket.PropertiesPartial({
        BucketName: "MyName"
    })).toEqual({
        BucketName: "MyName"
    })
})

test('Orphaned property types have a cast function which returns input value', () => {
    expect(Cf.Tag).toBeDefined()
    expect(Cf.Tag({
        Key: "MyKey",
        Value: "MyValue"
    })).toEqual({
        Key: "MyKey",
        Value: "MyValue"
    })
})