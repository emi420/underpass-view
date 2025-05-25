import { useEffect } from 'react';
import ListItem from '../ListItem';
import useUnderpassAPI from '../../hooks/useUnderpassAPI';

function List({ onSelectFeature }) {

    const {data, isLoading, error, fetchData} = useUnderpassAPI("raw/features");

    useEffect(() => {
        fetchData({ order_by: "timestamp desc", limit: 15 });
    }, []);

    return (
    <div className="featureList">
        <h2>Last updated</h2>
        {
            data?.features?.map(feature => (
                <ListItem
                    key={feature.id}
                    onSelect={onSelectFeature}
                    feature={feature}
                />
            ))
        }
    </div>
    );
}

export default List;
