'use client';
import {Input} from "@nextui-org/input";
import {Button, Select, SelectItem} from "@nextui-org/react";
import React, {useState} from "react";
import {Editor} from "@monaco-editor/react";
import * as monaco from 'monaco-editor';
import {addSnippet} from "@/lib/AddSnippet";
import {createSnippet} from "@/lib/actions";
import {useSession} from "next-auth/react";

export default function AddSnippet() {
    const [code, setCode] = useState("")
    const [language, setLanguage] = useState("javascript")
    const [title, setTitle] = useState("")
    const {data: session} = useSession();
    // @ts-ignore
    const createSnippetAction = createSnippet.bind(null, code, session.accessToken)

    const onTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(e.target.value)
    }

    const onSelectedLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setLanguage(e.target.value)
    }

    const onCodeChange = (value: string | undefined) => {
        setCode(value || "")
    }

    // @ts-ignore
    return (
        <div className="container mx-auto p-4">
            <div className="flex flex-col bg-gray-800 text-white rounded-lg shadow-md p-4">
                <form action={createSnippetAction}>
                    <div className="flex justify-between mb-4">
                        <Input
                            className="flex-grow mr-2"
                            type="text"
                            label="Title"
                            value={title}
                            name="title"
                            onChange={onTitleChange}
                            required
                        />
                    </div>
                    <div className="flex-grow bg-white text-black rounded-lg p-4">
                        <Select
                            color="primary"
                            label="Select a language"
                            placeholder="Select a language"
                            selectedKeys={[language]}
                            className="max-w-xs mb-4"
                            name="language"
                            required
                            onChange={onSelectedLanguageChange}
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
                            language={language}
                            value={code}
                            options={{
                                minimap: {enabled: false},
                                readOnly: false,
                                domReadOnly: false
                            }}
                            onChange={onCodeChange}
                        />
                        <div className="flex">
                            <Button
                                className="flex-grow"
                                size="lg"
                                color="success"
                                type="submit">
                                Add!
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}