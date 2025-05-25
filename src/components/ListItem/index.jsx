function ListItem({ feature, onSelect }) {

    return (
    <div className="feature">
        {
           <span onClick={e => onSelect(feature)}>
            {feature.properties.osm_type} {feature.id}
           </span>
        }
    </div>
    );
}

export default ListItem;
