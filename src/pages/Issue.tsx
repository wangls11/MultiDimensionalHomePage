import i from "./Issue.module.less";

import left from "../assets/icon/left.svg";
import sure from "../assets/icon/sure.svg";
import issue_logo from "../assets/icon/issue_logo.svg";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { saveInfo } from "../api";
import { bitable } from "@lark-base-open/js-sdk";
import { Banner, Button, Spin, Toast } from "@douyinfe/semi-ui";
import copy from "copy-to-clipboard";
import { IconStoryStroked, IconClose } from "@douyinfe/semi-icons";
import { getTableDate } from "../utils";

export const Issue = () => {
  const n = useNavigate();
  const { state } = useLocation();

  // 是否发布
  const [isIssue, setIsIssue] = useState<boolean>(false);
  const [isUpdate, setIsUpdate] = useState<boolean>(false);
  // 多维表格Url
  const [baseUrl, setBaseUrl] = useState<string>("");
  // 保存加载
  const [saveLoading, setSaveLoading] = useState<boolean>(false);
  // 模板地址
  const [moduleUrl, setModuleUrl] = useState<string>("");
  const [visible, setVisible] = useState<boolean>(false);
  const [spinning, setSpinning] = useState<boolean>(false);

  // 发布
  const saveBaseInfo = async () => {
    setSaveLoading(true);

    const {
      crmList,
      tabsList,
      instrumentPanel,
      appNameInfo,
      appIntroduceInfo,
      backgroundImageUrl,
    } = await getTableDate();

    const baseInfo = JSON.stringify({
      crmList: crmList ? crmList : [],
      tabsList: tabsList ? tabsList : [],
      instrumentPanel: instrumentPanel ? instrumentPanel : [],
      appNameInfo: appNameInfo ? appNameInfo : "",
      appIntroduceInfo: appIntroduceInfo ? appIntroduceInfo : "",
      backgroundImageUrl: backgroundImageUrl ? backgroundImageUrl : "",
    });

    const tenantKey = await bitable.bridge.getTenantKey();
    const openId = await bitable.bridge.getUserId();
    saveInfo({
      tenantKey,
      openId,
      baseUrl,
      data: baseInfo,
    })
      .then((res) => {
        const { code, data, msg } = res.data;

        if (code === 200) {
          setModuleUrl(data ? data : "");
          localStorage.setItem("isUpdate", "true");
          setIsIssue(true);
          Toast.success(msg || "成功");
        } else {
          Toast.error(msg || "失败");
        }
      })
      .finally(() => {
        setSaveLoading(false);
      });
  };

  // 复制
  const copyBtn = () => {
    copy(moduleUrl);
    Toast.success("复制成功");
  };

  const changeVisible = () => {
    setVisible(!visible);
  };

  useEffect(() => {
    const isUpdate = localStorage.getItem("isUpdate");

    setIsIssue(state.isIssue ? state.isIssue : false);
    setBaseUrl(state.baseUrl ? state.baseUrl : "");
    setModuleUrl(state.moduleUrl ? state.moduleUrl : "");

    setIsUpdate(isUpdate ? JSON.parse(isUpdate) : false);
  }, []);

  useEffect(() => {
    (async () => {
      if (isIssue && isUpdate && baseUrl) {
        setSpinning(true);
        const {
          crmList,
          tabsList,
          instrumentPanel,
          appNameInfo,
          appIntroduceInfo,
          backgroundImageUrl,
        } = await getTableDate();

        const baseInfo = JSON.stringify({
          crmList: crmList ? crmList : [],
          tabsList: tabsList ? tabsList : [],
          instrumentPanel: instrumentPanel ? instrumentPanel : [],
          appNameInfo: appNameInfo ? appNameInfo : "",
          appIntroduceInfo: appIntroduceInfo ? appIntroduceInfo : "",
          backgroundImageUrl: backgroundImageUrl ? backgroundImageUrl : "",
        });

        const tenantKey = await bitable.bridge.getTenantKey();
        const openId = await bitable.bridge.getUserId();
        saveInfo({
          tenantKey,
          openId,
          baseUrl,
          data: baseInfo,
        })
          .then((res) => {
            const { code, data, msg } = res.data;

            if (code === 200) {
              setModuleUrl(data ? data : "");
              localStorage.setItem("isUpdate", "false");
              setVisible(true);
            } else {
              Toast.error(msg || "更新失败");
            }
          })
          .finally(() => {
            setSpinning(false);
          });
      }
    })();
  }, [isIssue, baseUrl]);

  return (
    <>
      {spinning ? <Spin spinning={spinning} tip="加载中...." /> : ""}
      <div className={i.issue}>
        <div className={i.issue_header}>
          <img
            src={left}
            alt=""
            style={{ cursor: "pointer" }}
            onClick={() => {
              n("/basicInfo");
            }}
          />
        </div>
        {visible ? (
          <Banner
            onClose={changeVisible}
            description="更新发布成功！"
            icon={<IconStoryStroked style={{ color: "#00B42A" }} />}
            closeIcon={<IconClose style={{ color: "#34C724" }} />}
          />
        ) : (
          ""
        )}
        <div className={i.issue_content}>
          <img
            style={{ width: "200px", height: "150px" }}
            src={issue_logo}
            alt=""
          />
          <div className={i.box}>
            {moduleUrl ? (
              <span className={i.text}>{moduleUrl} </span>
            ) : (
              <span className={i.text1}>一键发布，即可生成链接</span>
            )}

            <Button
              className={i.btn_issue}
              loading={saveLoading}
              onClick={() => {
                if (isIssue) {
                  copyBtn();
                } else {
                  saveBaseInfo();
                }
              }}
              style={{ marginRight: 14 }}
            >
              {isIssue ? "一键复制" : "一键发布"}
            </Button>
          </div>
        </div>
        <div className={i.issue_content_desc}>
          <div className={i.desc_list}>
            <div className={i.item}>
              <img src={sure} alt="" />
              <span className={i.text}>集成飞书免登录</span>
            </div>
            <div className={i.item}>
              <img src={sure} alt="" />
              <span className={i.text}>连接业务系统</span>
            </div>
            <div className={i.item}>
              <img src={sure} alt="" />
              <span className={i.text}>一站式整合仪表盘</span>
            </div>
            <div className={i.item}>
              <img src={sure} alt="" />
              <span className={i.text}>轻松洞察业务数据</span>
            </div>
            <div className={i.item}>
              <img src={sure} alt="" />
              <span className={i.text}>满足个性化业务需求</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

