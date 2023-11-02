import React, { useState } from "react";
import axios from "axios";

export const Recipient = () => {
  const [regNumber, setRegNumber] = useState("");
  const [documents, setDocuments] = useState([]); // To store fetched CIDs of documents

  const handleFetchDocuments = async () => {
    let start = performance.now();
    try {
      const response = await axios.get(
        `http://127.0.0.1:3001/getDocumentByRegNumber?regNumber=${regNumber}`
      );
      setDocuments(response.data.cids);
      console.log(response.data.cids); // Backend returns an array of CIDs
      let end = performance.now();
      console.log("Time taken to fetch fromm ipfs= ", end - start);
    } catch (error) {
      console.error("Error fetching documents:", error);
    }
  };

  return (
    <div className="">
      <h3>Fetch Your Documents:</h3>

      <div>
        <label>Registration Number:</label>
        <input
          type="text"
          placeholder="Enter Registration Number"
          value={regNumber}
          onChange={(e) => setRegNumber(e.target.value)}
        />
        <button onClick={handleFetchDocuments}>Fetch Documents</button>
      </div>

      {documents.length > 0 && (
        <div>
          <h4>Your Documents:</h4>
          <ul>
            {documents.map((cid, index) => (
              <li key={index}>
                {/* Link to download the document from IPFS using CID */}
                <button>
                  <a
                    href={`http://13.232.187.19:8080/ipfs/${cid}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Document {index + 1}
                  </a>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
