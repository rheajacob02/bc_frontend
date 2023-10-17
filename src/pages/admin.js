import { React, useState } from "react";
import { Buffer } from "buffer";
import { create } from "kubo-rpc-client";

const client = create("/ip4/127.0.0.1/tcp/5001");

export const Admin = () => {
  const [buffer, setBuffer] = useState(null);
  const [name, setName] = useState("");
  // const [cid, setCID] = useState("")

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

  const handleSubmit = async (event) => {
    event.preventDefault();
    const u8 = new Uint8Array(Buffer.from(buffer));
    const { cid } = await client.add(u8);
    client.files.cp(`/ipfs/${cid}`, `/${name}`);
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
