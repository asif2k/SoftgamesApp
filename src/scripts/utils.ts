export class ObjectsPool {
    public free_objects: any[] = []
    public alocated: number = 0
    public freed: number = 0
    public get(params?: any): any {
        if (this.freed > 0) {
            return this.free_objects[--this.freed]
        }
        else {
            if (this.alocated >= this.poolSize) return undefined
            this.alocated++;
            return this.creator(params)
        }
    }
    public free(obj: any) {

        this.free_objects[this.freed++] = obj;
    }

    constructor(public creator: (params?: any) => void, public poolSize: number = 15) {

    }
}