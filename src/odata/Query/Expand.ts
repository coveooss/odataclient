import { SystemQuery } from "../SystemQuery";
import { QueryStringBuilder } from "../QueryStringBuilder";

export class ExpandQuery extends SystemQuery {
    constructor(public attribute: string) {
        super(new QueryStringBuilder())
    }

    buildQuery() {
        const subFilter = super.buildQuery().replace(/^(\?)/g, "");

        return !!subFilter
            ? `${this.attribute}(${subFilter})`
            : this.attribute;
    }
}