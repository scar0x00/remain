import { API_BASE } from "./env.server";

export async function getDeckById(deckId: string, headers: Headers): Promise<Deck> {
    const response = await fetch(
        `${API_BASE}/api/v1/deck/${deckId}`,
        {
            headers,
            credentials: "include"
        }
    );
    
    if (!response.ok) {
        throw new Error(`Failed to fetch deck: ${response.status} ${response.statusText}`);
    }
    
    const content = await response.json();
    return content;
}