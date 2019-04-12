import { NamespaceNode } from "./NamespaceNode";
import { ObjectUtils } from "./ObjectUtils";

export class RootNode {
    children: {[key: string]: NamespaceNode}

    constructor() {
        this.children = {}
    }
    
    get(key: string) {
        return this.children[key]
    }
    
    set(key: string, value: NamespaceNode) {
        this.children[key] = value
    }

    generateCode(): string[] {
        return Object.keys(this.children).reduce((array: string[], key: string) => {
            return array.concat(this.children[key].generateCode())
        }, [])
    }
}