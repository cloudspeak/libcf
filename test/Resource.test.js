const { Cf } = require('..')

test('Resource type classes have static TypeName methods', () => {
    expect(Cf.AWS.S3.Bucket.TypeName).toBe("AWS::S3::Bucket")
})

test('Resource type classes have static methods for property types', () => {
    expect(Cf.AWS.S3.Bucket.BucketEncryptionTypeName).toBe("AWS::S3::Bucket.BucketEncryption")
})

test('Resource type classes have static cast methods for property types', () => {
    expect(Cf.AWS.S3.Bucket.BucketEncryption).toBeDefined()
})

test('Resource type classes have static cast methods for partial property types', () => {
    expect(Cf.AWS.S3.Bucket.BucketEncryptionPartial).toBeDefined()
})

//TODO the resource type props too

// orphans
