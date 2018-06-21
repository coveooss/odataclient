import { IHttpHeader } from "./HttpHeader";

export interface IHttpRequestBuilder {
    withBody(body: string): IHttpRequestBuilder;
    withHeader(header: IHttpHeader): IHttpRequestBuilder;
    withHeaders(headers: IHttpHeader[]): IHttpRequestBuilder;
    withHttpMethod(method: string): IHttpRequestBuilder;
    withUrl(url: string): IHttpRequestBuilder;
    build(): Promise<XMLHttpRequest>;
}

export class HttpRequestBuilder implements IHttpRequestBuilder {
    private body: string;
    private headers: IHttpHeader[] = [];
    private method: string;
    private url: string;

    withBody(body: string): IHttpRequestBuilder {
        this.body = body;
        return this;
    }

    withHeader(header: IHttpHeader): IHttpRequestBuilder {
        this.headers.push(header);
        return this;
    }

    withHeaders(headers: IHttpHeader[]): IHttpRequestBuilder {
        this.headers = headers;
        return this;
    }

    withHttpMethod(method: string): IHttpRequestBuilder {
        this.method = method;
        return this;
    }

    withUrl(url: string): IHttpRequestBuilder {
        this.url = url;
        return this;
    }

    build(): Promise<XMLHttpRequest> {
        return new Promise<XMLHttpRequest>((resolve, reject) => {
            const xmlHttp = new XMLHttpRequest();
            xmlHttp.open(this.method,
                        this.url,
                        true);
            this.headers.forEach(header => xmlHttp.setRequestHeader(header.name, header.value));

            xmlHttp.onreadystatechange = () => {
                if (xmlHttp.readyState === XMLHttpRequest.DONE) {
                    if (xmlHttp.status >= 200 && xmlHttp.status < 300) {
                        resolve(xmlHttp);
                    } else {
                        let errorText: string = xmlHttp.responseText;
                        let error = null;
                        try {
                            error = xmlHttp.responseText ? JSON.parse(xmlHttp.responseText) : null;
                        } catch (error) {
                            console.log("Unable to parse response.")
                        } finally {
                            if (error && error.message) {
                                errorText = error.message;
                            }
                            reject(new Error(errorText || "HTTP request error."));
                        }
                    }
                }
            }

            xmlHttp.send(this.body);
        });
    }
}