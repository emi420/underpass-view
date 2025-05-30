import './App.css';
import Map from './components/Map/index.jsx';
import List from './components/List/index.jsx';
import { useState } from "react";
import useUnderpassAPI from './hooks/useUnderpassAPI';

const INIT_CENTER = import.meta.env.VITE_INIT_CENTER.split(',').map(Number);

function App() {

  const [area, setArea] = useState(null);
  const {data, isLoading, error, fetchData} = useUnderpassAPI("raw/features");
  
  const [center, setCenter] = useState(INIT_CENTER);
  const [centerValue, setCenterValue] = useState(INIT_CENTER);
  const [osmId, setOsmId] = useState("");
  const [osmIdValue, setOsmIdValue] = useState("");
  const [selectedFeature, setSelectedFeature] = useState(-1);

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

  const handleSelectFeature = (feature) => {
    let coords;
    // Way or Relation
    if (feature.properties.osm_type === "way" || feature.properties.osm_type === "relation") {
      if (feature.geometry.coordinates[0][0].length > 0) {
        coords = [feature.geometry.coordinates[0][0][0], feature.geometry.coordinates[0][0][1]];
      } else {
        coords = [feature.geometry.coordinates[0][0], feature.geometry.coordinates[0][1]];
      }
    } else {
      // Node
      coords = [feature.geometry.coordinates[0], feature.geometry.coordinates[1]];
    }
    setCenter(coords);
    setOsmId(feature.id);
    setOsmIdValue(feature.id);
    setSelectedFeature(feature.id);
  }

  return (
    <div className="app">
      <header className="header">
        <input disabled className="textInput" type="text" onChange={handleOsmIdChange} placeholder="OSM Id" value={osmIdValue} />
        <input className="textInput" type="text" onChange={handleCenterChange} placeholder="lat, lon" value={centerValue} />
        <button className="button" onClick={handleSetCenterClick}>Go</button>
      </header>

      <div className="data">
        <div className="map">
          <Map selectedFeature={selectedFeature} data={data} center={center} onLoad={handleMapLoad} onMoveEnd={handleMapMoveEnd} />
        </div>
        <div className="list">
          <List onSelectFeature={handleSelectFeature}/>
        </div>
      </div>
    </div>
  );
}

export default App;
