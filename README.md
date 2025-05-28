# retrieval-augmented generation (rag)

this simple demo project shows how rag workflows work in a nutshell.

a minimal rag workflow that lets a generative ai model answer with up-to-date, domain-specific info by retrieving and feeding relevant text chunks at query time.

the user query is turned into vector embeddings. then, those embeddings are used to fetch semantically relevant data from the vector database (pinecone). the retrieved data is injected (behind the scenes) into the user prompt. an ai model (e.g., gpt 4o) is used to generate a response based on the user's query + fetched data.

# overview

- combines a vector database + embeddings with a text-generation model
- keeps answers accurate, verifiable, and in sync with your data

# running this demo

to run this demo project, you need a recent version of [node.js](nodejs.org) installed on your system. you also need an [openAI account](https://platform.openai.com/) (for access to their apis) and a [https://www.pinecone.io/](pinecone-account) .

you need to generate api keys for both apenai and pinecone.

next, rename the `.env.example` file to `.env` and add your api keys into that file.

run:

```
npm install
```

---
