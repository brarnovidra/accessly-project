"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from 'js-cookie'

export default function AuthCallbackPage() {
    const router = useRouter();

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const accessToken = params.get("accessToken");
        const refreshToken = params.get("refreshToken");

        if (accessToken && refreshToken) {
            Cookies.set('accessToken', accessToken, { expires: 1, sameSite: 'Strict' })
            Cookies.set('refreshToken', refreshToken, { expires: 7, sameSite: 'Strict' })

            router.replace("/dashboard");
        } else {
            router.replace("/login");
        }
    }, [router]);

    return <p className="text-center mt-10">Logging you in...</p>;
}
