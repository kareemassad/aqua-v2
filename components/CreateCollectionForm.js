'use client';

import { useState } from 'react';

export default function CreateCollectionForm() {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/collections', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, password }),
      });

      if (response.ok) {
        // Reset form and maybe trigger a refresh of the collection list
        setName('');
        setPassword('');
        alert('Collection created successfully!');
      } else {
        const data = await response.json();
        alert(`Failed to create collection: ${data.error}`);
      }
    } catch (error) {
      console.error('Error creating collection:', error);
      alert('An error occurred while creating the collection');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Collection Name"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      <button type="submit">Create Collection</button>
    </form>
  );
}