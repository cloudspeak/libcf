import { CloudFormationUtils } from "./CloudFormationUtils";
import { CfPropertyTypeData, CfPropertyData } from "./CloudFormationDefinitionTypes";
import { PropertyType } from "./PropertyType";

export class OrphanedPropertyType {

    name: string
    data: CfPropertyTypeData | CfPropertyData

    constructor(parsedName, data) {
        this.name = parsedName
        this.data = data
    }

    generateCode(): string[] {
        let parsedName = CloudFormationUtils.getFullPropertyTypeName(null, this.name)
        let propertyType = new PropertyType(parsedName, this.data)
        let code = [
            ...propertyType.generatePropertyTypeInterface(),
            ...propertyType.generateCastFunction()
        ]

        return code
    }
}