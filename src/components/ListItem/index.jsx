
function ListItem({ feature, onSelect, selected }) {
    return (
    <div className={`feature ${selected ? "selected" : ""}`}>
        {
           <span onClick={e => onSelect(feature)}>
            {feature.properties.osm_type} {feature.id}
           </span>
        }
    </div>
    );
}

export default ListItem;
