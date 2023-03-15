// 上报服务端地址
export const serverUrl = ''

/**
 * 上报类型
 *
 * @export
 * @enum {number}
 */
export enum ReportType{
  PERFORMANCE = '1',
  RESOURCE = '2',
  ERROR = '3'
}