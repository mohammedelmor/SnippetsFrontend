import NextAuth from "next-auth"
import {JWT} from "next-auth/jwt";
import Keycloak from "next-auth/providers/keycloak";


/**
 * Takes a token, and returns a new token with updated
 * `accessToken` and `accessTokenExpires`. If an error occurs,
 * returns the old token and an error property
 */
async function refreshAccessToken(token: JWT) {
    try {

        const details = {
            client_id: process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID,
            client_secret: process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_SECRET,
            grant_type: 'refresh_token',
            refresh_token: token.refreshToken
        };

        // @ts-ignore
        const formBody = Object.entries(details).map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`).join('&');

        const response = await fetch(process.env.NEXT_PUBLIC_KEYCLOAK_REFRESH_TOKEN || '', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
            },
            body: formBody
        })

        const refreshedTokens = await response.json()

        if (!response.ok) {
            throw refreshedTokens
        }

        return {
            ...token,
            accessToken: refreshedTokens.access_token,
            accessTokenExpires: Date.now() + refreshedTokens.expires_in * 1000,
            refreshToken: refreshedTokens.refresh_token ?? token.refreshToken, // Fall back to old refresh token
        }
    } catch (error) {
        console.log(error)

        return {
            ...token,
            error: "RefreshAccessTokenError",
        }
    }
}

const handler = NextAuth({
    providers: [
        Keycloak({
            clientId: process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID ?? "",
            clientSecret: process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_SECRET ?? "",
            authorization: process.env.NEXT_PUBLIC_KEYCLOAK_AUTHORIZATION ?? "",
            issuer: process.env.NEXT_PUBLIC_KEYCLOAK_ISSUER ?? "",
        }),
    ],
    callbacks: {
        async jwt({token, user, account}) {
            // Initial sign in
            if (account && user) {
                return {
                    accessToken: account.accessToken,
                    // @ts-ignore
                    accessTokenExpires: Date.now() + account.expires_in * 1000,
                    refreshToken: account.refresh_token,
                    idToken:account.id_token,
                    user,
                }
            }

            // Return previous token if the access token has not expired yet
            // @ts-ignore
            if (Date.now() < token.accessTokenExpires) {
                return token
            }
            // Access token has expired, try to update it
            return refreshAccessToken(token)
        },
        async session({session, token}) {
            if (token) {
                // @ts-ignore
                session.user = token.user
                // @ts-ignore
                session.accessToken = token.accessToken
                // @ts-ignore
                session.idToken = token.idToken
                // @ts-ignore
                session.error = token.error
            }

            return session
        },
    },
})

export {handler as GET, handler as POST}
