const cfDefinitions = require('./cfDefinitions')
const intrinsicFunctions = require('./intrinsicFunctions')
const Template = require('./Template')

module.exports = {
    ...intrinsicFunctions,
    ...cfDefinitions,
    Template
}