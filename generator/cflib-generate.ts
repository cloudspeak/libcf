const CfLibGenerator = require('./src/CfLibGenerator')

if (process.argv.length < 3) {
    console.error("Usage: node cflib-generate [cf-spec-file] [outputFile]")
    process.exit()
}

let cfSpecFile = process.argv[2]
let outputFile = process.argv[3]

new CfLibGenerator(outputFile).generate(cfSpecFile);
process.exit()