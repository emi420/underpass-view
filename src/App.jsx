import React from 'react';
import './App.css';
import Map from './components/Map/index.jsx'
import { useState } from "react";
import useUnderpassAPI from './hooks/useUnderpassAPI';

const INIT_CENTER = [40.98726802794323, -111.8940771291513]

function App() {

  const [area, setArea] = useState(null);
  const {data, isLoading, error, fetchData} = useUnderpassAPI("raw/features");
  const [center, setCenter] = useState(INIT_CENTER);
  const [centerValue, setCenterValue] = useState(INIT_CENTER);
  const [osmId, setOsmId] = useState("");
  const [osmIdValue, setOsmIdValue] = useState("");

  const handleMapLoad = ({ bbox }) => {
    setArea(bbox);
    fetchData({ area: bbox });
  };
  
  const handleMapMoveEnd = ({ bbox, center }) => {
    setCenterValue(`${center.lng},${center.lat}`)
    setArea(bbox);
    fetchData({ area: bbox, osm_id: osmId });
  };

  const handleCenterChange = (e) => {
    setCenterValue(e.target.value)
  }

  const handleOsmIdChange = (e) => {
    setOsmIdValue(e.target.value)
  }

  const handleSetCenterClick = (e) => {
    setCenter(centerValue.split(","));
    setOsmId(osmIdValue);
  }

  return (
    <div className="app">
      <header className="header">
        <input className="textInput" type="text" onChange={handleOsmIdChange} placeholder="OSM Id" value={osmIdValue} />
        <input className="textInput" type="text" onChange={handleCenterChange} placeholder="lat, lon" value={centerValue} />
        <button className="button" onClick={handleSetCenterClick}>Go</button>
      </header>

      <div className="data">
        <div className="map">
          <Map data={data} center={center} onLoad={handleMapLoad} onMoveEnd={handleMapMoveEnd} />
        </div>
      </div>
    </div>
  );
}

export default App;
