// 声明使用module.less，不报错
declare module "*.less" {
  const content: Record<string, any>;
  export default content;
}

declare module "@lark-open/blockit-api";

declare module "*.png";

declare module "*.svg";
declare module "*.gif";
