import React, { useState } from 'react';

const DummyProductnew = () => {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file first.");
      return;
    }

    const formData = new FormData();
    formData.append('csv_file', file);

    try {
      const response = await fetch('https://petrolpump.fahimtraders.com/backend/dummyInsert/addproductnew.php', {
        method: 'POST',
        body: formData,
      });

      const result = await response.text();
      alert(result);
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  return (
    <div>
      <input type="file" accept=".csv" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload CSV</button>
    </div>
  );
};

export default DummyProductnew;
