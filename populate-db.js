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

// insert the data into the pinecone database
async function insertDev(country) {
  const index = pc.Index("demo");
  const db = index.namespace("rag");
  const description = `country name: ${country.name}, developer: ${country.developer}`;
  const result = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: description,
    dimensions: 512,
  });
  const embeddingVector = result.data[0].embedding;
  const vectorId = `vec-${country.id}`;

  await db.upsert([
    {
      id: vectorId,
      values: embeddingVector,
      metadata: country,
    },
  ]);
}

async function populateDB() {
  const countries = [
    { id: 1, name: "germany", developer: "83 million" },
    { id: 2, name: "france", developer: "67 million" },
    { id: 3, name: "united kingdom", developer: "67 million" },
    { id: 4, name: "italy", developer: "60 million" },
    { id: 5, name: "spain", developer: "47 million" },
    { id: 6, name: "poland", developer: "38 million" },
    { id: 7, name: "romania", developer: "19 million" },
    { id: 8, name: "netherlands", developer: "17 million" },
    { id: 9, name: "belgium", developer: "11.5 million" },
    { id: 10, name: "greece", developer: "10.7 million" },
    { id: 11, name: "portugal", developer: "10.3 million" },
    { id: 12, name: "sweden", developer: "10.4 million" },
    { id: 13, name: "hungary", developer: "9.7 million" },
    { id: 14, name: "austria", developer: "9 million" },
    { id: 15, name: "switzerland", developer: "8.7 million" },
    { id: 16, name: "bulgaria", developer: "7 million" },
    { id: 17, name: "serbia", developer: "6.7 million" },
    { id: 18, name: "denmark", developer: "5.8 million" },
    { id: 19, name: "finland", developer: "5.5 million" },
    { id: 20, name: "slovakia", developer: "5 million" },
  ];

  for (const country of countries) {
    console.log(
      `inserting country ${country.id}: ${country.name} into pinecone...`
    );
    await insertDev(country);
  }
}

populateDB();
