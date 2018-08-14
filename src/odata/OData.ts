import { HttpMethod } from "../http/HttpConstants";
import { ODataQueryOption, CRLF } from "./ODataConstants";
import { HttpRequestBuilder } from "../http/HttpRequestBuilder";
import { IHttpHeader } from "../http/HttpHeader";
import { QueryStringBuilder } from "./QueryStringBuilder";
import { Url } from "../http/Url";
import { IRequest } from './IRequest';
import { SystemQuery } from "./SystemQuery";

export interface IODataOptions {
    endpoint: string;
    headers: IHttpHeader[];
    httpVerb?: HttpMethod;
}

export class OData extends SystemQuery implements IRequest {
    private config: IODataOptions;
    private url: Url;
    private data: string;

    constructor(config?: IODataOptions) {
        super(new QueryStringBuilder())
        this.config = config;

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

    get(): OData {
        this.config.httpVerb = HttpMethod.Get;
        return this;
    }

    post(data: any): OData {
        this.config.httpVerb = HttpMethod.Post;
        this.withBody(data);
        return this;
    }

    patch(data: any): OData {
        this.config.httpVerb = HttpMethod.Patch;
        this.withBody(data);
        return this;
    }

    withHeader(header: IHttpHeader): OData {
        this.config.headers.push(header);
        return this;
    }

    withBody(data: any): OData {
        this.data = JSON.stringify(data);
        return this;
    }

    delete(): OData {
        this.config.httpVerb = HttpMethod.Delete;
        return this;
    }

    appendToBatch(query: string[], contentId: number) {
        query.push("Content-Type: application/http");
        query.push("Content-Transfer-Encoding:binary");
        if (typeof(contentId) === "number") {
            query.push(`Content-ID: ${contentId}`);
        }
        query.push("");
        query.push(this.buildBodyForBatch())
    }

    buildBodyForBatch(): string {
        const body: string[] = [];
        body.push(`${this.config.httpVerb} ${this.buildQuery()} HTTP/1.1`);
        this.config.headers.forEach((value, index) => {
            body.push(`${value.name}: ${value.value}`);
        });
        body.push("");
        body.push(`${this.data ? this.data : ""}`);

        return body.join(CRLF);
    }

    build<T>(): Promise<T> {
        return new HttpRequestBuilder()
            .withUrl(this.buildQuery())
            .withBody(this.data)
            .withHttpMethod(this.config.httpVerb)
            .withHeaders(this.config.headers)
            .build()
            .then((response: XMLHttpRequest) => {
                return response.responseText ? JSON.parse(response.responseText) : null;
            });
    }

    buildQuery() {
        return this.url.build() + super.buildQuery();
    }
}