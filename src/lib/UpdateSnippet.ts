import {SnippetFormProps} from "@/types";

export async function updateSnippet(accessToken : string, id : number, dto : SnippetFormProps) {
    try {
        const res = await fetch(`http://localhost:9001/api/snippets/${id}`, {
            method: 'PUT',
            headers: {
                'accept': 'application/hal+json',
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dto)
        });
        if (!res.ok) {
            throw new Error(`Failed to update snippets: ${res.status} ${res.statusText}`);
        }
        const data = await res.json();
        return data;
    } catch (error) {
        console.error('Failed to update [id]:', error);
        throw error;
    }
}