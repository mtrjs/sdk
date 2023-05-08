export enum ExceptionType {
  PROMISE,
  JS,
}

export enum RequestType {
  fetch,
  XHR,
}

export enum Eid {
  'js-exception' = '1003',
  'request-exception' = '1004',
  'console-exception' = '1005',
  'resource-exception' = '1006',
  performance = '1000',
  'runtime-performance' = '1007',
}
