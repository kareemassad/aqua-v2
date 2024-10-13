"use client";

import { useEffect, useState } from "react";
import axios from "axios";

const SubscriptionsPage = () => {
  const [subscriptions, setSubscriptions] = useState([]);

  const fetchSubscriptions = async () => {
    try {
      const response = await axios.get("/api/subscriptions");
      setSubscriptions(response.data.subscriptions);
    } catch (error) {
      console.error("Error fetching subscriptions:", error);
    }
  };

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  return (
    <div>
      <h1>Subscriptions</h1>
      <ul>
        {subscriptions.map((sub) => (
          <li key={sub.id}>
            {sub.name} - ${sub.price} per {sub.billing_cycle}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SubscriptionsPage;
