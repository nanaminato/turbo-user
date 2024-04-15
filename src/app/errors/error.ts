export interface ResponseError{
  type: ErrorType,
  error?: string,
  status?: number
}
export enum ErrorType{
  NotAuthorize,
  NoContent,
  Busy,
  Other
}
