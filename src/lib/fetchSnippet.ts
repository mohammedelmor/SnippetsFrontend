export async function fetchSnippetById(accessToken : string, id : number) {
    try {
        const res = await fetch(`http://localhost:9001/api/snippets/${id}`, {
            headers: {
                'accept': 'application/hal+json',
                'Authorization': `Bearer ${accessToken}`
            }
        });
        if (!res.ok) {
            throw new Error(`Failed to fetch snippets: ${res.status} ${res.statusText}`);
        }
        const data = await res.json();
        return data;
    } catch (error) {
        console.error('Failed to fetch [id]:', error);
        throw error;
    }
}