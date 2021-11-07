import SMB2 from "@marsaud/smb2";
import SambaClient from "samba-client";

const domain = "WORKGROUP";
const address = process.env.address as string;
const username = process.env.user as string;
const password = process.env.password as string;
const port = 445;

console.log(
  `Connecting to ${JSON.stringify({ domain, address, username, password })}`
);

export const smbClient = new SMB2({
  port,
  domain,
  username,
  password,
  share: address,
  packetConcurrency: 1,
});

export const client = new SambaClient({
  port,
  domain,
  address,
  username,
  password,
});
