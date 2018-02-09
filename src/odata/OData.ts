import { HttpMethod } from "../http/HttpConstants";
import { ODataQueryOption, CRLF } from "./ODataConstants";
import { HttpRequestBuilder } from "../http/HttpRequestBuilder";
import { IHttpHeader } from "../http/HttpHeader";
import { QueryStringBuilder } from "./QueryStringBuilder";
import { Url } from "../http/Url";

export interface IODataOptions {
    endpoint: string;
    headers: IHttpHeader[];
    httpVerb?: HttpMethod;
}

export class OData {
    private config: IODataOptions;
    private url: Url;
    private request: QueryStringBuilder;
    private data: string;

    constructor(config?: IODataOptions) {
        this.config = config;
        this.request = new QueryStringBuilder();

        this.url = new Url(config.endpoint);
    }

    resource(resource: string): OData {
        this.url.addPath(resource);
        return this;
    }

    setVerb(verb: HttpMethod): OData {
        this.config.httpVerb = verb;
        return this;
    }

    where: (filter: string) => OData = this.filter;
    filter(filter: string): OData {
        this.request.addIfNotExists(ODataQueryOption.Filter, filter);
        return this;
    }

    orderby(order: string): OData {
        this.request.addIfNotExists(ODataQueryOption.OrderBy, order);
        return this;
    }

    select(attributes: string[]): OData {
        this.request.addIfNotExists(ODataQueryOption.Select, attributes.join(","));
        return this;
    }

    count(): OData {
        this.request.addIfNotExists(ODataQueryOption.Count, "true");
        return this;
    }

    top(number: number): OData {
        this.request.addIfNotExists(ODataQueryOption.Top, number.toString());
        return this;
    }

    get(): OData {
        this.config.httpVerb = HttpMethod.Get;
        return this;
    }

    post(data: any): OData {
        this.config.httpVerb = HttpMethod.Post;
        return this;
    }

    patch(data: any): OData {
        this.config.httpVerb = HttpMethod.Patch;
        return this;
    }

    withBody(data: string): OData {
        this.data = data;
        return this;
    }

    delete(): OData {
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

    buildQuery() {
        return this.url.build() + this.request.build();
    }
}