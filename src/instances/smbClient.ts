import SMB2 from "@marsaud/smb2";
import SambaClient from "samba-client";

const address = process.env.address as string;
const username = process.env.username as string;
const password = process.env.password as string;

export const smbClient = new SMB2({
  share: address,
  username,
  password,
  port: 445,
  domain: "WORKGROUP",
});

export let client = new SambaClient({ address, username, password });
