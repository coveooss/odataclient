import { QueryStringBuilder } from "./QueryStringBuilder";
import { ODataQueryOption } from "./ODataConstants";
import { ExpandQuery } from "./Query/Expand";
export abstract class SystemQuery {
    constructor(private request: QueryStringBuilder) {}

    where: (filter: string) => this = this.filter;
    filter(filter: string): this {
        this.request.addIfNotExists(ODataQueryOption.Filter, filter);
        return this;
    }

    expand(expression: ExpandQuery): this {
        this.request.addOrAppendQuery(ODataQueryOption.Expand, expression.buildQuery());
        return this;
    }

    orderby(order: string): this {
        this.request.addIfNotExists(ODataQueryOption.OrderBy, order);
        return this;
    }

    select(attributes: string[]): this {
        this.request.addIfNotExists(ODataQueryOption.Select, attributes.join(","));
        return this;
    }

    count(): this {
        this.request.addIfNotExists(ODataQueryOption.Count, "true");
        return this;
    }

    custom(key: string, value: string): this {
        this.request.addQuery(key, value);
        return this;
    }

    top(number: number): this {
        this.request.addIfNotExists(ODataQueryOption.Top, number.toString());
        return this;
    }

    buildQuery(): string {
        return this.request.build();
    }
}
