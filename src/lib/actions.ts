'use server'
import {router} from "next/client";
import {addSnippet} from "@/lib/AddSnippet";
import {SnippetFormProps} from "@/types";
import {redirect} from "next/navigation";

export async function createSnippet(code: string, accessToken: string, formData: FormData) {

    const data: SnippetFormProps = {
        title: formData.get('title') as string,
        language: formData.get('language') as string,
        code: code as string
    }

    await addSnippet(accessToken, data)
    redirect("/")
}