import p from "./ProductSelect.module.less";

import crm_logo from "../assets/icon/crm_logo.svg";
import help_word from "../assets/icon/help_word.svg";
import contact from "../assets/icon/contact.svg";
import after_sale_logo from "../assets/icon/after_sale_logo.svg";
import task_logo from "../assets/icon/task_logo.svg";
import inventory_logo from "../assets/icon/inventory_logo.svg";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { isCreateTable } from "../utils";
import { Spin } from "@douyinfe/semi-ui";

export const ProductSelect = () => {
  const [createTable, setCreateTable] = useState<boolean>(false);
  const [spinning, setSpinning] = useState<boolean>(false);

  const n = useNavigate();

  const skipHome = async () => {
    const flag = await isCreateTable();
    setCreateTable(false);

    if (!flag) {
      setCreateTable(true);
    } else {
      n("/basicInfo");
    }
  };

  const cancel = () => {
    setCreateTable(false);
  };
  const sure = async () => {
    setCreateTable(false);
    n("/Loading");
  };

  const skipOther = () => {
    window.open(
      "https://feichuangtech.feishu.cn/share/base/form/shrcnJQVm5zGVF6VUyhGOAK02me"
    );
  };
  // 联系我们
  const contactOur = () => {
    window.open("https://applink.feishu.cn/T8BMKE4YlvgE");
  };
  // 帮助我们
  const helpOur = () => {
    window.open(
      "https://feichuangtech.feishu.cn/wiki/Nqg1wx1TFijP0IkCjpDcZlIQnVc"
    );
  };

  useEffect(() => {}, []);

  return (
    <>
      {spinning ? <Spin spinning={spinning} /> : ""}
      <div className={p.product_box}>
        <div className={p.help_content}>
          <div
            className={p.help_word}
            onClick={() => {
              helpOur();
            }}
          >
            <img
              src={help_word}
              alt=""
              style={{ marginRight: "8px", width: "16px", height: "16px" }}
            />
            <span>帮助我们</span>
          </div>
          <div
            className={p.contact}
            onClick={() => {
              contactOur();
            }}
          >
            <img
              src={contact}
              alt=""
              style={{ marginRight: "8px", width: "16px", height: "16px" }}
            />
            <span>联系我们</span>
          </div>
        </div>
        <div className={p.product_item}>
          <img src={crm_logo} alt="" />
          <div className={p.product_item_content}>
            <span style={{ fontSize: "20px" }}>CRM</span>
            <span style={{ fontSize: "12px" }}>你的销售助手</span>
            <div
              className={p.use_btn}
              onClick={() => {
                skipHome();
              }}
            >
              使用
            </div>
          </div>
        </div>
        <div className={p.product_item}>
          <img src={after_sale_logo} alt="" />
          <div className={p.product_item_content}>
            <span style={{ fontSize: "20px" }}>任务管理</span>
            <span style={{ fontSize: "12px" }}>你的任务管理助手</span>
            <div
              className={p.use_btn}
              onClick={() => {
                skipOther();
              }}
            >
              敬请期待
            </div>
          </div>
        </div>
        <div className={p.product_item}>
          <img src={task_logo} alt="" />
          <div className={p.product_item_content}>
            <span style={{ fontSize: "20px" }}>库存管理</span>
            <span style={{ fontSize: "12px" }}>你的库存管理助手</span>
            <div
              className={p.use_btn}
              onClick={() => {
                skipOther();
              }}
            >
              敬请期待
            </div>
          </div>
        </div>
        <div className={p.product_item}>
          <img src={inventory_logo} alt="" />
          <div className={p.product_item_content}>
            <span style={{ fontSize: "20px" }}>售后管理</span>
            <span style={{ fontSize: "12px" }}>你的售后助手</span>
            <div
              className={p.use_btn}
              onClick={() => {
                skipOther();
              }}
            >
              敬请期待
            </div>
          </div>
        </div>
      </div>
      {createTable ? <div className={p.maskLayer}></div> : ""}
      {createTable ? (
        <div className={p.modal}>
          <div className={p.content}>
            <span className={p.text1}>提示</span>
            <span className={p.text2}>
              系统会根据您选择的模板自动生成相应的表格。您可以在表格中修改和定制多维首页。
            </span>
          </div>
          <div className={p.button_content}>
            <div
              className={p.button1}
              onClick={() => {
                cancel();
              }}
            >
              取消
            </div>
            <div
              className={p.button2}
              onClick={() => {
                sure();
              }}
            >
              确认
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
    </>
  );
};

