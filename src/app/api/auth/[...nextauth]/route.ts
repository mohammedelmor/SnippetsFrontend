// import NextAuth from "next-auth"
// import Keycloak from "next-auth/providers/keycloak"
// import {JWT} from "next-auth/jwt";
//
// const refreshAccessToken = async (token: JWT) => {
//     try {
//         // @ts-ignore
//         if (Date.now() > token.refreshTokenExpired) {
//             console.log('Error thrown');
//             throw Error;
//         }
//         const details = {
//             client_id: process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID,
//             client_secret: process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_SECRET,
//             grant_type: 'refresh_token',
//             refresh_token: token.refreshToken
//         };
//         const formBody: string[] = [];
//         Object.entries(details).forEach(([key, value]: [string, any]) => {
//             const encodedKey = encodeURIComponent(key);
//             const encodedValue = encodeURIComponent(value);
//             formBody.push(encodedKey + '=' + encodedValue);
//         });
//         const formData = formBody.join('&');
//         const url = process.env.KEYCLOAK_AUTH_TOKEN_URL || '';
//         const response = await fetch(url, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
//             },
//             body: formData
//         });
//         const refreshedTokens = await response.json();
//         if (!response.ok) throw refreshedTokens;
//         return {
//             ...token,
//             accessToken: refreshedTokens.access_token,
//             accessTokenExpired: Date.now() + refreshedTokens.expires_in * 1000,
//             refreshTokenExpired: Date.now() + refreshedTokens.refresh_expires_in * 1000,
//             refreshToken: refreshedTokens.refresh_token ?? token.refreshToken
//         };
//     } catch (error) {
//         console.log('Token expired');
//         return {
//             ...token,
//             error: 'RefreshAccessTokenError'
//         };
//     }
// };
//
// const handler = NextAuth({
//     providers: [
//         Keycloak({
//             clientId: process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID ?? "",
//             clientSecret: process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_SECRET ?? "",
//             authorization: process.env.NEXT_PUBLIC_KEYCLOAK_AUTHORIZATION ?? "",
//             issuer: process.env.NEXT_PUBLIC_KEYCLOAK_ISSUER ?? "",
//         }),
//     ],
//     callbacks: {
//         async jwt({ token, user, account }) {
//             if (account && user) {
//                 // Add access_token, refresh_token and expirations to the token right after signin
//                 token.accessToken = account.access_token;
//                 token.refreshToken = account.refresh_token;
//                 // @ts-ignore
//                 token.accessTokenExpired = account.expires_in * 1000;
//                 // @ts-ignore
//                 token.refreshTokenExpired = Date.now() + account.refresh_expires_in * 1000;
//                 token.user = user;
//                 token.idToken = account.id_token;
//                 return token;
//             }
//
//             // Return previous token if the access token has not expired yet
//             // @ts-ignore
//             if (Date.now() < token.accessTokenExpired) {
//                 return token;
//             }
//
//             // Access token has expired, try to update it
//             return refreshAccessToken(token);
//         },
//         async session({ session, token }) {
//             session.user = token.user;
//             // @ts-ignore
//             session.accessToken = token.accessToken;
//             // @ts-ignore
//             session.error = token.error;
//             // @ts-ignore
//             session.idToken = token.idToken;
//             return session;
//         }
//     }
// })
//
// export {handler as GET, handler as POST}



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
