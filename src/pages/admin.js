import { React, useState } from "react";
import { Buffer } from "buffer";
import { createHelia } from "helia";
// import { dagCbor } from "@helia/dag-cbor";
import { unixfs } from "@helia/unixfs";

const helia = await createHelia();
// const c = dagCbor(helia)
const fs = unixfs(helia);

export const Admin = () => {
  const [buffer, setBuffer] = useState(null);
  // const [cid, setCID] = useState("")

  const handleChange = (event) => {
    event.stopPropagation();
    event.preventDefault();

    const file = event.target.files[0];

    let reader = new window.FileReader();
    reader.readAsArrayBuffer(file);
    reader.onloadend = () => {
      const file_buffer = reader.result;
      setBuffer(file_buffer);
    };
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log(buffer);
    const u8 = new Uint8Array(Buffer.from(buffer));
    const cid = await fs.addFile({ content: u8 });
    // helia.pin(cid);
    console.log(cid.toString());
  };

  return (
    <div className="">
      <h3>Upload File:</h3>
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleChange} />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};
