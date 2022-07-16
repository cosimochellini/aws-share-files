import { useRouter } from "next/router";
import { fireOnce } from "../src/hooks";

export default function Index() {
  const router = useRouter();

  fireOnce(() => router.push("/files"));

  return <div>Loading</div>;
}
