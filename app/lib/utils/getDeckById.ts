const API_BASE = process.env.API_BASE_URL || '';

export async function getDeckById(deckId: string): Promise<Deck> {
    const response = await fetch(`${API_BASE}/api/v1/deck/${deckId}`);
    
    if (!response.ok) {
        throw new Error(`Failed to fetch deck: ${response.status} ${response.statusText}`);
    }
    
    const content = await response.json();
    return content;
}