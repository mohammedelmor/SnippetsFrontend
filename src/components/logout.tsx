'use client'
import React from "react";
import {Button} from "@nextui-org/react";
import {useSession, signOut} from "next-auth/react";

export default function LogoutDropdown() {
    const {data: session} = useSession()

    const handleLogout = () => {
        // Sign out from NextAuth
        // signOut({ callbackUrl: `${process.env.NEXT_PUBLIC_APP_URL}` })
        signOut().then(() => {
            window.location.href = `http://localhost:8080/realms/code_snippets/protocol/openid-connect/logout?post_logout_redirect_uri=http://localhost:3000&id_token_hint=${session?.id_token}`;
        })
        // Redirect to Keycloak logout URL
    }

    if (!session) return null
    return (
        <>
            <Button onPress={handleLogout} color="danger" variant="light">
                Sign Out
            </Button>

        </>
    );
}
