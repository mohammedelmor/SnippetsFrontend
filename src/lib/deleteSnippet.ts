export async function deleteSnippetById(accessToken : string, id : number) {
    try {
        const res = await fetch(`http://localhost:9001/api/snippets/${id}`, {
            method: 'DELETE',
            headers: {
                'accept': 'application/hal+json',
                'Authorization': `Bearer ${accessToken}`
            }
        });
        if (!res.ok) {
            throw new Error(`Failed to delete snippets: ${res.status} ${res.statusText}`);
        }
        return res.ok;
    } catch (error) {
        console.error('Failed to delete:', error);
        throw error;
    }
}