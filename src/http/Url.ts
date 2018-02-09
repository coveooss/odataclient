import { QueryStringBuilder, QueryComponent } from "../odata/QueryStringBuilder";

export class Url {
    private protocol: string;
    private urlBase: string;
    private pathname: string;
    private search: QueryStringBuilder

    constructor(url: string) {
        this.search = new QueryStringBuilder();

        this.parse(url);
    }

    public build(): string {
        return `${this.protocol}//${this.urlBase}${this.pathname}${this.search.build()}`;
    }

    public addPath(path: string) {
        if (this.pathname.endsWith("/")) {
            this.pathname = this.pathname.substring(0, this.pathname.length - 1);
        }
        this.pathname += `/${path}`;
    }

    private parse(url: string) {
        const parser = document.createElement("a");
        parser.href = url;

        this.protocol = parser.protocol;
        this.urlBase = parser.host;
        this.pathname = parser.pathname;
        parser.search.replace("?", "").split("&").forEach(param => {
            const splitParam = param.split("=");
            if (splitParam.length > 1) {
                this.search.addQuery(splitParam[0], splitParam[1]);
                this.search[splitParam[0]] = splitParam[1]
            }
        });
    }
}
