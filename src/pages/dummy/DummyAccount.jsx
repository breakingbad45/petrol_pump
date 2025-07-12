import React, { useState } from "react";

const DummyAccount = () => {
  const [csvData, setCsvData] = useState([]);
  const [fileName, setFileName] = useState("");

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target.result;
      const rows = text.split("\n").map((row) => row.split(","));
      setCsvData(rows);
    };
    reader.readAsText(file);
  };

  const handleUploadToServer = async () => {
    console.log(csvData);
    
    try {
      const response = await fetch("https://petrolpump.fahimtraders.com/backend/dummyInsert/addaccounts.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(csvData),
      });

      const result = await response.text();
      alert(result);
    } catch (error) {
      console.error("Error uploading data:", error);
      alert("Failed to upload data.");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">CSV Upload and Preview</h1>
      <input
        type="file"
        accept=".csv"
        onChange={handleFileUpload}
        className="mb-4"
      />
      {fileName && <p>Uploaded File: {fileName}</p>}
      <table className="table-auto border-collapse border border-gray-400 w-full mb-4">
        <thead>
          <tr>
            {csvData[0]?.map((header, index) => (
              <th key={index} className="border border-gray-400 px-2 py-1">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {csvData.slice(1).map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <td
                  key={cellIndex}
                  className="border border-gray-400 px-2 py-1"
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <button
        onClick={handleUploadToServer}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Upload to Server
      </button>
    </div>
  );
};

export default DummyAccount;
