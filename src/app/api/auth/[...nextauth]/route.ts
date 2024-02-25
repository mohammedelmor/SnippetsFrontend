import NextAuth from "next-auth"
import Keycloak from "next-auth/providers/keycloak"

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
        async jwt({token, account}) {
            // Persist the OAuth access_token to the token right after signin
            if (account) {
                token.id_token = account.id_token
                token.accessToken = account.access_token
            }
            return token
        },
        async session({session, token, user}) {
            // Send properties to the client, like an access_token from a provider.
            // @ts-ignore
            session.id_token = token.id_token as string
            // @ts-ignore
            session.accessToken = token.accessToken
            return session
        }
    }
})

export {handler as GET, handler as POST}