'use client';

import { useState } from 'react';

export default function CleanupButton() {
  const [cleaning, setCleaning] = useState(false);
  const [cleanupMessage, setCleanupMessage] = useState('');

  const handleCleanup = async () => {
    setCleaning(true);
    setCleanupMessage('');

    try {
      const response = await fetch('/api/cleanup', {
        method: 'POST',
      });

      const data = await response.json();
      setCleanupMessage(`Cleanup successful! Deleted ${data.deletedCount} files.`);
    } catch (error) {
      console.error('Error cleaning uploads directory:', error);
      setCleanupMessage('Error cleaning uploads directory.');
    } finally {
      setCleaning(false);
    }
  };

  return (
    <div className="cleanup-container">
      <button
        className="cleanup-button"
        onClick={handleCleanup}
        disabled={cleaning}
      >
        {cleaning ? 'Cleaning...' : 'Clean Uploads Directory'}
      </button>
      {cleanupMessage && <p className="cleanup-message">{cleanupMessage}</p>}
    </div>
  );
}
