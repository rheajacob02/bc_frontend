import { React, useState } from "react";
import { Buffer } from "buffer";
import { create } from "kubo-rpc-client";
import axios from "axios";

const client = create("/ip4/13.232.187.19/tcp/5001");

export const Admin = () => {
  const [buffer, setBuffer] = useState(null);
  const [name, setName] = useState("");
  const [regNumber, setRegNumber] = useState("");
  const [timeTaken, setTimeTaken] = useState(0);

  const handleChange = (event) => {
    event.stopPropagation();
    event.preventDefault();

    const file = event.target.files[0];
    setName(file.name);

    let reader = new window.FileReader();
    reader.readAsArrayBuffer(file);
    reader.onloadend = () => {
      const file_buffer = reader.result;
      setBuffer(file_buffer);
    };
  };

  const computeHash = async (buf) => {
    const digest = await window.crypto.subtle.digest("SHA-256", buf);
    return Array.from(new Uint8Array(digest))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const startTime = performance.now(); // Using performance API for start time

    const u8 = new Uint8Array(Buffer.from(buffer));
    const { cid } = await client.add(u8);
    client.files.cp(`/ipfs/${cid}`, `/${name}`);

    const endTime = performance.now(); // Using performance API for end time

    const timeDiff = (endTime - startTime) / 1000; // Time difference in seconds
    setTimeTaken(timeDiff);

    const rawHash = await computeHash(buffer);
    console.log(rawHash);
    console.log(cid.toString());

    try {
      await axios.post("http://127.0.0.1:3001/addDocument", {
        regNumber,
        rawHash: `0x${rawHash}`,
        cid: cid.toString(),
      });
      console.log("Data sent successfully");
    } catch (error) {
      console.error("Error sending data to backend:", error);
    }

    document.getElementById("file_input").value = "";
  };

  return (
    <div className="">
      <h3>Upload File:</h3>
      <form onSubmit={handleSubmit}>
        <label>Registration Number:</label>
        <input
          type="text"
          placeholder="Enter Registration Number"
          value={regNumber}
          onChange={(e) => setRegNumber(e.target.value)}
          required
        />
        <br />
        <input id="file_input" type="file" onChange={handleChange} />
        <button type="submit">Submit</button>
      </form>
      {/* Displaying the time taken */}
      <p>
        Time taken to store the document in IPFS: {timeTaken.toFixed(4)} seconds
      </p>
    </div>
  );
};
