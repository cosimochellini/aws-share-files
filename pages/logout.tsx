import { useRouter } from "next/router";
import { signOut } from "next-auth/react";
import { useAuth } from "../src/hooks/auth.hook";
import { useEffectOnceWhen } from "../src/hooks/once";

export default function Logout() {
  const router = useRouter();
  const { onUnauthenticated } = useAuth();

  useEffectOnceWhen(() => {
    signOut({}).then(() => router.push("/"));

    onUnauthenticated();
  });

  return (
    <>
      <h1>Logout </h1>
      <p>logging out...</p>
    </>
  );
}
