import { OData } from "../../src/Index";

describe("OData", () => {
    const anEndpoint = "http://coveo.ca";
    const aResource = "aaa";
    const anotherResource = "bbb";

    describe("resource", () => {
        it("should append resources to the resulting query", () => {
            const odata = new OData({
                endpoint: anEndpoint,
                headers: []
            });

            expect(odata.buildQuery()).toBe(`${anEndpoint}/`);
            odata.resource(aResource);
            expect(odata.buildQuery()).toBe(`${anEndpoint}/${aResource}`);
            odata.resource(anotherResource);
            expect(odata.buildQuery()).toBe(`${anEndpoint}/${aResource}/${anotherResource}`);
        });
    });
});
