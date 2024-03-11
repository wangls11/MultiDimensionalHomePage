import instance from "../utils/request";

/**
 * 查看是否发布
 * @param baseUrl 多维表格地址
 * @returns
 */
export function findIsIssue(baseUrl: string) {
  return instance.get(`/api/baseInfo/getAdminUrl?baseUrl=${baseUrl}`);
}

/**
 * 发布
 * @param data  发布信息
 * @returns
 */
export function saveInfo(data: {
  tenantKey: string;
  baseUrl: string;
  data: string;
  openId: string;
}) {
  return instance.post(`/api/baseInfo/saveInfo`, data);
}

/**
 * 获取图片流
 * @param iconType
 * @returns
 */
export function getIcons(iconType: string) {
  return instance.get(`/api/baseInfo/getIcons?iconType=${iconType}`, {
    responseType: "blob",
  });
}

