export interface IRequest {
    appendToBatch(query: string[], contentId: number);
}