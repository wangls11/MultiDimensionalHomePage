import {
  FieldType,
  IAttachmentField,
  IOpenUrlSegment,
  ViewType,
  bitable,
} from "@lark-base-open/js-sdk";
import { getIcons } from "../api";

export const initDate = async () => {
  const tableName = "多维首页配置";
  const fatherRecord = "父记录";
  const linkUrl = "链接";
  const titleName = "标题";
  const iconName = "图标";
  const settingSelect = "设置项";

  const crmName = "导航栏";
  const instrumentPanelName = "仪表盘";
  const bottomBarName = "底栏";
  const appName = "应用名称";
  const appIntroduce = "应用介绍";
  const backgroundImage = "背景图片";

  return {
    tableName,
    fatherRecord,
    linkUrl,
    crmName,
    instrumentPanelName,
    bottomBarName,
    titleName,
    appName,
    appIntroduce,
    iconName,
    backgroundImage,
    settingSelect,
  };
};

export const getTableList = async () => {
  const tableList = await bitable.base.getTableMetaList();

  return tableList;
};

// 获取首页数据
export const getTableDate = async () => {
  const {
    fatherRecord,
    linkUrl,
    crmName,
    instrumentPanelName,
    bottomBarName,
    titleName,
    appName,
    appIntroduce,
    iconName,
    backgroundImage,
  } = await initDate();

  const table = await getTable();

  const viewList = await table.getViewList();

  const viewIdList = viewList.map((item) => {
    return item.id;
  });

  const currentView = viewIdList.filter(async (viewId) => {
    const viewMeta = await table.getViewMetaById(viewId);
    if (viewMeta.name === "表格") {
      return true;
    } else {
      return false;
    }
  });

  console.log(currentView, 89899);

  const view = await table.getViewById(currentView[0]);

  // 设置表所有记录
  const recordList = await view.getVisibleRecordIdList();
  // 记录所有字段信息
  const fieldInfo = await table.getFieldMetaList();
  // 父记录FieldId
  const fatherRecordFieldId = fieldInfo
    ? fieldInfo.filter((item) => item.name === fatherRecord)[0].id
    : "";

  // 链接FieldId
  const linkUrlFieldId = fieldInfo
    ? fieldInfo.filter((item) => item.name === linkUrl)[0].id
    : "";
  // 标题FieldId
  const titleFieldId = fieldInfo
    ? fieldInfo.filter((item) => item.name === titleName)[0].id
    : "";
  // 图标FieldId
  const iconFieldId = fieldInfo
    ? fieldInfo.filter((item) => item.name === iconName)[0].id
    : "";

  // 金刚区数据
  let crmList: { title: string; url: string; iconFile: string; id: string }[] =
    [];
  // 仪表盘数据
  const instrumentPanel: { title: string; url: string; id: string }[] = [];
  // 应用名称
  let appNameInfo: string = "";
  // 应用介绍
  let appIntroduceInfo: string = "";
  // tabs数据
  let tabsList: { title: string; url: string; iconFile: string; id: string }[] =
    [];
  // 背景图片
  let backgroundImageUrl: string = "";

  const recordLists = recordList
    ? await Promise.all(
        recordList.map(async (item) => {
          return await table.getRecordById(item ? item : "");
        })
      )
    : [];

  recordLists.forEach((res: any, index: number) => {
    if (res.fields[fatherRecordFieldId]) {
      switch (res.fields[fatherRecordFieldId]?.text) {
        case crmName:
          crmList.push({
            title: res.fields[titleFieldId]
              ? res.fields[titleFieldId][0].text
              : "",
            url: res.fields[linkUrlFieldId]
              ? res.fields[linkUrlFieldId][0].link
              : "",
            iconFile: res.fields[iconFieldId] ? res.fields[iconFieldId] : "",
            id: recordList[index] as string,
          });
          break;
        case bottomBarName:
          tabsList.push({
            title: res.fields[titleFieldId]
              ? res.fields[titleFieldId][0].text
              : "",
            url: res.fields[linkUrlFieldId]
              ? res.fields[linkUrlFieldId][0].link
              : "",
            iconFile: res.fields[iconFieldId] ? res.fields[iconFieldId] : "",
            id: recordList[index] as string,
          });
          break;
        case instrumentPanelName:
          instrumentPanel.push({
            title: res.fields[titleFieldId]
              ? res.fields[titleFieldId][0].text
              : "",
            url: res.fields[linkUrlFieldId]
              ? res.fields[linkUrlFieldId][0].link
              : "",
            id: recordList[index] as string,
          });
          break;
        case appName:
          appNameInfo = res.fields[titleFieldId]
            ? res.fields[titleFieldId][0].text
            : "";
          break;
        case appIntroduce:
          appIntroduceInfo = res.fields[titleFieldId]
            ? res.fields[titleFieldId][0].text
            : "";
          break;
        default:
          break;
      }
    }
    if (
      res.fields[titleFieldId] &&
      res.fields[titleFieldId][0].text === backgroundImage
    ) {
      backgroundImageUrl = res.fields[iconFieldId];
    }
  });

  crmList = crmList
    ? await Promise.all(
        crmList.map(async (item) => {
          return {
            ...item,
            iconFile: await getFileUrl(item.iconFile, table),
          };
        })
      )
    : [];

  tabsList = tabsList
    ? await Promise.all(
        tabsList.map(async (item) => {
          return {
            ...item,
            iconFile: await getFileUrl(item.iconFile, table),
          };
        })
      )
    : [];

  backgroundImageUrl = backgroundImageUrl
    ? await getFileUrl(backgroundImageUrl, table)
    : "";

  return {
    crmList,
    instrumentPanel,
    appNameInfo,
    appIntroduceInfo,
    tabsList,
    backgroundImageUrl,
  };
};

// 获取附件url
const getFileUrl = async (data: any, table: any) => {
  if (!data) return "";
  const token = data ? data[0].token : "";
  const fieldId = data ? data[0].permission.fieldId : "";
  const recordId = data ? data[0].permission.recordId : "";
  const url = await table.getCellAttachmentUrls([token], fieldId, recordId);

  return url[0];
};

// 获取table
export const getTable = async () => {
  const { tableName } = await initDate();

  // 所有子表数据
  const tableList = await getTableList();

  // 设置表table
  const table = await bitable.base.getTableById(
    tableList.filter((item) => item.name === tableName)[0].id
  );

  return table;
};

// 生成底表
export const createBottomTable = async () => {
  const {
    fatherRecord,
    linkUrl,
    crmName,
    instrumentPanelName,
    bottomBarName,
    titleName,
    appName,
    appIntroduce,
    iconName,
    backgroundImage,
    tableName,
    settingSelect,
  } = await initDate();

  // 新建子表
  const { tableId } = await bitable.base.addTable({
    name: tableName,
    fields: [
      {
        type: FieldType.Text,
        name: titleName,
      },
    ],
  });

  const table = await bitable.base.getTableById(tableId);

  const fieldIdList = await table.getFieldMetaList();

  // 标题fieldId
  const titleField = fieldIdList.filter((item) => item.name === titleName)[0]
    ?.id;

  const fatherRecordFieldId = await table.addField({
    type: FieldType.SingleLink,
    name: fatherRecord,
    property: {
      tableId,
    },
  });

  // 链接fieldId
  const linkUrlFieldId = await table.addField({
    type: FieldType.Url,
    name: linkUrl,
  });

  // 设置项
  const settingSelectFieldId = await table.addField({
    type: FieldType.SingleSelect,
    name: settingSelect,
    property: {
      options: [
        { name: "应用名称" },
        { name: "应用介绍" },
        { name: "背景图片" },
        { name: "导航栏" },
        { name: "独立图表" },
        { name: "底栏" },
      ],
    },
  });
  const settingSelectInfo: any =
    await table.getFieldMetaById(settingSelectFieldId);

  // 图标
  const iconNameFieldId = await table.addField({
    type: FieldType.Attachment,
    name: iconName,
  });

  const iconNameField = await table.getField<IAttachmentField>(iconNameFieldId);

  // 应用名称记录
  const appNameRecordId = await table.addRecord({
    fields: {
      [titleField]: appName,
      [fatherRecordFieldId]: {
        tableId: tableId,
        table_id: tableId,
        record_ids: [],
        recordIds: [],
        text: "",
        type: "text",
      },
      [settingSelectFieldId]: {
        id: settingSelectInfo.property?.options.filter(
          (item: { name: string }) => item.name === "应用名称"
        )[0].id,
        text: "",
      },
      [iconNameFieldId]: "",
      [linkUrlFieldId]: "",
    },
  });

  table.addRecord({
    fields: {
      [titleField]: "CRM",
      [fatherRecordFieldId]: {
        tableId: tableId,
        table_id: tableId,
        record_ids: [appNameRecordId],
        recordIds: [appNameRecordId],
        text: appName,
        type: "text",
      },
    },
  });

  // 应用介绍记录
  const appIntroduceRecordId = await table.addRecord({
    fields: {
      [titleField]: appIntroduce,
      [fatherRecordFieldId]: {
        tableId: tableId,
        table_id: tableId,
        record_ids: [],
        recordIds: [],
        text: "",
        type: "text",
      },
      [settingSelectFieldId]: {
        id: settingSelectInfo.property?.options.filter(
          (item: { name: string }) => item.name === "应用介绍"
        )[0].id,
        text: "",
      },
      [iconNameFieldId]: "",
      [linkUrlFieldId]: "",
    },
  });

  table.addRecord({
    fields: {
      [titleField]: "销售管理助手",
      [fatherRecordFieldId]: {
        tableId: tableId,
        table_id: tableId,
        record_ids: [appIntroduceRecordId],
        recordIds: [appIntroduceRecordId],
        text: appIntroduce,
        type: "text",
      },
    },
  });

  // 背景图片
  const backgroundImageId = await table.addRecord({
    fields: {
      [titleField]: backgroundImage,
      [fatherRecordFieldId]: {
        tableId: tableId,
        table_id: tableId,
        record_ids: [],
        recordIds: [],
        text: "",
        type: "text",
      },
      [settingSelectFieldId]: {
        id: settingSelectInfo.property?.options.filter(
          (item: { name: string }) => item.name === "背景图片"
        )[0].id,
        text: "",
      },
      [iconNameFieldId]: "",
      [linkUrlFieldId]: "",
    },
  });

  const appBgFileData = await getIcons("app_bg");
  const appBgFile = new File([appBgFileData.data], "app_bg.png");
  await iconNameField.setValue(backgroundImageId, appBgFile);

  // 导航栏记录
  const crmRecordId = await table.addRecord({
    fields: {
      [titleField]: crmName,
      [fatherRecordFieldId]: {
        tableId: tableId,
        table_id: tableId,
        record_ids: [],
        recordIds: [],
        text: "",
        type: "text",
      },
      [settingSelectFieldId]: {
        id: settingSelectInfo.property?.options.filter(
          (item: { name: string }) => item.name === "导航栏"
        )[0].id,
        text: "",
      },
      [iconNameFieldId]: "",
      [linkUrlFieldId]: "",
    },
  });

  const clueRecordId = await table.addRecord({
    fields: {
      [titleField]: "线索",
      [fatherRecordFieldId]: {
        tableId: tableId,
        table_id: tableId,
        record_ids: [crmRecordId],
        recordIds: [crmRecordId],
        text: appIntroduce,
        type: "text",
      },
      [linkUrlFieldId]: [
        {
          link: "https://feichuangtech.feishu.cn/wiki/JxO2w9dcVikT1ikYm2lcHW1Unzh?table=tblgg8h4tacuV1hU&view=vewcrnmilE",
          text: "线索管理",
          type: "url",
        },
      ] as IOpenUrlSegment[],
    },
  });

  const clueFileData = await getIcons("folder");
  const clueIconFile = new File([clueFileData.data], "folder.png");
  await iconNameField.setValue(clueRecordId, clueIconFile);

  const customerRecordId = await table.addRecord({
    fields: {
      [titleField]: "客户",
      [fatherRecordFieldId]: {
        tableId: tableId,
        table_id: tableId,
        record_ids: [crmRecordId],
        recordIds: [crmRecordId],
        text: appIntroduce,
        type: "text",
      },
      [linkUrlFieldId]: [
        {
          link: "https://feichuangtech.feishu.cn/wiki/JxO2w9dcVikT1ikYm2lcHW1Unzh?table=tblWLunUeoKGgEtj&view=vew1hr3tUF",
          text: "客户管理",
          type: "url",
        },
      ] as IOpenUrlSegment[],
    },
  });

  const customerFileData = await getIcons("profile");
  const customerIconFile = new File([customerFileData.data], "profile.png");
  await iconNameField.setValue(customerRecordId, customerIconFile);

  const oppRecordId = await table.addRecord({
    fields: {
      [titleField]: "商机",
      [fatherRecordFieldId]: {
        tableId: tableId,
        table_id: tableId,
        record_ids: [crmRecordId],
        recordIds: [crmRecordId],
        text: appIntroduce,
        type: "text",
      },
      [linkUrlFieldId]: [
        {
          link: "https://feichuangtech.feishu.cn/wiki/JxO2w9dcVikT1ikYm2lcHW1Unzh?table=tbl2FxCQw5CVKmwW&view=vewzaQeyEx",
          text: "商机管理",
          type: "url",
        },
      ] as IOpenUrlSegment[],
    },
  });

  const oppFileData = await getIcons("suitcase");
  const oppIconFile = new File([oppFileData.data], "suitcase.png");
  await iconNameField.setValue(oppRecordId, oppIconFile);

  const recordRecordId = await table.addRecord({
    fields: {
      [titleField]: "跟进记录",
      [fatherRecordFieldId]: {
        tableId: tableId,
        table_id: tableId,
        record_ids: [crmRecordId],
        recordIds: [crmRecordId],
        text: appIntroduce,
        type: "text",
      },
      [linkUrlFieldId]: [
        {
          link: "https://feichuangtech.feishu.cn/wiki/JxO2w9dcVikT1ikYm2lcHW1Unzh?table=tbl4SlMd7YuaUDcc&view=vewdo2AjPX",
          text: "跟进记录",
          type: "url",
        },
      ] as IOpenUrlSegment[],
    },
  });

  const recordFileData = await getIcons("messages");
  const recordIconFile = new File([recordFileData.data], "messages.png");
  await iconNameField.setValue(recordRecordId, recordIconFile);

  // 仪表盘记录
  const instrumentPanelRecordId = await table.addRecord({
    fields: {
      [titleField]: instrumentPanelName,
      [fatherRecordFieldId]: {
        tableId: tableId,
        table_id: tableId,
        record_ids: [],
        recordIds: [],
        text: "",
        type: "text",
      },
      [settingSelectFieldId]: {
        id: settingSelectInfo.property?.options.filter(
          (item: { name: string }) => item.name === "独立图表"
        )[0].id,
        text: "",
      },
      [iconNameFieldId]: "",
      [linkUrlFieldId]: "",
    },
  });

  table.addRecord({
    fields: {
      [titleField]: "客户驾驶舱",
      [fatherRecordFieldId]: {
        tableId: tableId,
        table_id: tableId,
        record_ids: [instrumentPanelRecordId],
        recordIds: [instrumentPanelRecordId],
        text: instrumentPanelName,
        type: "text",
      },
      [linkUrlFieldId]: [
        {
          link: "https://feichuangtech.feishu.cn/share/base/dashboard/shrcnbgX4EBPpblA3oLKLRfeY8c",
          text: "客户驾驶舱",
          type: "url",
        },
      ] as IOpenUrlSegment[],
    },
  });

  table.addRecord({
    fields: {
      [titleField]: "商机驾驶舱",
      [fatherRecordFieldId]: {
        tableId: tableId,
        table_id: tableId,
        record_ids: [instrumentPanelRecordId],
        recordIds: [instrumentPanelRecordId],
        text: instrumentPanelName,
        type: "text",
      },
      [linkUrlFieldId]: [
        {
          link: "https://feichuangtech.feishu.cn/share/base/dashboard/shrcnZITR78WpJNuHv4f7GFx54c",
          text: "商机驾驶舱",
          type: "url",
        },
      ] as IOpenUrlSegment[],
    },
  });

  table.addRecord({
    fields: {
      [titleField]: "跟进记录驾驶舱",
      [fatherRecordFieldId]: {
        tableId: tableId,
        table_id: tableId,
        record_ids: [instrumentPanelRecordId],
        recordIds: [instrumentPanelRecordId],
        text: instrumentPanelName,
        type: "text",
      },
      [linkUrlFieldId]: [
        {
          link: "https://feichuangtech.feishu.cn/share/base/dashboard/shrcnrUBoOgK8g7depxxz8PTYag",
          text: "跟进记录驾驶舱",
          type: "url",
        },
      ] as IOpenUrlSegment[],
    },
  });

  // 底栏记录
  const bottomBarRecordId = await table.addRecord({
    fields: {
      [titleField]: bottomBarName,
      [fatherRecordFieldId]: {
        tableId: tableId,
        table_id: tableId,
        record_ids: [],
        recordIds: [],
        text: "",
        type: "text",
      },
      [settingSelectFieldId]: {
        id: settingSelectInfo.property?.options.filter(
          (item: { name: string }) => item.name === "底栏"
        )[0].id,
        text: "",
      },
      [iconNameFieldId]: "",
      [linkUrlFieldId]: "",
    },
  });

  const dataRecordId = await table.addRecord({
    fields: {
      [titleField]: "数据管理",
      [fatherRecordFieldId]: {
        tableId: tableId,
        table_id: tableId,
        record_ids: [bottomBarRecordId],
        recordIds: [bottomBarRecordId],
        text: bottomBarName,
        type: "text",
      },
      [linkUrlFieldId]: [
        {
          link: "https://feichuangtech.feishu.cn/share/base/dashboard/shrcnN1yUkwpGt6qtEWbdhhmIVb",
          text: "公司经营分析          ",
          type: "url",
        },
      ] as IOpenUrlSegment[],
    },
  });

  const dataFileData = await getIcons("md_data_usage");
  const dataIconFile = new File([dataFileData.data], "md_data_usage.png");
  await iconNameField.setValue(dataRecordId, dataIconFile);

  const manageRecordId = await table.addRecord({
    fields: {
      [titleField]: "管理后台",
      [fatherRecordFieldId]: {
        tableId: tableId,
        table_id: tableId,
        record_ids: [bottomBarRecordId],
        recordIds: [bottomBarRecordId],
        text: bottomBarName,
        type: "text",
      },
      [linkUrlFieldId]: [
        {
          link: "https://feichuangtech.feishu.cn/wiki/AR0kwaTUVivyCuktk9HcT1UUn4A?table=ldxL1LWaZYrP7nYw",
          text: "使用说明",
          type: "url",
        },
      ] as IOpenUrlSegment[],
    },
  });

  const messagesFileData = await getIcons("icon_app_outlined");
  const messagesIconFile = new File(
    [messagesFileData.data],
    "icon_app_outlined.png"
  );
  await iconNameField.setValue(manageRecordId, messagesIconFile);
};

// 是否创建底表
export const isCreateTable = async () => {
  const { tableName } = await initDate();
  // 所有子表数据
  const tableList = await getTableList();

  return tableList.some((item) => item.name === tableName);
};

