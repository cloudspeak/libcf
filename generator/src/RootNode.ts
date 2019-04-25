export class RootNode {
    children: {[key: string]: RootNode}

    constructor() {
        this.children = {}
    }
    
    get(key: string) {
        return this.children[key]
    }
    
    set(key: string, value: RootNode) {
        this.children[key] = value
    }

    generateCode(): string[] {
        return Object.keys(this.children).reduce((array: string[], key: string) => {
            return array.concat(this.children[key].generateCode())
        }, [])
    }
}