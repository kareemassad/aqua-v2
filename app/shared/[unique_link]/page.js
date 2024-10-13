"use client";

import { useParams } from "next/navigation";
import CollectionPage from "@/components/CollectionPage";
import { useEffect, useState } from "react";

export default function CollectionPageWrapper() {
  const params = useParams();
  const { unique_link } = params;
  const [collectionData, setCollectionData] = useState(null);

  useEffect(() => {
    if (unique_link) {
      fetch(`/api/collections/link/${unique_link}`)
        .then((res) => res.json())
        .then((data) => setCollectionData(data.collection))
        .catch((err) => console.error(err));
    }
  }, [unique_link]);

  if (!collectionData) return <p>Loading...</p>;

  return <CollectionPage collection={collectionData} />;
}
