import React, { useState } from "react";
import axios from "axios";

export const Recipient = () => {
  const [regNumber, setRegNumber] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const getDocuments = async () => {
    try {
      const response = await axios.get('http://65.2.190.0:3001/getDocumentByRegNumber', {
        params: { regNumber, phoneNumber }
      });
      console.log(response.data);
      // Handle the response data (e.g., display the documents)
    } catch (error) {
      console.error("There was an error!", error);
      // Handle the error (e.g., show an error message)
    }
  };

  return (
    <div>
      
      <h3>Fetch Your Documents:</h3>
      <input
        type="text"
        value={regNumber}
        onChange={(e) => setRegNumber(e.target.value)}
        placeholder="Registration Number"
      />
      <br />
      <input
        type="tel"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
        placeholder="Phone Number"
      />
      <br />
      <button onClick={getDocuments}>Get Documents</button>
    </div>
  );
};
