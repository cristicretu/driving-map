import { useEffect, useRef } from 'react'

import mapboxgl from 'mapbox-gl'
import type { NextPage } from 'next'

const Map: NextPage = () => {
  const mapContainer = useRef<any>(null)
  const map = useRef<mapboxgl.Map | any>(null)

  useEffect(() => {
    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN ?? ''
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [15.4542, 18.7322],
      zoom: 1.8,
    })
  }, [])

  return (
    <main ref={mapContainer} style={{ height: '400px', width: '100%' }}>
      <div className='map-container' ref={map} />
    </main>
  )
}
export default Map
