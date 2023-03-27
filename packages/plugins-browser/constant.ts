/**
 * 上报类型
 *
 * @export
 * @enum {number}
 */
export enum ReportType {
  PERFORMANCE = '1',
  RESOURCE = '2',
  ERROR = '3',
}

export enum ErrorType {
  PROMISE,
  JS,
  RESOURCE,
}

export enum RequestType {
  fetch,
  XHR,
}
