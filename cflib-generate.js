const CfLibGenerator = require('./src/CfLibGenerator')

let filename = './CloudFormationResourceSpecification.json'
let outputPath = './libcf'

new CfLibGenerator(outputPath).generate(filename);
process.exit()