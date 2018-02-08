import { HttpMethod } from "../http/HttpConstants";
import { ODataQueryOption, CRLF } from "./ODataConstants";
import { HttpRequestBuilder } from "../http/HttpRequestBuilder";
import { IHttpHeader } from "../http/HttpHeader";
import { ODataQueryStringBuilder } from "./ODataQueryStringBuilder";

export interface IODataOptions {
    endpoint: string;
    headers: IHttpHeader[];
    httpVerb?: HttpMethod;
}

export class ODataBuilder {
    private config: IODataOptions;
    private request: ODataQueryStringBuilder;
    private data: string;

    constructor(config?: IODataOptions) {
        this.config = config;
        this.request = new ODataQueryStringBuilder();
    }

    setVerb(verb: HttpMethod): ODataBuilder {
        this.config.httpVerb = verb;
        return this;
    }

    where: (filter: string) => ODataBuilder = this.filter;
    filter(filter: string): ODataBuilder {
        this.request.addIfNotExists(ODataQueryOption.Filter, filter);
        return this;
    }

    orderby(order: string): ODataBuilder {
        this.request.addIfNotExists(ODataQueryOption.OrderBy, order);
        return this;
    }

    select(attributes: string[]): ODataBuilder {
        this.request.addIfNotExists(ODataQueryOption.Select, attributes.join(","));
        return this;
    }

    count(): ODataBuilder {
        this.request.addIfNotExists(ODataQueryOption.Count, "true");
        return this;
    }

    top(number: number): ODataBuilder {
        this.request.addIfNotExists(ODataQueryOption.Top, number.toString());
        return this;
    }

    get(): ODataBuilder {
        this.config.httpVerb = HttpMethod.Get;
        return this;
    }

    post(data: any): ODataBuilder {
        this.config.httpVerb = HttpMethod.Post;
        return this;
    }

    patch(data: any): ODataBuilder {
        this.config.httpVerb = HttpMethod.Patch;
        return this;
    }

    withBody(data: string): ODataBuilder {
        this.data = data;
        return this;
    }

    delete(): ODataBuilder {
        this.config.httpVerb = HttpMethod.Delete;
        return this;
    }

    buildBodyForBatch(): string {
        const body: string[] = [];
        body.push("Content-Type: application/http");
        body.push("Content-Transfer-Encoding:binary");
        body.push("");
        body.push(`${this.config.httpVerb} ${this.buildQuery()} HTTP/1.1`);
        this.config.headers.forEach((value, index) => {
            body.push(`${index}: ${value}`);
        });
        body.push("");
        body.push(`${this.data ? this.data : ""}`);

        return `${body.join(CRLF)}${CRLF}`;
    }

    build<T>(data?: any): Promise<T> {
        return new HttpRequestBuilder()
            .withUrl(this.buildQuery())
            .withBody(JSON.stringify(data))
            .withHttpMethod(this.config.httpVerb)
            .withHeaders(this.config.headers)
            .build()
            .then((response: XMLHttpRequest) => {
                return response.responseText ? JSON.parse(response.responseText) : null;
            });
    }

    private buildQuery() {
        return this.config.endpoint + this.request.build();
    }
}