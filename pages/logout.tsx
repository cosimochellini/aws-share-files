import { useEffect } from "react";
import { useRouter } from "next/router";
import { signOut } from "next-auth/react";
import { useAuth } from "../src/hooks/auth.hook";

export default function Logout() {
  const router = useRouter();
  const { onUnauthenticated } = useAuth();

  useEffect(() => {
    signOut({}).then(() => router.push("/"));

    onUnauthenticated();
  }, [onUnauthenticated, router]);

  return (
    <>
      <h1>Logout </h1>
      <p>logging out...</p>
    </>
  );
}
