import { useEffect, useRef, useState } from "react";
import a from "./App.module.less";
import { getTableDate, getTable, createBottomTable } from "../utils";
import { SideSheet, Skeleton } from "@douyinfe/semi-ui";
import home_logo from "../assets/icon/home_logo.svg";
import app_pg from "../assets/icon/app_bg.svg";
import hint from "../assets/icon/hint.svg";
import pc_app_pg from "../assets/icon/pc_app_bg.svg";
import aside from "../assets/icon/aside.svg";
import panel from "../assets/icon/panel.svg";
import home from "../assets/icon/home_blue.png";
import background_management_gray from "../assets/icon/background_management_gray.svg";
import { useNavigate } from "react-router-dom";
import { findIsIssue } from "../api";
import { bitable } from "@lark-base-open/js-sdk";
import left from "../assets/icon/left.svg";

export const App = () => {
  const [crmListDate, setCrmListDate] = useState<
    { title: string; url: string; iconFile: any; id: string }[]
  >([]);
  const [instrumentPanel, setInstrumentPanel] = useState<
    { title: string; url: string; id: string }[]
  >([]);
  const [appName, setAppName] = useState<string>("");
  const [appIntroduce, setAppIntroduce] = useState<string>("");
  const [visible, setVisible] = useState<boolean>(false);
  const change = () => {
    setVisible(!visible);
  };
  const [selectInstrumentPanel, setSelectInstrumentPanel] = useState<{
    title: string;
    url: string;
    id: string;
  }>();
  const [tabsListInfo, setTabsListInfo] = useState<
    { title: string; url: string; iconFile: string; id: string }[]
  >([]);
  const [backgroundImage, setBackgroundImage] = useState<string>("");
  const [skeletonFlag, setSkeletonFlag] = useState<boolean>(false);
  const n = useNavigate();
  // 是否发布
  const [isIssue, setIsIssue] = useState<boolean>(false);
  // 多维表格Url
  const [baseUrl, setBaseUrl] = useState<string>("");
  const [isUpdate, setIsUpdate] = useState<boolean>(false);
  // 模板地址
  const [moduleUrl, setModuleUrl] = useState<string>("");
  const panelRef = useRef<HTMLDivElement>(null);
  // 圆角消失bol
  const [radiusBol, setRadiusBol] = useState<boolean>(false);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, true);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const isUpdate = localStorage.getItem("isUpdate");
    setIsUpdate(isUpdate ? JSON.parse(isUpdate) : false);
    (async () => {
      getTableInfo();
      const table = await getTable();
      const off = table.onRecordModify((event) => {
        getTableInfo();
        localStorage.setItem("isUpdate", "true");
        setIsUpdate(true);
      });

      const off1 = table.onRecordAdd(() => {
        getTableInfo();
        localStorage.setItem("isUpdate", "true");
        setIsUpdate(true);
      });
      const off2 = table.onRecordDelete(() => {
        getTableInfo();
        localStorage.setItem("isUpdate", "true");
        setIsUpdate(true);
      });

      return () => {
        off();
        off1();
        off2();
      };
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const { tableId, viewId } = await bitable.base.getSelection();

      if (tableId && viewId) {
        let url = await bitable.bridge.getBitableUrl({
          tableId,
          viewId,
          recordId: null,
          fieldId: null,
        });

        if (url) {
          url = url.split("?")[0];
          setBaseUrl(url);
          findIsIssue(url).then((res) => {
            const { data, code } = res.data;

            if (code === 200) {
              setIsIssue(true);
              setModuleUrl(data ? data.adminUrl : "");
            } else {
              setIsIssue(false);
            }
          });
        }
      }
    })();
  }, []);

  const handleScroll = () => {
    if (panelRef.current?.getBoundingClientRect()) {
      if (panelRef.current?.getBoundingClientRect().top < 87) {
        setRadiusBol(true);
      } else {
        setRadiusBol(false);
      }
    }
  };

  const getTableInfo = async () => {
    setSkeletonFlag(true);
    const {
      crmList,
      tabsList,
      instrumentPanel,
      appNameInfo,
      appIntroduceInfo,
      backgroundImageUrl,
    } = await getTableDate();
    setCrmListDate(crmList ? crmList : []);
    setInstrumentPanel(instrumentPanel ? instrumentPanel : []);
    setAppName(appNameInfo ? appNameInfo : "");
    setAppIntroduce(appIntroduceInfo ? appIntroduceInfo : "");
    setSelectInstrumentPanel(instrumentPanel[0]);
    setTabsListInfo(tabsList ? tabsList : []);
    setBackgroundImage(backgroundImageUrl ? backgroundImageUrl : "");
    setSkeletonFlag(false);

    // localStorage.setItem(
    //   "baseInfo",
    //   JSON.stringify({
    //     crmList: crmList ? crmList : [],
    //     tabsList: tabsList ? tabsList : [],
    //     instrumentPanel: instrumentPanel ? instrumentPanel : [],
    //     appNameInfo: appNameInfo ? appNameInfo : "",
    //     appIntroduceInfo: appIntroduceInfo ? appIntroduceInfo : "",
    //     backgroundImageUrl: backgroundImageUrl ? backgroundImageUrl : "",
    //   })
    // );
  };

  // 跳转地址
  const skipUrl = (url: string) => {
    if (!url) return;
    window.open(url);
  };

  // 切换仪表盘
  const selectPanel = (item: { url: string; title: string; id: string }) => {
    setSelectInstrumentPanel(item);
    setVisible(false);
  };

  // 跳转
  const skipIssue = () => {
    n("/issue", { state: { isIssue, baseUrl, moduleUrl } });
  };

  // 骨架屏
  const placeholder = (
    <div className={a.skeleton}>
      <Skeleton.Title style={{ width: 150, marginBottom: 3 }} />
      <Skeleton.Title style={{ width: 200, marginBottom: 50 }} />

      <div className={a.KongKimArea}>
        <Skeleton.Title style={{ width: 60, height: 60 }} />
        <Skeleton.Title style={{ width: 60, height: 60 }} />
        <Skeleton.Title style={{ width: 60, height: 60 }} />
        <Skeleton.Title style={{ width: 60, height: 60 }} />
      </div>
      <Skeleton.Title style={{ width: "100%", marginBottom: 20 }} />

      <Skeleton.Paragraph rows={7} />
      <div className={a.footer}>
        <Skeleton.Title style={{ width: 60, height: 60 }} />
        <Skeleton.Title style={{ width: 60, height: 60 }} />
        <Skeleton.Title style={{ width: 60, height: 60 }} />
      </div>
    </div>
  );

  return (
    <Skeleton placeholder={placeholder} loading={skeletonFlag} active>
      <div className={a.main}>
        <div className={a.left}>
          <img
            src={left}
            alt=""
            style={{ cursor: "pointer" }}
            onClick={() => {
              n("/productSelect");
            }}
          />
        </div>
        <div className={a.issue}>
          <div className={a.issue_text}>
            <div
              className={a.free}
              onClick={() => {
                createBottomTable();
              }}
            >
              限时免费
            </div>
            <span>发布即可尊享专属服务~</span>
          </div>
          <div
            className={a.issueBtn}
            onClick={() => {
              skipIssue();
            }}
          >
            {isIssue ? "发布更新" : "一键发布"}
            {isUpdate ? <img className={a.hint} src={hint} alt="" /> : ""}
          </div>
        </div>
        <div className={a.content}>
          <SideSheet
            title="仪表盘列表"
            width="237px"
            visible={visible}
            onCancel={change}
            placement="left"
            style={{ backgroundColor: "#f5f6f7" }}
          >
            <div className={a.panel}>
              {instrumentPanel.length ? (
                instrumentPanel.map((item, index) => {
                  return (
                    <div
                      className={
                        selectInstrumentPanel?.id === item.id
                          ? a.panelItemSelect
                          : a.panelItem
                      }
                      key={index}
                      onClick={() => {
                        selectPanel(item);
                      }}
                    >
                      <img src={panel} style={{ marginRight: "8px" }} />
                      <span>{item.title ? item.title : "未命名"}</span>
                    </div>
                  );
                })
              ) : (
                <div className={a.empty}>暂无数据</div>
              )}
            </div>
          </SideSheet>
          <div className={a.homePage}>
            <img
              className={a.image}
              src={backgroundImage ? backgroundImage : app_pg}
            />
            <div className={a.header}>
              <div className={a.gradual_bg}></div>
              <div className={a.header_text}>
                <span className={a.header_text_one}>{appName}</span>
                <span className={a.header_text_two}>{appIntroduce}</span>
              </div>
            </div>
            <div ref={panelRef} className={a.panel_content}>
              <div className={a.KongKimArea}>
                {crmListDate.length ? (
                  crmListDate?.map((item, index) => {
                    return (
                      <div
                        key={index}
                        className={a.item}
                        onClick={() => {
                          skipUrl(item.url);
                        }}
                      >
                        <img
                          className={a.imageIcon}
                          src={item.iconFile ? item.iconFile : home_logo}
                          alt=""
                        />
                        <span className={a.text}>
                          {item.title ? item.title : "未命名"}
                        </span>
                      </div>
                    );
                  })
                ) : (
                  <div className={a.empty}>暂无数据</div>
                )}
              </div>
              <div
                className={a.instrumentPanel}
                onClick={(event) => {
                  event.stopPropagation();
                  event.preventDefault();
                  setVisible(true);
                }}
              >
                <div className={a.aside}>
                  <img src={aside} />
                </div>
                <div className={a.content}>
                  <img src={panel} />
                  <span style={{ marginLeft: "8px", fontSize: "16px" }}>
                    {selectInstrumentPanel?.title}
                  </span>
                </div>
              </div>
              {selectInstrumentPanel?.url ? (
                <iframe
                  className={a.iframe}
                  src={selectInstrumentPanel?.url}
                ></iframe>
              ) : (
                <div className={a.empty}>暂无数据</div>
              )}
            </div>
          </div>
        </div>
        <div className={a.footer}>
          <div className={a.footer__item}>
            <img className={a.imageIcon} src={home} alt="" />
            <span style={{ color: "#3370FF" }}>首页</span>
          </div>

          {tabsListInfo.map((item, index) => {
            return (
              <div
                key={index}
                className={a.footer__item}
                onClick={() => {
                  skipUrl(item.url);
                }}
              >
                <img
                  className={a.imageIcon}
                  src={
                    item.iconFile ? item.iconFile : background_management_gray
                  }
                  alt=""
                />
                <span>{item.title}</span>
              </div>
            );
          })}
        </div>
      </div>
    </Skeleton>
  );
};

