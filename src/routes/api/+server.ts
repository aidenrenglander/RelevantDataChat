import { json } from '@sveltejs/kit';
import { PUBLIC_OPENAI_API_KEY } from '$env/static/public';
import { PUBLIC_SERPAPI_API_KEY } from '$env/static/public'; 
import { PUBLIC_HF_API_KEY } from '$env/static/public';
import type { RequestEvent } from '@sveltejs/kit';
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { Configuration, OpenAIApi } from "openai";
import { getJson } from "serpapi";
import { HuggingFaceInferenceEmbeddings } from "langchain/embeddings/hf";
import { load } from 'cheerio';
import axios from 'axios';

const contentDocuments: any[] = [];

export const POST = async (event: RequestEvent) => {

  console.log("We got here.");

  const requestBody = await event.request.json();
  const { loadDataInput, userInput, dataName } = requestBody;

  console.log("PUBLIC_OPENAI_API_KEY:", PUBLIC_OPENAI_API_KEY);
  console.log("PUBLIC_SERPAPI_API_KEY:", PUBLIC_SERPAPI_API_KEY);
  console.log("PUBLIC_HF_API_KEY:", PUBLIC_HF_API_KEY);
 
  if(loadDataInput && loadDataInput.trim() !== ""){
    
  
    const configuration = new Configuration({
      apiKey: PUBLIC_OPENAI_API_KEY,
    });

    const openai = new OpenAIApi(configuration);

    const completion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [ 
        {role: 'system', content: 'You will take the words after "Load data on" and respond "Latest information about those words".'},
        {role: 'user', content: 'Load data on Langchain'},
        {role: 'assistant', content: 'Latest information about Langchain'},
        {role: 'user', content: 'Load data on Lebron James'},
        {role: 'assistant', content: 'Latest information about Lebron James'},
        {role: 'user', content: loadDataInput},
      ],
    });

    const gptQuery = completion.data.choices[0].message?.content;

    console.log(gptQuery);

    const response = await getJson("google", {
      api_key: PUBLIC_SERPAPI_API_KEY,
      q: gptQuery,
      location: "New York, New York",
    });

    //gets link of first organic result
    //maybe incorporate a for loop to embed the first few results

    let combinedWebpageResults = "";
    for(let i=0; i<5; i++){
      const url = response.organic_results[i].link;

      const webpageDataResponse = await axios.get(url);
      const webpageHtml = await webpageDataResponse.data;

      const $ = load(webpageHtml);
      const webpageText = $('p').text();

      combinedWebpageResults+=webpageText+"\n";
    }


    const textSplitter = new RecursiveCharacterTextSplitter({ chunkSize: 500 });
    const docs = await textSplitter.createDocuments([combinedWebpageResults]);
    
    //store content documents for future use...
    contentDocuments.length = 0; //empty the array from the previous docs
    contentDocuments.push(...docs);
    console.log("Documents Pushed");
  }
  
  if(userInput && userInput.trim()!==""){
    console.log("Got here because there's a user input");
    console.log("userInput: ", userInput);
    console.log("docs: ", contentDocuments);
    const store = await MemoryVectorStore.fromDocuments(contentDocuments, new HuggingFaceInferenceEmbeddings({apiKey: PUBLIC_HF_API_KEY }));

    const relevantDocs = await store.similaritySearch(userInput);
    console.log(relevantDocs);
    console.log("WE GOT HERE TOO.")
    console.log(userInput);

    const combinedDocuments = relevantDocs.map(doc => doc.pageContent).join("\n\n");

    // Create the prompt
    const prompt = `Based on the following data, answer the question:\n\n${combinedDocuments}\n\nQuestion: ${userInput}`;

    const configuration = new Configuration({
      apiKey: PUBLIC_OPENAI_API_KEY,
    });
    const openai = new OpenAIApi(configuration);

    const completion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [ 
        {role: 'system', content: prompt}
      ],
    });
    console.log("Response from OpenAI:", completion.data.choices[0].message?.content);


   
    return json({ result: completion.data.choices[0].message?.content});
  } else{
    return json({ result: "Data on " + dataName + " has been loaded. Ask anything you'd like about " + dataName + "!"})
  }
};

