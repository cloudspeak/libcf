const { Cf } = require('..')

test('Resource type classes have static typeName methods', () => {
    expect(Cf.AWS.S3.Bucket.TypeName).toBe("AWS::S3::Bucket")
})