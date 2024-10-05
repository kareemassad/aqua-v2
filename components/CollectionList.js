'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function CollectionList() {
  const [collections, setCollections] = useState([]);

  useEffect(() => {
    async function fetchCollections() {
      const response = await fetch('/api/collections');
      if (response.ok) {
        const data = await response.json();
        setCollections(data.collections);
      }
    }
    fetchCollections();
  }, []);

  return (
    <div>
      <h2>Your Collections</h2>
      {collections.length === 0 ? (
        <p>No collections found.</p>
      ) : (
        <ul>
          {collections.map((collection) => (
            <li key={collection._id}>
              <Link href={`/dashboard/collections/${collection._id}`}>
                {collection.name}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}