module.exports = class ObjectUtils {
    static mapObject(object, callback) {
        return Object.keys(object).reduce(
            (newObject, key) => {
                newObject[key] = callback(key, object[key])
                return newObject;
            }, {})
    }
    
    static objectToArray(object) {
        return Object.keys(object).reduce(
            (array, key) => {
                return array.concat([ object[key] ])
            }, [])
    }
}