import React, { useState } from 'react';
import BackupModal from '../components/reuseable/BackupModal';
const FileChecker = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [fileName, setFileName] = useState('');

  const handleBackup = async () => {
    setLoading(true);
    setShowModal(true);
    setError(null);

    try {
      const response = await fetch('https://akhiandaputraders.com/backup/backup.php');
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Backup failed');
      }

      setFileName(data.filename);
      setLoading(false);
      setShowModal(false);

      // Trigger file download
      const downloadUrl = `https://akhiandaputraders.com/backup/download.php?file=${data.filename}`;
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      a.remove();

    } catch (error) {
      setError(error.message);
      setLoading(false);
      setShowModal(false);
    }
  };

  return (
    <div>
      <button onClick={handleBackup} disabled={loading}>
        {loading ? 'Backing up...' : 'Backup Database'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {fileName && <p>Backup complete: {fileName}</p>}

      <BackupModal show={showModal} />
    </div>
  );
};

export default FileChecker;
