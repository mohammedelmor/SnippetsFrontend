'use client';
import {useSession, signIn} from "next-auth/react";
import {Snippet} from "@/types";
import {useEffect, useState} from "react";
import {fetchSnippetById} from "@/lib/fetchSnippet";
import {Editor} from "@monaco-editor/react";
import withAuth from "@/lib/withAuth";
import {redirect} from "next/navigation";

const SnippetPage = (props: any) => {
    const {data: session, status} = useSession();
    const [snippet, setSnippet] = useState<Snippet | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    useEffect(() => {
        if (session) {
            console.log(props.params.id)
            // @ts-ignore
            fetchSnippetById(session.accessToken, props.params.id)
                .then(data => {
                    console.log(data)
                    setSnippet(data);
                    setIsLoading(false);
                })
                .catch(err => {
                    console.error(err);
                    setIsLoading(false);
                });
        }
    }, [session]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (!snippet) {
        console.log(status)
        console.log(session);
        return <div>Snippet not found</div>;
    }

    return (
        <div className="container mx-auto">
            <div className="flex flex-col h-screen bg-gray-800 text-white">
                <div className="p-4 bg-gray-900 text-white rounded-lg shadow-md">
                    <h1 className="text-2xl font-bold mb-4 text-center">{snippet.title}</h1>
                </div>
                <div className="flex-grow bg-white text-black rounded-lg p-4">
                    <Editor
                        theme="vs-dark"
                        height="25vh"
                        defaultLanguage={snippet.language}
                        defaultValue={snippet.code}
                        options={{minimap: {enabled: false}}}
                    />
                </div>
            </div>
        </div>
    );
};


export default withAuth(SnippetPage);