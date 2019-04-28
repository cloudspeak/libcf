const { Cf } = require('..')

test('Resource type classes have static TypeName methods', () => {
    expect(Cf.AWS.S3.Bucket.TypeName).toBe("AWS::S3::Bucket")
})
