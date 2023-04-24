import React, { useEffect, useState} from "react"
import { useThrottleFn, useRequest } from 'ahooks'
import { Tabs, Button } from 'antd-mobile'
import { useLocation } from 'react-router-dom'
import { getShopData } from '../../api/getData'
import ComNavBar from '../../components/ComNavBar/ComNavBar'
import MixSlider from '../../components/MixSwiper/MixSwiper'
import RestaurantInfo from '../../components/RestaurantInfo/RestaurantInfo'
import CommentList from '../../components/CommentList/CommentList'
import MoreBoard from '../../components/MoreBoard/MoreBoard'
import ShopSkeleton from '../../components/Skeleton/ShopSkeleton'
import ErrorPage from '../ErroPage/ErrorPage'
import '../../App.css';
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import "swiper/css/pagination";


function ShopPage() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const shopId = searchParams.get('shopId');
  // console.log(shopId);
  const [shopdata, setShopData] = useState("");
  const [activeKey, setActiveKey] = useState('1')
  

  const tabItems = [
    { key: '1', title: '评价信息'},
    { key: '2', title: '更多推荐'},
  ]
  const tabHeight = 100;
  
  
  const handleScroll = useThrottleFn( () => {
      let currentKey = tabItems[0].key
      for (const item of tabItems) {
        const element = document.getElementById(`anchor-${item.key}`)
        if (!element) continue
        const rect = element.getBoundingClientRect()
        if (rect.top <= tabHeight) {
          currentKey = item.key
        } else {
          break
        }
      }
      setActiveKey(currentKey);
    },
    {
      leading: true,
      trailing: true,
      wait: 100,
    }
  ).run

  // 返回
  const handleGoBack =()=> {
    setTimeout(()=> window.history.back(),200)
  }

  const { data, error, loading ,run} = useRequest(() => getShopData(shopId),
  {
    onSuccess: (res) => {
      setShopData(res.data);
    },
    loading: true, // 默认显示 loading
    onError: (error) => {
      console.log('请求出错：', error)
    },
    debounceWait: 300,
  }
  )

  useEffect(() => {
    run()
    document.addEventListener('scroll', handleScroll)
    return () => {
    document.removeEventListener('scroll', handleScroll)
    }
  
  }, [shopId]);

 
  return (

    <>
   <div className="shop-total-wrapper">
   {/* 骨架屏 */}
   {loading && <ShopSkeleton/>}
   {/* 错误页 */}
   {error &&  <ErrorPage/>}
   {/* 成功获取数据 */}
   {data && 
        <div className="shop-total">
        <ComNavBar onGoBack = {handleGoBack} />
          <>
          <MixSlider videoUrl = {shopdata.videoUrl} 
          images={shopdata.images} 
          />
          <RestaurantInfo shop={shopdata}/>
          <div className="tab-wrapper" >
            <Tabs
              activeKey={activeKey}
              onChange={key => {
                document.getElementById(`anchor-${key}`)?.scrollIntoView()
                window.scrollTo({
                  top: window.scrollY - tabHeight,
                })
              }}
            >
              {tabItems.map(item => (
                <Tabs.Tab title={item.title} key={item.key} />
              ))}
            </Tabs>
          </div>
          <div className= "content-wrapper">
            <div id={`anchor-1`}>
              <CommentList comments={shopdata.comments}/>
            </div>
            <div id={`anchor-2`}>
              <MoreBoard d={`anchor-2`} 
                params={shopdata.more}
                delay={2000}
              /> 
            </div>
          </div>
          </>
        </div>
     
    }
   </div>  
   </>
  );
}

export default ShopPage;
