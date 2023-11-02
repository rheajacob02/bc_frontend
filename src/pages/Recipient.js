import React, { useState } from "react";
import axios from "axios";

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
        `http://127.0.0.1:3001/getDocumentByRegNumber`,
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
        <br />
        <label>Phone Number:</label>
        <input
          type="tel"
          placeholder="Enter Phone Number"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
        />
        <br />
        <button onClick={handleFetchDocuments}>Fetch Documents</button>
        {message && <p>{message}</p>} {/* Display message to the user */}
      </div>

      {documents.length > 0 && (
        <div>
          <h4>Your Documents:</h4>
          <ul>
            {documents.map((cid, index) => (
              <li key={index}>
                <button>
                  <a
                    href={`http://65.2.190.0:8080/ipfs/${cid}`}
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
