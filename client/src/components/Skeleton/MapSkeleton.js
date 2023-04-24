import React from 'react'
import { Skeleton } from 'antd-mobile'

function MapSkeleton() {
    return(
        <div className='map-skeleton'>
            <Skeleton animated 
            style={{
                '--width': '95vw',
                '--height': '80vh',
                '--border-radius':'8px',
                'margin': "auto"
            }}/>
            <Skeleton.Title animated />
            <Skeleton.Paragraph lineCount={2} animated />
        </div>
    )
}
export default MapSkeleton