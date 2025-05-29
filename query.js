import { createInterface } from "node:readline/promises"; // import readline for user input

import OpenAI from "openai"; // import the openai library
import { Pinecone } from "@pinecone-database/pinecone"; // import the pinecone library

import "dotenv/config"; // import dotenv to load environment variables

// check if the required environment variables are set
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
if (!OPENAI_API_KEY) {
  throw new Error("missing open ai api key");
}

// check if the required environment variables are set
const PINECONE_API_KEY = process.env.PINECONE_API_KEY;
if (!PINECONE_API_KEY) {
  throw new Error("missing pinecone api key");
}
// set openai key
const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

// set pinecone key
const pc = new Pinecone({
  apiKey: PINECONE_API_KEY,
});

// set the readline interface for user input
const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
});

// function to ask a question and get an answer
const query = await rl.question("your question: ");

// close the readline interface
rl.close();

// function to query the pinecone index and get the relevant documents
const index = pc.index("demo");
// create a namespace for the rag index
const db = index.namespace("rag");

// create an embedding for the user's query
const queryEmbedding = await openai.embeddings.create({
  model: "text-embedding-3-small",
  input: query,
  dimensions: 512,
});

// assign the embedding to a variable
const queryVector = queryEmbedding.data[0].embedding;

// query the pinecone index with the embedding to get relevant documents
const response = await db.namespace("rag").query({
  vector: queryVector,
  topK: 5,
  includeMetadata: true,
});

// map the response to get the metadata of the matches
const aiData = response.matches.map((match) => match.metadata);

// response to the user's query using the open ai with the retrieved data
const aiResponse = await openai.responses.create({
  model: "gpt-4o-mini",
  input: `the user's query / question was:\n${query}\n\nthe following data was retrieved related to this query:\n${JSON.stringify(
    aiData
  )}\n\nplease provide a detailed response to the user's query based on the retrieved data.`,
});

// log the output text from the ai response
console.log(aiResponse.output_text);
