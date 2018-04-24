import { Guid } from '../utils/Guid';
import { OData } from '../odata/OData';
import { IRequest } from '../odata/IRequest';
import { AbstractRequestBatch } from './IBatch';
import { CRLF } from '../odata/ODataConstants';

export class Changeset extends AbstractRequestBatch implements IRequest {
    constructor() {
        super(Guid.newGuid(), "changeset");
    }

    buildBodyForBatch(): string {
        const query = [
            `Content-Type: multipart/mixed; boundary=changeset_${this.id.toString()}`,
            ""
        ];

        this.requests.forEach((request: IRequest, index: number) => {
            query.push(this.getBatchSeparator());
            query.push("Content-Type: application/http");
            query.push("Content-Transfer-Encoding:binary");
            query.push(`Content-ID: ${index}`);
            query.push("");
            query.push(request.buildBodyForBatch())
        });

        return query.join(CRLF)
            + CRLF
            + `${this.getBatchSeparator()}--`;
    }
}
