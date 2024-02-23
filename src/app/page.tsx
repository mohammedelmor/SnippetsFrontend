'use client'
import {useSession, signIn, signOut} from "next-auth/react"
import Navbar from "@/components/navbar";
export default function Home() {
    const {data: session} = useSession()
    if (session) {
        return (
            <>
                Signed in as {session?.user?.name} <br/>
                <button onClick={() => signOut()}>Sign out</button>
            </>
        )
    }
    return (
        <>
            Not signed in <br/>
            <button onClick={() => signIn()}>Sign in</button>
        </>
    )
}
