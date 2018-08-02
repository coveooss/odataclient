import { ODataQueryOption } from "./ODataConstants";
export interface IQueryComponent {
    name: string;
    value: string;
    toString(): string;
}

export class QueryComponent implements IQueryComponent {
    constructor(public name: string, public value: string) {}

    toString() {
        return `${this.name}=${this.value}`;
    }
}

export class QueryStringBuilder {
    queryList: {[key: string]: IQueryComponent};

    constructor() {
        this.queryList = {};
    }

    addIfNotExists(name: ODataQueryOption,
                   value: string) {
        if (this.containsQuery(name)) {
            throw new Error("There is already a query option with that name. You can not use them together/twice: " + name);
        } else {
            this.addQuery(name, value);
        }
    }

    addQuery(name: string,
             value: string) {
        this.queryList[name] = new QueryComponent(name, value);
    }

    addOrAppendQuery(name: ODataQueryOption,
        value: string) {
        if (this.containsQuery(name)) {
            const query = this.queryList[name];
            this.addQuery(name, `${query.value},${value}`);
        } else {
            this.addQuery(name, value);
        }
    }

    containsQuery(query: ODataQueryOption) {
        return Object.keys(this.queryList).some(key => this.queryList[key].name === query);
    }

    build(): string {
        const keys = Object.keys(this.queryList);
        return keys.length > 0 ? `?${keys.map(key => this.queryList[key].toString()).join("&")}` : "";
    }
}
