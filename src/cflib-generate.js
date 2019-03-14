const CfLibGenerator = require('./CfLibGenerator')

let filename = 'C:/Users/Rob/Google Drive/Projects/cloudspeak-cflib-generator/CloudFormationResourceSpecification.json'

let outputPath = './output'

new CfLibGenerator(outputPath).generate(filename);


process.exit()