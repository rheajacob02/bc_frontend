import React, { useState } from "react";
import axios from "axios";
import './Recipient.css';

export const Recipient = () => {
  const [regNumber, setRegNumber] = useState("");
  const [phoneNumber, setPhoneNumber] = useState(""); // State hook for phone number
  const [documents, setDocuments] = useState([]);
  const [message, setMessage] = useState(""); // To show messages to the user

  const handleFetchDocuments = async () => {
    if (!regNumber || !phoneNumber) {
      setMessage("Please enter both registration number and phone number.");
      return;
    }

    let start = performance.now();
    try {
      const response = await axios.get(
        `http://65.2.190.0:3001/getDocumentByRegNumber`,
        {
          params: {
            regNumber,
            phoneNumber,
          },
        }
      );
      if (response.status === 200 && response.data.cids) {
        setDocuments(response.data.cids);
        setMessage("");
      } else {
        setMessage("No documents found or access denied.");
        setDocuments([]);
      }
      let end = performance.now();
      console.log(
        "Time taken to fetch from IPFS: ",
        (end - start).toFixed(4),
        "ms"
      );
    } catch (error) {
      console.error("Error fetching documents:", error);
      setMessage("Error fetching documents. Please try again.");
    }
  };

  return (
    <div className="recipient-container">
      <h3 className="title">Fetch Your Documents:</h3>
      <div className="input-group">
        <label className="input-label">Registration Number:</label>
        <input
          className="input-field"
          type="text"
          placeholder="Enter Registration Number"
          value={regNumber}
          onChange={(e) => setRegNumber(e.target.value)}
        />
        <br />
        <label className="input-label">Phone Number:</label>
        <input
          className="input-field"
          type="tel"
          placeholder="Enter Phone Number"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
        />
        <br />
        <button className="fetch-button" onClick={handleFetchDocuments}>
          Fetch Documents
        </button>
        {message && <p className="message">{message}</p>}
      </div>
      {documents.length > 0 && (
        <div className="documents-list">
          <h4 className="title">Your Documents:</h4>
          <ul>
            {documents.map((cid, index) => (
              <li key={index} className="document-item">
                <a
                  className="document-link"
                  href={`http://65.2.190.0:8080/ipfs/${cid}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Document {index + 1}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};