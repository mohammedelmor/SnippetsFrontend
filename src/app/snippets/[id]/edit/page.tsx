'use client';

import {Snippet} from "@/types";
import {Editor} from "@monaco-editor/react";
import {ChangeEventHandler, useEffect, useState} from "react";
import {Button, Select, SelectItem} from "@nextui-org/react";
import * as monaco from 'monaco-editor';
import {Input} from "@nextui-org/input";
import {updateSnippet} from "@/lib/UpdateSnippet";
import {signIn, useSession} from "next-auth/react";
import {useRouter} from "next/navigation";
import {fetchSnippetById} from "@/lib/fetchSnippet";
import {fetchSnippets} from "@/lib/fetchSnippets";

type SnippetViewProps = {
    snippet: Snippet;
}

export default function SnippetEdit(props: any) {
    const router = useRouter();
    const {data: session, status} = useSession();
    const [snippet, setSnippet] = useState<Snippet>({
        id: 0,
        title: '',
        code: '',
        language: '',
        createdDate: Date.now(),
        modifiedDate: Date.now(),
        createdBy: null,
        modifiedBy: null
    });
    const [isLoading, setIsLoading] = useState<boolean>(true);
    useEffect(() => {
        if (session) {
            // @ts-ignore
            if (session?.error === "RefreshAccessTokenError") {
                signIn(); // Force sign in to hopefully resolve error
            }
        }
    }, [session]);
    useEffect(() => {
        if (session) {
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


    const onComplete = async () => {
        if (session) {
            try {
                const dto = {
                    title: snippet.title,
                    language: snippet.language,
                    code: snippet.code
                }
                // @ts-ignore
                await updateSnippet(session.accessToken, snippet.id, dto);
                router.push(`/snippets/${snippet.id}`)
            } catch (err) {
                console.error(err);
            }
        }
    }

    const onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const key = event.target.name;
        const value = event.target.value;
        setSnippet((prev) => ({...prev, [key]: value}));
    }

    const onSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const key = event.target.name;
        const value = event.target.value;
        setSnippet((prev) => ({...prev, [key]: value}));
    }

    const onEditorChange = (value: string | undefined) => {
        setSnippet((prev) => ({...prev, code: value || ""}));
    }

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (!snippet) {
        return <div>Snippet not found</div>;
    }

    return (
        <div className="container mx-auto p-4">
            <div className="flex flex-col bg-gray-800 text-white rounded-lg shadow-md p-4">
                <div className="flex justify-between mb-4">
                    <Input
                        className="flex-grow mr-2"
                        type="text"
                        label="Title"
                        name="title"
                        value={snippet?.title || ""}
                        onChange={onInputChange}/>
                    <Button
                        size="lg"
                        color="success"
                        onPress={onComplete}>
                        Update!
                    </Button>
                </div>
                <div className="flex-grow bg-white text-black rounded-lg p-4">
                    <Select
                        color="primary"
                        label="Select a language"
                        placeholder="Select a language"
                        selectedKeys={[snippet.language]}
                        className="max-w-xs mb-4"
                        name="language"
                        onChange={onSelectChange}
                    >
                        {monaco.languages.getLanguages().map((language) => (
                            <SelectItem key={language.id} value={language.id}>
                                {language.id}
                            </SelectItem>
                        ))}
                    </Select>
                    <Editor
                        theme="vs-dark"
                        height="25vh"
                        defaultLanguage={snippet.language}
                        language={snippet.language}
                        defaultValue={snippet.code}
                        options={{minimap: {enabled: false}}}
                        onChange={onEditorChange}
                    />
                </div>
            </div>
        </div>
    )
}