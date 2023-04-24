import React from "react";
import { useState,useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import './index.css'


function ShopItems(props){

    const {shopData} = props
  
    const navigate = useNavigate();
  
    //是否有折扣
    const renderDiscounts = (shop) => {
      return (
        <div className="right-content-event">
          <span className="right-content-cheap-icon">惠</span>
          <span className="right-content-cheap-description">
            {shop.discounts}
          </span>
        </div>
      );
    };
  
    //用于传递数据
    const handleClick = (e, shop) => {
      e.preventDefault();
      navigate("/shoppage?shopId=" + `${shop.id}`);
    };
  return (<div className="items">
        { shopData == ""
          ? null
          : shopData.map((item) => (
              <div
                className="item"
                key={item.id}
                onClick={(e) => handleClick(e, item)}
              >
                <div className="img-box">
                  <img
                    className="image-img"
                    alt=""
                    src={`${item.images[0]}`}
                  ></img>
                </div>
                <div className="right-content">
                  <div className="right-content-name">{item.title}</div>
                  <span className="right-content-score">{item.score}</span>
                  <span className="right-content-score-danwei">分</span>
                  <span className="right-content-comments">{item.discussNum}条点评</span>
                  <span className="right-content-average">
                    ￥{item.averPrice}/人
                  </span>
                  <div className="right-content-details">
                    <span className="right-content-description">
                      {item.type} {item.area}
                    </span>
                    <span className="right-content-distance">
                      {item.distance}
                    </span>
                  </div>
                  <div className="right-content-events">
                    {item.discounts ? renderDiscounts(item) : null}
                  </div>
                </div>
              </div>
            ))}
      </div>
)

    
}

export default ShopItems