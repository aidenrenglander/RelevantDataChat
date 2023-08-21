# Relevant Data Chat

## Table of Contents

- [Relevant Data Chat](#relevant-data-chat)
  - [Table of Contents](#table-of-contents)
  - [Description](#description)
  - [Dependencies](#dependencies)
  - [Features](#features)
  - [Installation](#installation)
  - [Usage](#usage)
  - [Creating a .env File](#creating-a-env-file)
  - [Speech Feature](#speech-feature)
  - [APIs Used](#apis-used)

## Description

Relevant Data Chat (RDC) is a Chatbot that leverages current and new information/data using search APIs and the LLM API to provide accurate and up-to-date answers to user queries. Unlike traditional LLMs like ChatGPT, which are trained on static datasets, RDC utilizes the LangChain Library to dynamically gather information and overcome the limitations of static data.

## Dependencies

The project uses the following dependencies:

- `@huggingface/hub: ^0.8.3`
- `@huggingface/inference: ^1.8.0`
- `@pinecone-database/pinecone: ^0.1.6`
- `@types/webspeechapi: ^0.0.29`
- `axios: ^1.4.0`
- `dotenv: ^16.3.1`
- `langchain: ^0.0.102`
- `openai: ^3.3.0`
- `serpapi: ^2.0.0`
- `svelte-speech-recognition: ^0.0.7`

## Features

- Press "Login" or Chat in the sidebar to open the chatbot.
- Type "Load Data ____" in the top input line and press "Enter" to upload data on a topic of interest.
- Once you receive confirmation that your data is uploaded, you can ask any question in the bottom input line and press "Enter" to ask the question.

## Installation

To get started with Relevant Data Chat, follow these steps:

1. **Clone the repository:**

   ```bash
   git clone https://github.com/aidenrenglander/RelevantDataChat.git
   cd RelevantDataChat
  
2. **Install dependencies:**
   
   ```bash
   npm install
   
## Usage

- Open the project in your code editor.
- Start the development server:
  ```bash
  npm run dev
- Access the chatbot by pressing "Login" or "Chat" in the sidebar.
- To upload data, type "Load Data ____" in the top input line and press "Enter."
- Ask questions in the bottom input line and press "Enter" to get answers.

## Creating a .env File

Before using the APIs mentioned in this project, it's important to create a `.env` file to securely store your API Keys. Here's how to do it:

1. In the root directory of your project, create a file named `.env` if it doesn't already exist.

2. Inside the `.env` file, add your API Keys using the following format:

   ```javascript
   PUBLIC_API_KEY = "API key here"


## Speech Feature

The chatbot includes a speech feature:

- Hold down the speech button to speak the "Load data" request as well as the query.
- Choose the voice and speed of the chatbot's speech.

## APIs Used

Relevant Data Chat utilizes the following APIs:

- Langchain for vector store and similarity search and LLM Chain
- Huggingface Inference API for embeddings/vectorization
- OpenAI for LLM
- MDN Webspeech API for text-to-speech and language recognition










   



