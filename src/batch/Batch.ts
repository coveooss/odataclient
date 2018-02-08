import { CRLF } from "../odata/ODataConstants";
import { OData, IODataOptions } from "../odata/OData";
import { HttpRequestBuilder } from "../http/HttpRequestBuilder";
import { HttpMethod } from "../http/HttpConstants";
import { IHttpHeader } from "../http/HttpHeader";
import { Guid } from "../utils/Guid";

export class Batch {
    private config: IODataOptions;
    private requests: OData[];
    private batchNumber: Guid;

    constructor(config: IODataOptions) {
        this.requests = [];
        this.config = config;
        this.batchNumber = Guid.newGuid();
        this.ensureRequiredHeaders();
        this.validateEndpoint();
    }

    add(requests: OData[]): Batch {
        requests.forEach((request) => this.requests.push(request));
        return this;
    }

    buildAndRun(): Promise<string[]> {
        return new HttpRequestBuilder()
            .withUrl(this.buildQuery())
            .withBody(this.buildRequestBody())
            .withHttpMethod(HttpMethod.Post)
            .withHeaders(this.config.headers)
            .build()
            .then((response: XMLHttpRequest) => {
                return this.parseResponse(response.responseText);
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
        this.config.headers.push({name: "Content-Type", value: `multipart/mixed;boundary=batch_${this.batchNumber.toString()}`});
    }

    private validateEndpoint() {
        if (!this.config.endpoint.endsWith("/")) {
            this.config.endpoint = this.config.endpoint + "/";
        }
    }

    private buildRequestBody(): string {
        const batchSeparator = this.getBatchSeparator();
        const requestBody = this.requests.map((request) => request.buildBodyForBatch())
                                         .join(`${batchSeparator}${CRLF}`);

        return `${batchSeparator}${CRLF}${requestBody}${batchSeparator}--`;
    }

    private getBatchSeparator() {
        return `--batch_${this.batchNumber.toString()}`;
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
