const cfDefinitions = require('./cfDefinitions')
const intrinsicFunctions = require('./intrinsicFunctions')

module.exports = {
    ...intrinsicFunctions,
    ...cfDefinitions
}