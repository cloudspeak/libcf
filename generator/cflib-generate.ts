const CfLibGenerator = require('./src/CfLibGenerator')

let filename = '../CloudFormationResourceSpecification.json'
let outputPath = './libcf-test123'

new CfLibGenerator(outputPath).generate(filename);
process.exit()