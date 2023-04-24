import React from "react";
import { useState } from "react";
import './index.css'


function   QuickButton(){

    //用于设置按钮样式
const [flag1, setFlag1] = React.useState(0);


//给menu-button绑定点击事件
const changeActive = () => {
    if (flag1 == 0) {
      setFlag1(1);
    } else {
      setFlag1(0);
    }
  };

  //给menu-box传类名
  const status = (flag) => {
    if (flag == 1) {
      return "menu-box active";
    } else {
      return "menu-box";
    }
  };

    return (
      <div className={status(flag1)}>
      <div className="menu-button" onClick={changeActive}>
        <div className="line-box">
          <div className="line"></div>
          <div className="line"></div>
          <div className="line"></div>
          <div className="line"></div>
        </div>
      </div>
      <ul className="menu-list">
        <li>
          <i className="fa fa-sliders"></i>
          <span>设置</span>
        </li>
        <li>
          <i className="fa fa-clone"></i>
          <span>个人中心</span>
        </li>
        <li>
          <i className="fa fa-share-square-o"></i>
          <span>分享</span>
        </li>
        <li>
          <i className="fa fa-trash-o"></i>
          <span>更多</span>
        </li>
      </ul>
    </div>
    )
}

export default QuickButton