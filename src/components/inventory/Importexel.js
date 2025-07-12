import React, { useState ,useEffect} from "react";
import * as XLSX from "xlsx";
import pb from "../../utils/pocketbase";
import crypto from 'crypto-js';
import {useNavigate } from 'react-router-dom';

function ImportExcel() {



  const [jsonData, setJsonData] = useState([]);
  const [file, setFile] = useState(null);
  const [sale, setSale] = useState('');

  const isLogged = pb.authStore.isValid;
  const navigate = useNavigate();
  const isVerify = pb.authStore.model.verified;

  useEffect(() => {
   if(!isLogged || !isVerify){
    navigate('/')
   }
  }, []);

  const excelFileName = 'catalogue_sample_itp.xlsx';

  // Define the URL to the file in the public folder
  const excelFileURL = process.env.PUBLIC_URL + '/' + excelFileName;

  const handleFileUpload = (e) => {
    const uploadedFile = e.target.files[0];
    if (!uploadedFile) {
        // Display an alert if no file is selected
        alert('Please select a file to upload.');
        return; // Exit the function
      }
  
      // Check if the Sale input is empty
      if (sale.trim() === '') {
        alert('Please fill in the Sale field.');
        return; // Exit the function
      }
  
    if (uploadedFile) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = e.target.result;
        const workbook = XLSX.read(data, { type: "binary" });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const parsedData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        setFile({
            name: uploadedFile.name,
            size: uploadedFile.size,
          });
        if (parsedData.length > 0) {
          // Extract the header row
          const headerRow = parsedData[0];
          // Filter out rows with empty cells
          const filteredData = parsedData
            .slice(1)
            .filter((row) => row.some((cell) => cell !== ""));
          // Create an array of objects with header as keys
          let collection;
          const jsonData = filteredData.map((row) => {
            const rowData = {};

            headerRow.forEach((header, index) => {
              rowData[header] = row[index];
            });
            // Use ternary operators to set "collection" based on "category"
            collection =
            rowData.Category === "LEAF" && rowData.Package === 10
                ? 1.5
                : rowData.Category === "LEAF" && rowData.Package <= 5
                ? 0.75
                : rowData.Category === "DUST" && rowData.Package === 10
                ? 0.8
                : rowData.Category === "DUST" && rowData.Package <= 5
                ? 0.4
                : rowData.Category === "SUPPLEMENT" && rowData.Package === 10
                ? 0.5
                : rowData.Category === "SUPPLEMENT" && rowData.Package <= 5
                ? 0.25
                : "";
        
            rowData.Sale_number = parseInt(sale);
            rowData.Total_kg = 50 * rowData.Package;
            rowData.Grand_total = 50 * rowData.Package - collection;
            rowData.brokersID = pb.authStore.model.id;
            rowData.Liquor_rating = "35c0uc9dbzwxxou";
            rowData.Leaf_rating = "35c0uc9dbzwxxou";
            rowData.Gross_weight = 50.2;
            rowData.Net_weight = 50;
            rowData.Collection = collection;
            rowData.Season = "2023 2024";
            rowData.publish = false;
            rowData.Api_key="c4195c1327745d485c6f97dff140ccf2c07ec906";
            rowData.Decryption_key="5cf93508bf7074ca492e4b418b8a9fec8e25b5cf";
            rowData.Whitelist="https://64.15.255.69";
            return rowData;
          });
          setJsonData(jsonData);
          setFile(uploadedFile);
        }
      };

      reader.readAsBinaryString(uploadedFile);
    }
  };
  // function getCurrentTimestamp() {
  //   const now = new Date();
  //   const year = now.getUTCFullYear();
  //   const month = String(now.getUTCMonth() + 1).padStart(2, "0");
  //   const day = String(now.getUTCDate()).padStart(2, "0");
  //   const hours = String(now.getUTCHours()).padStart(2, "0");
  //   const minutes = String(now.getUTCMinutes()).padStart(2, "0");
  //   const seconds = String(now.getUTCSeconds()).padStart(2, "0");
  //   const milliseconds = String(now.getUTCMilliseconds()).padStart(3, "0");

  //   return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds}Z`;
  // }

  // function getCurrentTimestampWith5Seconds() {
  //   const currentTimestamp = new Date();
  //   currentTimestamp.setSeconds(currentTimestamp.getUTCSeconds() + 10);

  //   const year = currentTimestamp.getUTCFullYear();
  //   const month = String(currentTimestamp.getUTCMonth() + 1).padStart(2, "0");
  //   const day = String(currentTimestamp.getUTCDate()).padStart(2, "0");
  //   const hours = String(currentTimestamp.getUTCHours()).padStart(2, "0");
  //   const minutes = String(currentTimestamp.getUTCMinutes()).padStart(2, "0");
  //   const seconds = String(currentTimestamp.getUTCSeconds()).padStart(2, "0");
  //   const milliseconds = String(currentTimestamp.getUTCMilliseconds()).padStart(
  //     3,
  //     "0"
  //   );

  //   const modifiedTimestamp = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds}Z`;

  //   return { currentTimestamp: getCurrentTimestamp(), modifiedTimestamp };
  // }

  const uploadCatalogue = async () => {
    setIsLoading(true);
    for (const data of jsonData) {
      const generateHMAC = (data, secretKey) => {
        const hmac = crypto.HmacSHA256(data, secretKey);
        return crypto.enc.Hex.stringify(hmac);
      };
  
      const timestamps = new Date().toISOString().replace("T", " ");
      const currentTimestampl = new Date().getTime();
      const futureTimestamp = currentTimestampl + 30000;
      const timestamp =  futureTimestamp.toString();
      const secretKey = 'mySecretKey';
  
      // Generate HMAC
      const api_key = generateHMAC(timestamp, secretKey);
      try {
          const record = await pb.collection('catalog').create(data,{
            headers: {
              'time_stamp': timestamp,
              'created': timestamps,
              'api_key': api_key
            },
          });
          console.log(`Record added with ID: ${record.id}`);
        } catch (error) {
          console.error('Error adding record:', error);
        }
    }
    setIsLoading(false);
  };

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleButtonClick = () => {
    setIsLoading(true);

    // Simulate an API request or any async operation
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);

      // You can reset the success state after a certain duration if needed
      setTimeout(() => {
        setIsSuccess(false);
      }, 2000);
    }, 2000);
  };

  return (
    <div className="page-wrapper">
      <div className="content">
        <div className="page-header">
          <div className="page-title">
            <h4>Import Catalogue</h4>
            <h6>Bulk upload your catalogues</h6>
          </div>
        </div>
        {/* /product list */}
        <div className="card">
          <div className="card-body">
            <div className="requiredfield">
              <h4>Field must be in xlsx format</h4>
            </div>
            <div className="row">
              <div className="col-lg-3 col-sm-6 col-12">
                <div className="form-group">
                <a className="btn btn-submit w-100" href={excelFileURL} download={excelFileName}>
                Download Sample File
      </a>
   
                </div>
              </div>
              <div className="col-lg-12">
              <div class="col-lg-3 col-sm-6 col-12">
									<div class="form-group">
										<label>Sale no</label>
										<input type="text" name="sale"  value ={sale}onChange={(e)=>setSale(e.target.value)}/>
									</div>
								</div>
              </div>
              <div className="col-lg-12">
                <div className="form-group">
                  <label> Upload XLSX File</label>
                  <span>***Dont change any coloumn name.</span><br/>
                  <span>***All visible field must be required.</span><br/>
                  <span>***Use google spreadsheet for better experience.</span>
                 
                  <div className="image-upload">
                    <input
                      type="file"
                      accept=".xlsx"
                      onChange={handleFileUpload}
                    />
                    <div className="image-uploads">
                      <img src="assets/img/icons/upload.svg" alt="img" />
                      <h4>Drag and drop a file to upload</h4>
                    </div>
                  </div>
                </div>
              </div>
              <p><strong>File Name:</strong> {file?.name}</p>
          <p><strong>File Size:</strong> {file?.size} bytes</p>
              {/* <div className="col-lg-6 col-sm-12">
                <div className="productdetails productdetailnew">
                  <ul className="product-bar">
                    <li>
                      <h4>Product Name</h4>
                      <h6 className="manitorygreen">This Field is required</h6>
                    </li>
                    <li>
                      <h4>Category</h4>
                      <h6 className="manitorygreen">This Field is required</h6>
                    </li>
                    <li>
                      <h4>SKU code</h4>
                      <h6 className="manitorygreen">This Field is required</h6>
                    </li>
                    <li>
                      <h4>Product Cost</h4>
                      <h6 className="manitorygreen">This Field is required</h6>
                    </li>
                    <li>
                      <h4>Product Price</h4>
                      <h6 className="manitorygreen">This Field is required</h6>
                    </li>
                    <li>
                      <h4>Product Unit</h4>
                      <h6 className="manitorygreen">This Field is required</h6>
                    </li>
                    <li>
                      <h4>Description</h4>
                      <h6 className="manitoryblue">Field optional</h6>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="col-lg-6 col-sm-12">
                <div className="productdetails productdetailnew">
                  <ul className="product-bar">
                    <li>
                      <h4>Minimum Qty</h4>
                      <h6 className="manitoryblue">Field optional</h6>
                    </li>
                    <li>
                      <h4>Quantity</h4>
                      <h6 className="manitoryblue">Field optional</h6>
                    </li>
                    <li>
                      <h4>Tax</h4>
                      <h6 className="manitoryblue">Field optional</h6>
                    </li>
                    <li>
                      <h4>Discount Type</h4>
                      <h6 className="manitoryblue">Field optional</h6>
                    </li>
                    <li>
                      <h4>Brand</h4>
                      <h6 className="manitoryblue">Field optional</h6>
                    </li>
                    <li>
                      <h4>Minimum Qty</h4>
                      <h6 className="manitoryblue">Field optional</h6>
                    </li>
                  </ul>
                </div>
              </div> */}
 {file && (
        <div>
          <h2>Imported Data</h2>
         <div className="table-responsive">
         <table className="table table-striped table-bordered" >
            <thead>
              <tr>
                <th>#</th>
                <th>Factory</th>
                <th>Warehouse</th>
                <th>Category</th>
                <th>Grade</th>
                <th>Package</th>
                <th>Offer</th>
                <th>Grand Toatl</th>
                <th>Net Toatl</th>
                <th>Remarks</th>
              </tr>
            </thead>
            <tbody>
              {jsonData.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  <td>{rowIndex + 1}</td>
                  <td>{row.Factory_Name}</td>
                  <td>{row.Warehouse_Name}</td>
                  <td>{row.Category}</td>
                  <td>{row.Grade}</td>
                  <td>{row.Package}</td>
                  <td>{row.Offer_price}</td>
                  <td>{row.Total_kg}</td>
                  <td>{row.Grand_total}</td>
                  <td>{row.Remarks}</td>
                </tr>
              ))}
            </tbody>
          </table>
         </div>
          <div className="col-4">
           
          </div>
          {/* <button onClick={generateNewTable}>Generate New Table</button> */}
          <div className="col-lg-12">
                <div className="form-group mb-0">
                <button type="submit" onClick={uploadCatalogue} className="btn btn-submit me-2">
            {isLoading ? (
  <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
) : (
  <i className="fas fa-check"></i>
)}
            <span className="ml-5">   Upload</span>
            </button>
               
                </div>
              </div>
        </div>
      )}
              
            </div>
          </div>
        </div>
        {/* /product list */}
      </div>
     
    </div>
  );
}

export default ImportExcel;
