import React, { useEffect, useRef, useState, memo } from "react";
import { Space, Swiper, InfiniteScroll } from "antd-mobile";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import TopButton from "../../components/TopButton";
import SelectBar from "../../components/Select";
import More from "../../components/More";
import QuickButton from "../../components/quickButton";
import SearchHeader from "../../components/SearchHeader";
import ShopItems from "../../components/shopItems";
import Tips from "../../components/Tips";
import styles from "./index.css";

//这里是swiper的数据
const colors = ["#ace0ff", "#bcffbd", "#e4fabd", "#ffcfac"];

//轮播图的每一项
const items = colors.map((color, index) => (
  <Swiper.Item key={index} className="swiper">
    <img
      src={require(`../../assets/${index}.jpg`)}
      alt=""
      className="image-img"
      style={{
        width: "100%",
        height: "100%",
        marginTop: "-2px",
        verticalAlign: "top",
        marginLeft: "-8px",
        borderRadius: 0,
      }}
    />
  </Swiper.Item>
));

const Home = () => {
  const [shopData, setShopdata] = React.useState("");
  const [originData, setOrigindata] = React.useState("");
  const [tinybar, setTinybar] = React.useState("");
  const [fatherValue, setFathervalue] = React.useState("");
  const [selectData, setSelectdata] = React.useState("");
  const [positionData, setPositiondata] = React.useState("");
  const [sortData, setSortdata] = React.useState("");
  const navigate = useNavigate();

  // 请求数据
  useEffect(() => {
    axios.get("/mock/shop").then((res) => {
      setOrigindata(res.data.data.lists);
      setShopdata(res.data.data.lists);
    });
    axios.get("/mock/position").then((res) => {
      setPositiondata(res.data.data);
    });
    axios.get("/mock/sort").then((res) => {
      console.log(res);
      setSortdata(res.data.data.list);
    });
  }, []);

  //用于父组件保存点击的所有筛选条件
  const [returnResult, setReturnresult] = React.useState([]);
  const categories = ["500米以内", "距离最近", "上海大学"];
  const [temp1, setTemp1] = React.useState([]);

  //三个方法分别对应三个筛选条件拿到的数据
  //排序信息
  const getChildSelect = (val) => {
    let index = -1;
    if (
      sortData.map((item) => {
        if (returnResult.indexOf(item.name) != -1) {
          index = returnResult.indexOf(item.name);
          return true;
        }
      })
    ) {
      returnResult.splice(index, 1, val);
    }
    setReturnresult(Array.from(new Set([...returnResult, temp1])));
    mySort(returnResult);
  };
  //位置信息
  const getChildPosition = (val) => {
    console.log("position", positionData[0].children[0].label);
    //这一步保证returnResult里position的data只有一个
    for (let i = 0; i < positionData.length; i++) {
      let index = -1;
      if (
        positionData[i].children.map((item) => {
          if (returnResult.indexOf(item.label) != -1) {
            index = returnResult.indexOf(item.label);
            return true;
          }
        })
      ) {
        setReturnresult(returnResult.splice(index, 1, val));
      }
    }
    setReturnresult(Array.from(new Set([...returnResult, temp1])));
    positionFilter(returnResult);
  };

  //筛选信息
  const getChildChoose = (val) => {
    let index = -1;
    if (
      returnResult.map((item) => {
        if (Array.isArray(item) && item.length != 0) {
          index = returnResult.indexOf(item);
          return true;
        }
      })
    ) {
      returnResult.splice(index, 1, val);
    }
    setReturnresult(Array.from(new Set([...returnResult, temp1])));

    moreFilter(returnResult);
  };
  //位置筛选具体方法
  const positionFilter = (items) => {
    console.log("position被调用了");
    for (let i = 0; i < items.length; i++) {
      if (items[i].length !== 0) {
        //这里用于根据不同的val设置总的shopData
        if (items[i] === "不限") {
          setShopdata(originData);
        } else if (items[i] == "500米以内") {
          let newShopdata = [];
            originData.map((item) => {
            if (
              item.position.find((a) => {
                return a.value == "500米以内";
              })
            ) {
              newShopdata.push(item);
            }
          });
          setShopdata(newShopdata);
          // console.log(newShopdata,'test')
        } else if (items[i] == "1公里以内") {
          let newShopdata = [];
          originData.map((item) => {
            if (
              item.position.find((a) => {
                return a.value == "500米以内" || a.value == "1公里以内";
              })
            ) {
              newShopdata.push(item);
            }
          });
          console.log(newShopdata, "zuixinde1gongli", i, items[i]);
          setShopdata(newShopdata);
        } else if (items[i] == "2公里以内") {
          let newShopdata = [];
          originData.map((item) => {
            if (
              item.position.find((a) => {
                return (
                  a.value == "500米以内" ||
                  a.value == "1公里以内" ||
                  a.value == "2公里以内"
                );
              })
            ) {
              newShopdata.push(item);
            }
          });
          console.log(newShopdata, "zuixinde");
          setShopdata(newShopdata);
        } else if (items[i] == "上海大学") {
          let newShopdata = [];
          originData.map((item) => {
            if (
              item.position.find((a) => {
                return a.value == "上海大学";
              })
            ) {
              newShopdata.push(item);
            }
          });
          setShopdata(newShopdata);
        } else if (
          items[i] == "顾村公园" ||
          items[i] == "龙湖天街" ||
          items[i] == "宝山万达" ||
          items[i] == "经纬汇"
        ) {
          let newShopdata = [];
          originData.map((item) => {
            if (
              item.position.find((a) => {
                return a.value == items[i];
              })
            ) {
              newShopdata.push(item);
            }
          });
          setShopdata(newShopdata);
        }
      }
    }
  };
  //排序具体方法
  const mySort = (item) => {
    console.log("mysort被调用了");
    console.log(shopData);
    if (
      item.indexOf("距离最近") !== -1 ||
      item.indexOf("人气排序") !== -1 ||
      item.indexOf("人均最高") !== -1 ||
      item.indexOf("人均最低") !== -1 ||
      item.indexOf("智能排序") !== -1
    ) {
      for (let i = 0; i < item.length; i++) {
        if (item[i].length != 0) {
          //下面是排序的方法
          if (item[i] == "人气排序") {
            shopData.sort((a, b) => b.sort[0].value - a.sort[0].value);
            originData.sort((a, b) => a.sort[1].value - b.sort[0].value);
          } else if (item[i] == "距离最近") {
            shopData.sort((a, b) => a.sort[1].value - b.sort[1].value);
            originData.sort((a, b) => a.sort[1].value - b.sort[1].value);
            console.log("排好序的temp", shopData);
          } else if (item[i] == "人均最高") {
            shopData.sort((a, b) => b.sort[2].value - a.sort[2].value);
            originData.sort((a, b) => b.sort[2].value - a.sort[2].value);
          } else if (item[i] == "人均最低") {
            shopData.sort((a, b) => a.sort[2].value - b.sort[2].value);
            originData.sort((a, b) => a.sort[2].value - b.sort[2].value);
          } else if (item[i] == "智能排序") {
            //智能排序用的是权重法
            shopData.sort(
              (a, b) =>
                0.5 * b.sort[0].value +
                0.2 * b.sort[1].value +
                0.3 * b.sort[2].value -
                (0.5 * a.sort[0].value +
                  0.2 * a.sort[1].value +
                  0.3 * a.sort[2].value)
            );
            originData.sort(
              (a, b) =>
                0.5 * b.sort[0].value +
                0.2 * b.sort[1].value +
                0.3 * b.sort[2].value -
                (0.5 * a.sort[0].value +
                  0.2 * a.sort[1].value +
                  0.3 * a.sort[2].value)
            );
          }
        }
      }
    }
  };

  //更多筛选方法
  const moreFilter = (items) => {
    for (let i = 0; i < items.length; i++) {
      if (items[i].length != 0 && Array.isArray(items[i])) {
        console.log(items[i],'哪两个条件');
        let newShopdata = [];
        let temp = [];
        for (let j = 0; j < items[i].length; j++) {
          if (j == 0) {
            //① 把origin改成shop了
            shopData.map((item) => {
              // console.log(item)
              if (
                item.select[0].level == items[i][j] ||
                item.select[0].price == items[i][j] ||
                item.select[0].special[0] == items[i][j] || item.select[0].special[1] == items[i][j]
              ) {
                console.log(item, i);
                newShopdata.push(item);
              }
            });
          } else {
            for (let k = 0; k < newShopdata.length; k++) {
              console.log(items[i][j])
              if (
                newShopdata[k].select[0].level == items[i][j] ||
                newShopdata[k].select[0].price == items[i][j] ||
                newShopdata[k].select[0].special[0] == items[i][j] ||
                newShopdata[k].select[0].special[1] == items[i][j]
              ) {
                temp.push(newShopdata[k]);
                console.log(newShopdata[k].select[0].level == items[i][j],newShopdata[k].select[0].price == items[i][j],newShopdata[k].select[0].special[0] == items[i][j],newShopdata[k].select[0].special[1] == items[i][j],newShopdata[k])
                //temp是用来防止重复的
                temp = Array.from(new Set(temp));
                console.log(temp,'test')
              }else{
                newShopdata.splice(k,1)
              }
            }
          }
        }
        if(items[i].length == 1){
          setShopdata(newShopdata)
        }else{
          console.log('走到2')
        }
        
      } 
      else if (Array.isArray(items[i]) && items[i].length == 0) {
        setShopdata(originData);
      }
    }

    // setMoreFlag(1)
  };
  const getTinybar =(items)=>{
    setTinybar(items)
  }
  const getReturnResult = (items) => {
    setReturnresult(items)
  }
  const getFathervalue = (items) =>{
    setFathervalue(items)
  }

  return (
    <div className="home-swiper" style={{ marginTop: 43 }}>
      {/* 轮播图 */}
      <Space direction="vertical" block>
        <Swiper
          indicatorProps={{
            color: "white",
          }}
          style={{
            "--border-radius": "0px",
            "--height": "120px",
            "--width": "375px",
          }}
          defaultIndex={0}
          loop
          autoplay
        >
          {items}
        </Swiper>
      </Space>
      {/* 搜索框导航栏 */}
      <SearchHeader />

      {/* 快捷按钮 */}
      <QuickButton />
      {/* 筛选框 */}

      <SelectBar
        getSelect={getChildSelect}
        getPosition={getChildPosition}
        getChoose={getChildChoose}
        tinybar={tinybar}
        fatherValue={fatherValue}
      />

      {/* 面包屑 */}
      <Tips categories={categories} returnResult={returnResult} getTinybar={getTinybar} getReturnResult={getReturnResult} getFathervalue={getFathervalue}/>

      {/* 美食项目 */}
      <ShopItems shopData={shopData}/>

      {/* 没有更多项目了 */}
      {shopData.length ? null : (
        <div>
          <div className="no-more">没有更多符合条件的美食了</div>
          <div className="no-more-detail">请修改条件重新查询</div>
          <div
            className="no-more-detail"
            style={{
              display: "inline-block",
              position: "relative",
              left: "28%",
            }}
          >
            好吃的餐厅没记录，
          </div>
          <div
            style={{
              display: "inline-block",
              color: "red",
              position: "relative",
              left: "28%",
            }}
            onClick={() => navigate("/addshop")}
          >
            我来添加
          </div>
        </div>
      )}
      <div className="more-title-home">你可能会喜欢</div>
      <div className="more-ad">广告</div>
      <More />
      {/* 回到顶部 */}
      <TopButton/>
    </div>
  );
};

export default Home;
