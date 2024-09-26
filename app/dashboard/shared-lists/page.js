 "use client";

import { useEffect, useState } from 'react';
import axios from 'axios';

const SharedListsPage = () => {
    const [sharedLists, setSharedLists] = useState([]);

    const fetchSharedLists = async () => {
        try {
            const response = await axios.get('/api/shared-lists');
            setSharedLists(response.data.sharedLists);
        } catch (error) {
            console.error('Error fetching shared lists:', error);
        }
    };

    useEffect(() => {
        fetchSharedLists();
    }, []);

    return (
        <div>
            <h1>Shared Lists</h1>
            <ul>
                {sharedLists.map(list => (
                    <li key={list.id}>
                        {list.name} - <a href={`/shared-lists/${list.unique_link}`}>View</a>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default SharedListsPage;