import { useEffect, useState } from 'react';
import ListItem from '../ListItem';
import useUnderpassAPI from '../../hooks/useUnderpassAPI';

function List({ onSelectFeature }) {

    const {data, isLoading, error, fetchData} = useUnderpassAPI("raw/features");
    const [selectedFeature, setSelectedFeature] = useState(-1);

    useEffect(() => {
        fetchData({ order_by: "timestamp desc", limit: 30 });
    }, []);

    const selectFeatureHandler = (feature) => {
        setSelectedFeature(feature.id);
        onSelectFeature && onSelectFeature(feature);
    }

    return (
    <div className="featureList">
        <h2>Last updated</h2>
        {
            data?.features?.map(feature => (
                <ListItem
                    selected={selectedFeature == feature.id}
                    key={feature.id}
                    onSelect={selectFeatureHandler}
                    feature={feature}
                />
            ))
        }
    </div>
    );
}

export default List;
