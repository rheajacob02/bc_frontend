import React, { useState } from 'react';
import axios from 'axios';

export const Validator = () => {
    const [file, setFile] = useState(null);
    const [resultMessage, setResultMessage] = useState("");

    const onFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const computeHash = async (buf) => {
      // Compute the SHA-256 hash of the buffer
      const digest = await window.crypto.subtle.digest("SHA-256", buf);
      return Array.from(new Uint8Array(digest))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
    };

    const validateDocument = async () => {
        if (!file) {
            alert("Please upload a document.");
            return;
        }

        const reader = new window.FileReader();
        reader.readAsArrayBuffer(file);
        reader.onload = async () => {
            const file_buffer = reader.result;
            let rawHash = await computeHash(file_buffer);
            
            // Ensure the rawHash is in bytes32 format by prefixing it with '0x'
            if (!rawHash.startsWith('0x')) {
                rawHash = '0x' + rawHash;
            }
            console.log(rawHash);

            try {
                const response = await axios.post("http://65.2.190.0:3001/verifyDocument", { rawHash });
                if (response.data.message) {
                    setResultMessage(response.data.message);
                }
            } catch (error) {
                setResultMessage("Error validating the document.");
            }
        };
    };

    return (
        <div>
            <input type="file" onChange={onFileChange} />
            <button onClick={validateDocument}>Validate Document</button>
            <p>{resultMessage}</p>
        </div>
    );
}
