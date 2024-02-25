export async function fetchSnippets(accessToken : string) {
    console.log(accessToken)
    try {
        const res = await fetch('http://localhost:9001/api/snippets/all?page=1&size=10', {
            headers: {
                'accept': 'application/hal+json',
                'Authorization': `Bearer ${accessToken}`
            }
        });
        if (!res.ok) {
            throw new Error(`Failed to fetch snippets: ${res.status} ${res.statusText}`);
        }
        const data = await res.json();
        return data.content;
    } catch (error) {
        console.error('Failed to fetch [id]:', error);
        throw error;
    }
}