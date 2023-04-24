import React from 'react'
import { Skeleton } from 'antd-mobile'

function ShopSkeleton() {
    return(
        <div className='shop-skeleton'>
            <Skeleton animated 
            style={{
                '--height': '40px',
            }}/>
            <Skeleton animated 
            style={{
                '--width': '90%',
                '--height': '200px',
                '--border-radius':'8px',
                'margin': "20px auto"
            }}/>
            <Skeleton.Title animated />
            <Skeleton.Paragraph lineCount={5} animated />
            <Skeleton.Title animated />
            <Skeleton.Paragraph lineCount={5} animated />

        </div>
    )
}
export default ShopSkeleton