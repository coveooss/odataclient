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
    queryList: IQueryComponent[];

    constructor() {
        this.queryList = [];
    }

    addIfNotExists(name: ODataQueryOption,
                   value: string) {
        if (this.containsQuery(name)) {
            throw new Error("There is already a query option with that name. You can not use them together/twice: " + name);
        } else {
            this.queryList.push(new QueryComponent(name, value));
        }
    }

    addQuery(name: ODataQueryOption,
             value: string) {
        this.queryList.push(new QueryComponent(name, value));
    }

    containsQuery(query: ODataQueryOption) {
        return this.queryList.some((q) => q.name === query);
    }

    build(): string {
        return this.queryList.length > 0 ? `?${this.queryList.map((query) => query.toString()).join("&")}` : "";
    }
}
