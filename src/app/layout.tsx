import type {Metadata} from "next";
import {Inter} from "next/font/google";
import "./globals.css";
import SessionProvider from "@/components/SessionProvider";
import {getServerSession} from "next-auth";
import {Providers} from "./providers";
import Navbar from '@/components/navbar';
import RequiredLogin from "@/components/required-login";
const inter = Inter({subsets: ["latin"]});

export const metadata: Metadata = {
    title: "Create Next App",
    description: "Generated by create next app",
};

export default async function RootLayout({children}: Readonly<{
    children: React.ReactNode;
}>) {
    const session = await getServerSession();
    // const { data: userSession } = useSession()
    return (
        <html lang="en">
        <body className={inter.className}>
        <SessionProvider session={session}>
            <Providers>
                {session && <Navbar />}
                {session && children}
                {!session && <RequiredLogin />}
            </Providers>
        </SessionProvider>
        </body>
        </html>
    );
}
