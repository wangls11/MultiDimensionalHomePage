import { useEffect } from "react";
import loading from "../../assets/loading.gif";
import l from "./Loading.module.less";
import { createBottomTable } from "../../utils";
import { useNavigate } from "react-router-dom";

export const Loading = () => {
  const n = useNavigate();

  useEffect(() => {
    createBottomTable().then(() => {
      n("/basicInfo");
    });
  }, []);

  return (
    <div className={l.loading_box}>
      <div className={l.loading_box_content}>
        <img src={loading} alt="" />
        <span className={l.text1}>正在生成多维首页配置表...</span>
        <span className={l.text2}>大约需要10秒钟哦~</span>
      </div>
    </div>
  );
};

