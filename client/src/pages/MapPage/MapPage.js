import React, { useState, useEffect } from 'react';
import { LeftOutline } from 'antd-mobile-icons'
import { useLocation } from 'react-router-dom';
import { getShopData } from '../../api/getData'
import { Button, Toast } from 'antd-mobile'
import { useRequest, useDebounceFn} from 'ahooks';
import MapSkeleton from'../../components/Skeleton/MapSkeleton'
import ErrorPage from '../../pages/ErroPage/ErrorPage'
import MapRestInfo from '../../components/MapRestInfo/MapRestInfo'
var BMapGL = window.BMapGL

function MapPage() {
  const location = useLocation();
  const [ shopData, setShopData ] = useState("");
  const search = location.search;
  const params = new URLSearchParams(search);
  const shopId = params.get('shopId');

  const { data, error, loading, run } = useRequest(() => getShopData(shopId), {
    onSuccess: (res) => {
      setShopData(res.data);
      
    },
    onError: (err) => {
      console.error('请求出错：', err);
    },
    debounceWait: 300,
  });
  
  useEffect(() => {
    run();
  }, [shopId]);

    //地图初始化
  const showShopOnMap = () =>{
      console.log("data", data);
      const { lng, lat } = shopData.coordinates;

      var map = new BMapGL.Map("bdmap");
      var point = new BMapGL.Point(lng, lat);
      map.centerAndZoom(point, 14);   
      map.enableScrollWheelZoom(); 
      var scaleCtrl = new BMapGL.ScaleControl(); 
      map.addControl(scaleCtrl);
   
      const marker = new BMapGL.Marker(point);
      map.addOverlay(marker);
   
      var opts = {
        width: 100,     
        title:` <div style="max-width:200px; overflow: hidden; white-space:nowrap; text-overflow:ellipsis; font-size:16px; font-weight:600" > ${shopData.title} </div>`,
        content: `<div style="width:200px height: 150px">
                   <img src=${shopData.images[0]} style="max-width:100%;max-height:100%;">
                  </div>`
      }
      const infoWindow = new BMapGL.InfoWindow(opts.content, opts);
      map.openInfoWindow(infoWindow, point);

  }
  
  const  handleGoBack =()=> {
    setTimeout(()=> window.history.back(),200)
  }

  const handleNav =()=> {
    if(shopData.coordinates){
      console.log("开始导航");
      Toast.show({
        icon: 'loading',
        content: '加载导航中…',
        duration: 1000,
      })
      document.getElementById('plan-time').innerText = "计算中";
    }
    var map = new BMapGL.Map("bdmap");
    map.enableScrollWheelZoom();
    var scaleCtrl = new BMapGL.ScaleControl();  
    map.addControl(scaleCtrl);
    const { lng, lat } = shopData.coordinates;
    var p1 = new BMapGL.Point(121.395866,31.325999); // 起点
    var p2 = new BMapGL.Point(lng, lat); // 终点
    var driving = new BMapGL.DrivingRoute(map, 
      { 
        renderOptions: {
          map: map,
          panel: "taxi-result",
          autoViewport: true,
        }
    });
    driving.search(p1, p2);
    console.log( driving);
    driving.setSearchCompleteCallback((results) => {
      if (driving.getStatus() === 0) {
        const plan = results.getPlan(0);
        const duration = plan.getDuration(); // 获取总时间
        if (duration) {
        const timeElement = document.getElementById('plan-time');
        timeElement.innerText = duration;
        timeElement.classList.add('time-fade-in');
        }
      } else {
        console.log("驾车路线规划失败：", driving.getStatus());
      }
    });

  }
  
  //防抖
  const debouncedHandleNav = useDebounceFn(handleNav, { wait: 500 }).run;

  return(
    <>
     <div className='map-wrapper'>
      <div className="bdmap" id="bdmap" 
        style={{ 
          width: "100vw", 
          height: "80vh",
        }}>   
      </div>
      <div className='map-left'  >
        <LeftOutline  onClick={handleGoBack} />
      </div>
     </div>
     {loading && <MapSkeleton/>}
     {data && 
     <div className='map-restaurant-info'>
        {showShopOnMap()}
        <MapRestInfo 
          shopData={shopData} 
          handleNav={debouncedHandleNav}
        />
      </div>}
      {error && <div className='map-error'><ErrorPage/></div>}
    </>
  )
 
}

export default  MapPage