import { React, useState } from "react";
import axios from "axios";

export const RecipientLogin = () => {
  const [regNumber, setRegNumber] = useState("");
  const [password, setPassword] = useState("");
  const [response, setResponse] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const res = await axios.post("http://127.0.0.1:3001/recipientLogin", {
        regNumber,
        password,
      });
      setResponse(res);
      console.log(res);
    } catch (error) {
      console.error("Error logging in", error);
    }
  };

  return (
    <div className="">
      <h3>Login</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Registration Number"
          onChange={(e) => setRegNumber(e.target.value)}
          required
        />
        <br />
        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <br />
        <button>Submit</button>
      </form>
      <p>{response}</p>
    </div>
  );
};
