import { useRef, useEffect } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { osm } from './source';
import './map.css';


// Return the map's boundary box
const getBBoxString = (map) => {
  const bbox = [
    [
      map.getBounds().getNorthEast().lng,
      map.getBounds().getNorthEast().lat,
    ].join(" "),
    [
      map.getBounds().getNorthWest().lng,
      map.getBounds().getNorthWest().lat,
    ].join(" "),
    [
      map.getBounds().getSouthWest().lng,
      map.getBounds().getSouthWest().lat,
    ].join(" "),
    [
      map.getBounds().getSouthEast().lng,
      map.getBounds().getSouthEast().lat,
    ].join(" "),
    [
      map.getBounds().getNorthEast().lng,
      map.getBounds().getNorthEast().lat,
    ].join(" "),
  ].join(",");
  return bbox;
}


export default function Map({ data, center, onLoad, onMoveEnd, selectedFeature }) {
    const mapContainer = useRef(null);
    const map = useRef(null);
      
    useEffect(() => {
      if (map.current) return;
    
      map.current = new maplibregl.Map({
        container: mapContainer.current,
        center: center.reverse() || [0,0],
        zoom: 19,
        style: osm
      });

      map.current.on("load", () => {

        // Add geojson data source
        map.current.addSource('data', {
          data: data,
          type: "geojson"
        });
        
        // Data layers
        map.current.addLayer({
          id: "lines",
          type: "line",
          source: "data",
          paint: {
            "line-color": [
                "match",
                  ["get", "id"],
                  selectedFeature || -1,
                  "blue",
                  "#D63F40"
            ],
            'line-width': [
              "match",
                ["get", "id"],
                selectedFeature || -1,
                5,
                2
            ],
          }
        });
        map.current.addLayer({
            'id': 'nodes',
            'type': 'circle',
            'source': 'data',
            'layout': {},
            'paint': {
                'circle-color': 
                [
                "match",
                  ["get", "id"],
                  selectedFeature || -1,
                  "blue",
                  "#D63F40"
                ],
                'circle-radius':
                [
                "match",
                  ["get", "id"],
                  selectedFeature || -1,
                  8,
                  4
                ]
            }
        });

        map.current.on("moveend", () => {
          onMoveEnd && onMoveEnd({ bbox: getBBoxString(map.current), center: map.current.getCenter() });
        });

        onLoad && onLoad({ bbox: getBBoxString(map.current) });
          
      });
    }, [data, selectedFeature]);


    //Update styles when selectedFeature changes
    useEffect(() => {
      if (!map.current || !map.current.getLayer('lines')) return;

      map.current.setPaintProperty("nodes", "circle-color", [
        "match",
        ["get", "id"],
        selectedFeature || -1,
        "blue",
        "#D63F40"
      ]);
      map.current.setPaintProperty("nodes", "circle-radius", [
        "match",
        ["get", "id"],
        selectedFeature || -1,
        8,
        4
      ]);

      map.current.setPaintProperty("lines", "line-color", [
        "match",
        ["get", "id"],
        selectedFeature || -1,
        "blue",
        "#D63F40"
      ]);

      map.current.setPaintProperty("lines", "line-width", [
        "match",
        ["get", "id"],
        selectedFeature || -1,
        5,
        2
      ]);
    }, [selectedFeature]);

    // Data
    useEffect(() => {
      if (!map.current || !data) return;
      if (map.current.getSource("data")) {
        map.current.getSource("data").setData(data);
      } 
    }, [data]);


    // Center
    useEffect(() => {
      if (!map.current || !center) return;
      map.current.setCenter(center);
    }, [center]);

    return (
      <div className="map-wrap">
        <div ref={mapContainer} className="map" />
      </div>
    );

  }

