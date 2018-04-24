import { Guid } from '../utils/Guid';
import { IRequest } from '../odata/IRequest';

export interface IRequestBatch {
    getBatchSeparator(): string;
}

export abstract class AbstractRequestBatch implements IRequestBatch {
    protected requests: IRequest[];

    constructor(protected id: Guid, protected batchType: string) {
        this.requests = [];
    }

    getBatchSeparator(): string {
        return `--${this.batchType}_${this.id.toString()}`;
    }

    withRequest(request: IRequest): IRequestBatch {
        this.requests.push(request);
        return this;
    }

    withRequests(requests: IRequest[]): IRequestBatch {
        requests.forEach((request) => this.requests.push(request));
        return this;
    }
}