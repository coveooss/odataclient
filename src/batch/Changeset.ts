import { Guid } from '../utils/Guid';
import { OData } from '../odata/OData';
import { IRequest } from '../odata/IRequest';
import { AbstractRequestBatch } from './IBatch';
import { CRLF } from '../odata/ODataConstants';

export class Changeset extends AbstractRequestBatch implements IRequest {
    constructor() {
        super(Guid.newGuid(), "changeset");
    }

    appendToBatch(query: string[], index: number) {
        query.push(this.buildBodyForBatch());
    }

    buildBodyForBatch(): string {
        const query = [
            `Content-Type: multipart/mixed; boundary=changeset_${this.id.toString()}`,
            ""
        ];

        this.requests.forEach((request: IRequest, index: number) => {
            query.push(this.getBatchSeparator());
            request.appendToBatch(query, index)
        });

        return query.join(CRLF)
            + CRLF
            + `${this.getBatchSeparator()}--`;
    }
}
