/**
 * 相对地址解析：配置对象（sources / pageEndpoint 等）允许只写相对路径，
 * 统一以 baseUrl 为基准补全。绝对地址（http(s)://、协议相对 //）原样返回；
 * baseUrl 缺省时原样返回（相对地址由宿主环境解析，如浏览器同源）。
 */
export function resolveUrl(url: string, baseUrl?: string): string {
  if (
    baseUrl === undefined ||
    baseUrl === '' ||
    /^(https?:)?\/\//i.test(url)
  ) {
    return url;
  }
  return `${baseUrl.replace(/\/+$/, '')}/${url.replace(/^\/+/, '')}`;
}
