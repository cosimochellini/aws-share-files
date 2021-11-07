import SMB2 from "@marsaud/smb2";
import SambaClient from "samba-client";
import { env } from "./env";

const port = 445;
const domain = "WORKGROUP";
const { address, password, username } = env;

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
  address,
  username: username + "%" + password,
});
