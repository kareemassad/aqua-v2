 "use client";

import { useEffect, useState } from 'react';
import axios from 'axios';

const CollectionsPage = () => {
    const [collections, setCollections] = useState([]);

    const fetchCollections = async () => {
        try {
            const response = await axios.get('/api/shared-lists');
            setCollections(response.data.collections);
        } catch (error) {
            console.error('Error fetching shared lists:', error);
        }
    };

    useEffect(() => {
        fetchCollections();
    }, []);

    return (
        <div>
            <h1>Shared Lists</h1>
            <ul>
                {collections.map(list => (
                    <li key={list.id}>
                        {list.name} - <a href={`/shared-lists/${list.unique_link}`}>View</a>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default CollectionsPage;