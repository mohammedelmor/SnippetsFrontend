import {SnippetFormProps} from "@/types";

export async function addSnippet(accessToken : string, dto : SnippetFormProps) {
    try {
        const res = await fetch(`http://localhost:9001/api/snippets`, {
            method: 'POST',
            headers: {
                'accept': 'application/hal+json',
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dto)
        });
        if (!res.ok) {
            throw new Error(`Failed to adding new snippet: ${res.status} ${res.statusText}`);
        }
        const data = await res.json();
        return data;
    } catch (error) {
        console.error('Failed to add :', error);
        throw error;
    }
}