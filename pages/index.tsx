import { useRouter } from "next/router";
import { useEffectOnceWhen } from "../src/hooks/once";

export default function Index() {
  const router = useRouter();

  useEffectOnceWhen(() => {
    router.push("/files");
  });

  return <div>Loading</div>;
}
