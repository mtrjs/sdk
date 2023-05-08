/**
 * 计算字符串 hash 值, djb2 算法
 *
 * @export
 * @param {string} s
 * @return {*}
 */
export function getHash(s: string) {
  let hash = 5381;
  for (let i = 0; i < s.length; i++) {
    hash = (hash * 33 + s.charCodeAt(i)) % 0x100000000;
  }
  return hash.toString(16);
}

export function guid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
