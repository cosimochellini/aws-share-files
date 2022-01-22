import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";

const loginPath = "/api/auth/signin";

export const useAuth = () => {
    const router = useRouter()

    const onUnauthenticated = useCallback(() => {
        if (router.pathname === loginPath) return;

        router.push(loginPath)
    }, [router])

    const { data: session, status } = useSession({ onUnauthenticated, required: true });

    const [authenticated, setAuthenticated] = useState(true)

    useEffect(() => {
        if (status === "loading") return;

        if (!session?.user?.email) {
            onUnauthenticated()
            setAuthenticated(false)
            return;
        }

        setAuthenticated(!!session?.user?.email)

    }, [onUnauthenticated, session?.user?.email, status])

    return { authenticated, session }
}
