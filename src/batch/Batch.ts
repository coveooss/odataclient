import { CRLF } from "../odata/ODataConstants";
import { OData, IODataOptions } from "../odata/OData";
import { HttpRequestBuilder } from "../http/HttpRequestBuilder";
import { HttpMethod } from "../http/HttpConstants";
import { IHttpHeader } from "../http/HttpHeader";
import { Guid } from "../utils/Guid";
import { AbstractRequestBatch } from './IBatch';

export class Batch extends AbstractRequestBatch {
    private config: IODataOptions;

    constructor(config: IODataOptions) {
        super(Guid.newGuid(), "batch");
        this.config = config;
        this.ensureRequiredHeaders();
        this.validateEndpoint();
    }

    buildAndRun(parseResponse: boolean = true): Promise<string[]> {
        return new HttpRequestBuilder()
            .withUrl(this.buildQuery())
            .withBody(this.buildRequestBody())
            .withHttpMethod(HttpMethod.Post)
            .withHeaders(this.config.headers)
            .build()
            .then((response: XMLHttpRequest) => {
                return parseResponse
                    ? this.parseResponse(response.responseText)
                    : [response.responseText];
            });
    }

    private buildQuery() {
        return `${this.config.endpoint}$batch`;
    }

    private ensureRequiredHeaders() {
        if (!this.config.headers) {
            this.config.headers = [];
        }
        this.config.headers.push({name: "OData-Version", value: "4.0"});
        this.config.headers.push({name: "OData-MaxVersion", value: "4.0"});
        this.config.headers.push({name: "Accept", value: "application/json"});
        this.config.headers.push({name: "Content-Type", value: `multipart/mixed;boundary=batch_${this.id.toString()}`});
    }

    private validateEndpoint() {
        if (!this.config.endpoint.endsWith("/")) {
            this.config.endpoint = this.config.endpoint + "/";
        }
    }

    private buildRequestBody(): string {
        const query = [];
        this.requests.forEach(request => {
            query.push(this.getBatchSeparator());
            query.push(request.buildBodyForBatch());
        });
        return query.join(CRLF)
            + CRLF
            + `${this.getBatchSeparator()}--`;
    }

    private parseResponse(responseText: string): string[] {
        const boundary = "--batchresponse_";
        const responses: string[] = [];
        responseText
            .split(boundary)
            .forEach((fragment) => {
                const startJson = fragment.indexOf("{");
                const endJson = fragment.lastIndexOf("}");
                if (startJson >= 0 && endJson >= 0) {
                    responses.push(fragment.substring(startJson, endJson + 1));
                }
            });
        return responses;
    }
}
