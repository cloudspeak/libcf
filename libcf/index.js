const cfDefinitions = require('./cfDefinitions')
const intrinsicFunctions = require('./intrinsicFunctions')
const Stack = require('./Stack')

module.exports = {
    ...intrinsicFunctions,
    ...cfDefinitions,
    Stack
}