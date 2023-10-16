import { React, useState } from "react";
import { Buffer } from "buffer";
import { createHelia } from "helia";
// import { dagCbor } from "@helia/dag-cbor";
import { unixfs } from "@helia/unixfs";
import { createLibp2p } from "libp2p";
import { identifyService } from "libp2p/identify";
import { noise } from "@chainsafe/libp2p-noise";
import { yamux } from "@chainsafe/libp2p-yamux";
import { bootstrap } from "@libp2p/bootstrap";
import { tcp } from "@libp2p/tcp";

const libp2p = await createLibp2p({
  addresses: {
    listen: ["/ip4/127.0.0.1/tcp/5001"],
  },
  transports: [tcp()],
  connectionEncryption: [noise()],
  streamMuxers: [yamux()],
  peerDiscovery: [
    bootstrap({
      list: [
        "/dnsaddr/bootstrap.libp2p.io/p2p/QmNnooDu7bfjPFoTZYxMNLWUQJyrVwtbZg5gBMjTezGAJN",
        "/dnsaddr/bootstrap.libp2p.io/p2p/QmQCU2EcMqAqQPR2i9bChDtGNJchTbq5TbXJJ16u19uLTa",
        "/dnsaddr/bootstrap.libp2p.io/p2p/QmbLHAnMoJPWSCR5Zhtx6BHJX9KiKNN6tpvbUcqanj75Nb",
        "/dnsaddr/bootstrap.libp2p.io/p2p/QmcZf59bWwK5XFi76CZX8cbJ4BhTzzA3gU1ZjYZcYW3dwt",
      ],
    }),
  ],
  services: {
    identify: identifyService(),
  },
});

const helia = await createHelia(libp2p);
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
