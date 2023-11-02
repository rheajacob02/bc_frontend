import React, { useState } from "react";
import axios from "axios";

export const Recipient = () => {
  const [regNumber, setRegNumber] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [documents, setDocuments] = useState([]);

  const handleFetchDocuments = async () => {
    let start = performance.now();
    try {
      const response = await axios.get(
        `http://65.2.190.0git:3001/getDocumentByRegNumber`,
        { params: { regNumber, phoneNumber } } // Pass both regNumber and phoneNumber as query parameters
      );
      setDocuments(response.data.cids);
      let end = performance.now();
      console.log("Time taken to fetch documents: ", end - start);
    } catch (error) {
      console.error("Error fetching documents:", error);
    }
  };

  return (
    <div>
      <h3>Fetch Your Documents:</h3>
      <div>
        <label>Registration Number:</label>
        <input
          type="text"
          placeholder="Enter Registration Number"
          value={regNumber}
          onChange={(e) => setRegNumber(e.target.value)}
        />
        <label>Phone Number:</label>
        <input
          type="tel"
          placeholder="Enter Phone Number"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
        />
        <button onClick={handleFetchDocuments}>Fetch Documents</button>
      </div>
      {documents.length > 0 && (
        // ... rest of the component remains unchanged
      )}
    </div>
  );
};
