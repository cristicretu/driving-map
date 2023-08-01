import { useEffect, useRef, useState } from 'react'

import mapboxgl from 'mapbox-gl'
import type { NextPage } from 'next'

const Map: NextPage = () => {
  const mapContainer = useRef<any>(null)
  const map = useRef<mapboxgl.Map | any>(null)
  const [directions, setDirections] = useState<any>(null)

  useEffect(() => {
    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN ?? ''
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [24.9668, 45.9432], // center map on Romania
      zoom: 5,
      pitch: 0, // make the map flat
    })

    const directions = new MapboxDirections({
      accessToken: mapboxgl.accessToken,
      profile: 'mapbox/driving', // Use the driving profile for road directions
      controls: {
        inputs: false, // We don't need the default inputs
        instructions: false, // We don't need the default instructions
      },
      styles: [
        {
          id: 'directions-route-line-alt',
          type: 'line',
          source: 'directions',
          layout: {
            'line-join': 'round',
            'line-cap': 'round',
          },
          paint: {
            'line-color': 'orange', // Change the color to orange
            'line-width': 5,
          },
          filter: [
            'all',
            ['in', '$type', 'LineString'],
            ['in', 'class', 'alternate'],
          ],
        },
      ], // Customize the route line color to be orange
    })

    map.current.addControl(directions, 'top-left')
  }, [])

  return (
    <main ref={mapContainer} style={{ height: '600px', width: '600px' }}>
      <div className='map-container' ref={map} />
    </main>
  )
}
export default Map
