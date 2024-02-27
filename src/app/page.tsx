'use client'
import {useSession, signIn, signOut} from "next-auth/react"
import SnippetList from "@/components/SnippetList";
import {useEffect, useState} from "react";
import {fetchSnippets} from "@/lib/fetchSnippets";
export default function Home() {
    const { data: session } = useSession();
    const [snippets, setSnippets] = useState([]);

    useEffect(() => {
        if (session) {
            // @ts-ignore
            if (session?.error === "RefreshAccessTokenError") {
                signIn(); // Force sign in to hopefully resolve error
            }
            // @ts-ignore
            fetchSnippets(session.accessToken)
                .then(data => setSnippets(data))
                .catch(err => console.error(err));
        }
    }, [session]);

    return <SnippetList snippets={snippets} />;
}
