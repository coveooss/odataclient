import { ODataQueryStringBuilder } from "../../src/odata/ODataQueryStringBuilder";
import { ODataQueryOption } from "../../src/odata/ODataConstants";

describe("ODataQueryStringBuilder", () => {
    const aQuery = ODataQueryOption.Filter;
    const anotherQuery = ODataQueryOption.Select;
    const aQueryValue = "hello world";

    let builder: ODataQueryStringBuilder;

    beforeEach(() => {
        builder = new ODataQueryStringBuilder();
    });

    afterEach(() => {
        builder = null;
    });

    describe("containsQuery", () => {
        it("should return true if it contains the query", () => {
            expect(builder.containsQuery(aQuery)).toBe(false);

            builder.addQuery(aQuery, aQueryValue);

            expect(builder.containsQuery(aQuery)).toBe(true);
        });
    });

    describe("addIfNotExists", () => {
        it("should throw if query has already been added", () => {
            builder.addIfNotExists(aQuery, aQueryValue);

            expect(() => builder.addIfNotExists(aQuery, aQueryValue)).toThrow();
        });
    });

    describe("build", () => {
        it("should join queries together with '&' and prepend a '?'", () => {
            builder.addQuery(aQuery, aQueryValue);
            builder.addQuery(anotherQuery, aQueryValue);

            const resultingQuery = builder.build();

            expect(resultingQuery).toBe(`?${aQuery}=${aQueryValue}&${anotherQuery}=${aQueryValue}`);
        });

        it("should return an empty string when empty", () => {
            const resultingQuery = builder.build();

            expect(resultingQuery).toBe("");
        });
    });
});
