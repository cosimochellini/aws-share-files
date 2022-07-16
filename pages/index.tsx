import { useRouter } from "next/router";
import { useEffectOnce } from "../src/hooks";

export default function Index() {
  const router = useRouter();

  useEffectOnce(() => {
    router.push("/files");
  });

  return <div>Loading</div>;
}
