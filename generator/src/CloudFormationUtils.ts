import * as fs from 'fs'
import { TypeName } from './TypeName'
import { CfDefinitions } from './CloudFormationDefinitionTypes';

export class CloudFormationUtils {


    /**
     * @param {string} typeName
     * @returns {TypeName}
     */
    static parseTypeName(typeName): TypeName {
        let resourceName, propertyName
        [ resourceName, propertyName ] = typeName.split('.')
        let namespace = resourceName.split('::')
        let fullname = (propertyName)
                ? `${resourceName}.${propertyName}`
                : resourceName
        
        return {
            resourceName,
            propertyName,
            namespace,
            fullname
        }
    }

    /**
     * @param {TypeName} parentTypeName 
     * @param {string} propertyName 
     */
    static getFullPropertyTypeName(parentTypeName, propertyName) {
        if (propertyName === "Tag") {
            return propertyName // Special case as it is the only global property
        }
        return {
            resourceName: parentTypeName.resourceName,
            propertyName: propertyName,
            namespace: parentTypeName.namespace,
            fullname: (propertyName)
                ? `${parentTypeName.resourceName}.${propertyName}`
                : parentTypeName.resourceName
        }
    }

    /**
     * @param {string} filename 
     * @returns {CfDefinitions}
     */
    static loadSpec(filename: string): CfDefinitions {
        return JSON.parse(fs.readFileSync(filename, 'utf8'));
    }

}