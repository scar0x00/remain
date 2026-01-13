# Remain

This app works mainly as a flashcard generator and allows the user to start study sessions from the generated flashcards.

The app generates flashcards decks using LLMs (mainly Gemini 3 Flash and Pro, Grok 4.1 Fast, GLM 4.7 and Kimi K2) but also allows the user to edit the flashcards in places before saving the decks. Later on the user can also modify its decks. It also uses Voxtral, Mistral OCR and Deepseek OCR.

The app also keeps track of how many right and wrong ansers the user has gotten, so it can track performance and evaluate how good the user has learned a topic and if it can recall the content that they are meant to memorize.

Flashcards decks are basically YAML files that can be stored in Github or in the default storage backend: Cloudflare R2.

PDF files, website URL and plain HTML/MD files can be uploaded to the chat so the agents can extract information and knowledge from them.

Theres also an **experimental** mode that allows the user to type in the answer to the questions so an LLM can evaluate if the answer is right or wrong by comparing the user answer with the stored answer on the deck.

The app uses:

- React Router
- Jotai
- Shadcn and Tailwindcss for UI
- Langchain for the agents
- R2 for persistent storage
- better-auth for authentication