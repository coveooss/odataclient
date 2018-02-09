import { Url } from "../../src/http/Url";

describe("Url", () => {
    describe("constructor", () => {
        it("should not throw given valid URL", () => {
            [
                "",
                "http://coveo.crm.dynamics.com"
            ].forEach(url => {
                expect(() => new Url(url)).not.toThrow();
            });
        });
    });

    describe("build", () => {
        it("should build URLs correctly", () => {
            [
                { inputString: "http://coveo.crm.dynamics.com", expectedUrl: "http://coveo.crm.dynamics.com/" },
                { inputString: "https://coveo.crm.dynamics.com", expectedUrl: "https://coveo.crm.dynamics.com/" },
                { inputString: "http://coveo.crm.dynamics.com/a", expectedUrl: "http://coveo.crm.dynamics.com/a" },
                { inputString: "http://coveo.crm.dynamics.com/a/bsd", expectedUrl: "http://coveo.crm.dynamics.com/a/bsd" },
                { inputString: "http://coveo.crm.dynamics.com?", expectedUrl: "http://coveo.crm.dynamics.com/" },
                { inputString: "http://coveo.crm.dynamics.com?a", expectedUrl: "http://coveo.crm.dynamics.com/" },
                { inputString: "http://coveo.crm.dynamics.com?a=2", expectedUrl: "http://coveo.crm.dynamics.com/?a=2" },
                { inputString: "http://coveo.crm.dynamics.com?a=2&b=patate", expectedUrl: "http://coveo.crm.dynamics.com/?a=2&b=patate" },
            ].forEach(test => {
                const url = new Url(test.inputString);
                expect(url.build()).toBe(test.expectedUrl);
            });
        });

        it("should build relative URLs correctly", () => {
            [
                { inputString: "a", expectedUrl: "/a" },
                { inputString: "a/b", expectedUrl: "/a/b" },
                { inputString: "/a/b", expectedUrl: "/a/b" },
                { inputString: "/a/b?", expectedUrl: "/a/b" },
                { inputString: "/a/b?a=2", expectedUrl: "/a/b?a=2" },
            ].forEach(test => {
                const url = new Url(test.inputString);
                expect(url.build().endsWith(test.expectedUrl)).toBeTruthy();
            });
        });
    });

    describe("addPath", () => {
        const anUrl = "http://coveo.com"

        it("should add path added to url", () => {
            [
                { path: "a", expectedUrl: `${anUrl}/a` },
                { path: "a/b", expectedUrl: `${anUrl}/a/b` },
            ].forEach(test => {
                const url = new Url(anUrl);
                url.addPath(test.path)
                expect(url.build()).toBe(test.expectedUrl);
            });
        });
    });
});
