import React from 'react';
import './App.css';
import Map from './components/Map/index.jsx'
import { useState } from "react";
import useUnderpassAPI from './hooks/useUnderpassAPI';

const INIT_CENTER = [39.33782785533586,-104.89333236842782]

function App() {

  const [area, setArea] = useState(null);
  const {data, isLoading, error, fetchData} = useUnderpassAPI("raw/features");
  const [center, setCenter] = useState(INIT_CENTER);
  const [centerValue, setCenterValue] = useState(INIT_CENTER);

  const handleMapLoad = ({ bbox }) => {
    setArea(bbox);
    fetchData({ area: bbox });
  };
  
  const handleMapMoveEnd = ({ bbox, center }) => {
    setCenterValue(`${center.lng},${center.lat}`)
    setArea(bbox);
    fetchData({ area: bbox });
  };

  const handleCenterChange = (e) => {
    setCenterValue(e.target.value)
  }

  const handleSetCenterClick = (e) => {
    setCenter(centerValue.split(","));
  }

  return (
    <div className="app">
      <header className="header">
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
