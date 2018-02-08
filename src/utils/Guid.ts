export class Guid {
    private innerGuid: string;

    constructor() {
        this.innerGuid = `${this.s4()}${this.s4()}-${this.s4()}-${this.s4()}-${this.s4()}-${this.s4()}${this.s4()}${this.s4()}`;
    }

    static newGuid(): Guid {
        return new Guid();
    }

    static removeBrackets(guid: string) {
        return guid.replace("{", "")
                   .replace("}", "");
    }

    toString() {
        return this.innerGuid;
    }

    toStringNoDash() {
        return this.toString()
            .replace(/-/gi, "");
    }

    private s4(): string {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substr(1);
    }
}