import { settings } from "../src/instances/settings";

export default function Settings() {
  return (
    <div>
      <h1>Settings</h1>
      <p>version: {settings.version}</p>
    </div>
  );
}
