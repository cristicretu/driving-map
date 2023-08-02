import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import Directions from '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions';
import './Map.css';
import polyline from '@mapbox/polyline'
import html2canvas from 'html2canvas';

mapboxgl.accessToken = import.meta.env.VITE_PUBLIC_MAPBOX_ACCESS_TOKEN ?? '';

const Map = () => {
  const mapContainerRef = useRef(null);

  const [lng, setLng] = useState(24);
  const [lat, setLat] = useState(45);
  const [zoom, setZoom] = useState(5);
  const [totalKilometers, setTotalKilometers] = useState(0);

  // Initialize map when component mounts
  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [lng, lat],
      zoom: zoom,
      pitch: 0,
      projection: 'mercator',
      preserveDrawingBuffer: true
    });

    const directions = new MapboxDirections({
      accessToken: mapboxgl.accessToken,
      unit: 'metric',
      profile: 'mapbox/driving',
      controls: {
        // inputs: false,
        instructions: false,
        // show only driving profile
        profileSwitcher: false,
      },
    });
    map.addControl(directions, 'top-left');

    // directions.on('route', (event) => {
    //   const routeGeoJSON = polyline.toGeoJSON(event.route[0].geometry);
    //   setRoutes(oldRoutes => [...oldRoutes, routeGeoJSON]);
    // });

    let pendingRoute = null;

    directions.on('route', (event) => {
      const routeGeoJSON = polyline.toGeoJSON(event.route[0].geometry);
      const routeID = Date.now();
      const distance = event.route[0].distance / 1000; // Convert meters to kilometers

      setTotalKilometers(oldKm => oldKm + distance); 


      map.addSource(routeID.toString(), {
        type: 'geojson',
        data: routeGeoJSON,
      });

      map.addLayer({
        id: routeID.toString(),
        type: 'line',
        source: routeID.toString(),
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-color': 'orange',
          'line-width': 5
        }
      });
    });

    const clearInputsOnEsc = (event) => {
      if (event.key === 'Escape') {
        const inputsContainer = document.querySelector('.mapbox-directions-component-keyline');
        const closeButton = inputsContainer.querySelector('.geocoder-pin-right .geocoder-icon-close.active');
        const closeButton2 = inputsContainer.querySelector('.geocoder-pin-right .geocoder-icon-close');

        closeButton2.click();
        closeButton.click();


        // originInput.value = null;
        // destinationInput.value = null;
        
      }
    };
  
    window.addEventListener('keydown', clearInputsOnEsc);


    // Add navigation control (the +/- zoom buttons)
    map.addControl(new mapboxgl.NavigationControl(), 'top-right');

    map.on('move', () => {
      setLng(map.getCenter().lng.toFixed(4));
      setLat(map.getCenter().lat.toFixed(4));
      setZoom(map.getZoom().toFixed(2));
    });

    // Clean up on unmount
    return () => {
      window.removeEventListener('keydown', clearInputsOnEsc);
      map.remove();
    };  }, []); 

  const playShutterSound = async () => {
    const audioContext = new window.AudioContext();
    const response = await fetch('/camera.mp3');
    const audioData = await response.arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(audioData);
    const source = audioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(audioContext.destination);
    source.start();
  };

  const handleDownload = async () => {
    if (mapContainerRef.current) {
      hideControl(); 
      playShutterSound();
  
      html2canvas(mapContainerRef.current).then((canvas) => {
        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/png');
        link.download = 'map.png';
        link.click();
  
        showControl(); 
      });
    }
  };

  const hideControl = () => {
    document.querySelector('.mapbox-directions-inputs').style.display = 'none';
    document.querySelector('.mapboxgl-ctrl-top-right').style.display = 'none';
    document.querySelector('.mapboxgl-ctrl-logo').style.display = 'none';
    document.querySelector('.mapboxgl-ctrl-attrib').style.display = 'none';
  };
  
  const showControl = () => {
    document.querySelector('.mapbox-directions-inputs').style.display = '';
    document.querySelector('.mapboxgl-ctrl-top-right').style.display = '';
    document.querySelector('.mapboxgl-ctrl-logo').style.display = '';
    document.querySelector('.mapboxgl-ctrl-attrib').style.display = '';
  };

  return (
    <div>
      <div className='sidebarStyle'>
        <button onClick={handleDownload} style={{
          fontSize: '2rem',
        }} >
        📸
        </button>
      </div>

      <div style={{
        display: 'flex',
        position: 'absolute',
        bottom: '0',
        right: '0',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '12px',
        margin: '24px',
        marginRight: '5rem',
      }}>
        <p className='disclaimer'>Press ESC to clear old routes.</p>
        <div className='sidebarStyleKM'>
          <p>Total Kilometers: {Math.round(totalKilometers)}</p>
        </div>
      </div>

      <div className='map-container' ref={mapContainerRef} />
    </div>
  );
};

export default Map;
