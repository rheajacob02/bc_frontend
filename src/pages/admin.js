import { React, useState } from "react";
import { Buffer } from "buffer";
import { create } from "kubo-rpc-client";
import axios from "axios";
import './Admin.css';

const client = create("/ip4/65.2.190.0/tcp/5001");

export const Admin = () => {
  const [buffer, setBuffer] = useState(null);
  const [name, setName] = useState("");
  const [regNumber, setRegNumber] = useState("");
  const [timeTaken, setTimeTaken] = useState(0);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [message, setMessage] = useState("");

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post("http://65.2.190.0:3001/adminLogin", {
        username,
        password,
      });

      if (response.status === 200) {
        setIsLoggedIn(true);
        setMessage("Login successful");
      } else {
        setMessage("Invalid credentials");
      }
    } catch (error) {
      console.error("Error during login:", error);
      setMessage("Error during login. Please try again.");
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="login-container">
        <h3>Admin Login:</h3>
        <form onSubmit={handleLogin} className="login-form">
          <div className="input-group">
            <label>Username:</label>
            <input
              type="text"
              placeholder="Enter Username"
              className="input-field"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label>Password:</label>
            <input
              type="password"
              placeholder="Enter Password"
              className="input-field"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="submit-btn">Login</button>
        </form>
        <p className="message">{message}</p>
      </div>
    );
  }

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

    const timeDiff = (endTime - startTime) / 1000;  // Time difference in seconds
    setTimeTaken(timeDiff); 

    const rawHash = await computeHash(buffer);
    console.log(rawHash);
    console.log(cid.toString());

    try {
      await axios.post("http://65.2.190.0:3001/addDocument", {
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
    <div className="upload-container">
      <h3>Upload File:</h3>
      <form onSubmit={handleSubmit} className="upload-form">
        <div className="input-group">
          <label>Registration Number:</label>
          <input
            type="text"
            placeholder="Enter Registration Number"
            className="input-field"
            value={regNumber}
            onChange={(e) => setRegNumber(e.target.value)}
            required
          />
        </div>
        <div className="file-input-group">
          <input id="file_input" type="file" className="file-input" onChange={handleChange} />
          <button type="submit" className="submit-btn">Submit</button>
        </div>
      </form>
      <p className="time-taken">
        Time taken to store the document in IPFS: {timeTaken.toFixed(4)} seconds
      </p>
    </div>
  );

};
