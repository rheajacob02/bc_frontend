import { React, useState } from "react";
import { Buffer } from "buffer";
import { create } from "kubo-rpc-client";
import axios from "axios"; // Install this using "npm install axios"

const client = create("/ip4/65.0.30.242/tcp/5001");

export const Admin = () => {
  const [buffer, setBuffer] = useState(null);
  const [name, setName] = useState("");

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
    // Compute the SHA-256 hash of the buffer
    const digest = await window.crypto.subtle.digest("SHA-256", buf);
    return Array.from(new Uint8Array(digest))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const u8 = new Uint8Array(Buffer.from(buffer));
    const { cid } = await client.add(u8);
    client.files.cp(`/ipfs/${cid}`, `/${name}`);

    const rawHash = await computeHash(buffer);
    console.log(rawHash);
    console.log(cid.toString());

    try {
      // Send the rawHash and CID to your backend
      await axios.post("http://127.0.0.1:3001/addDocument", {
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
        <input id="file_input" type="file" onChange={handleChange} />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};
