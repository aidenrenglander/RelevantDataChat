# Relevant Data Chat

## Table of Contents

- [Relevant Data Chat](#relevant-data-chat)
  - [Table of Contents](#table-of-contents)
  - [Description](#description)
  - [Dependencies](#dependencies)
  - [Features](#features)
  - [Installation](#installation)
  - [Usage](#usage)
  - [Speech Feature](#speech-feature)
  - [APIs Used](#apis-used)
  - [Contributing](#contributing)
  - [License](#license)
  - [Acknowledgments](#acknowledgments)

## Description

Relevant Data Chat (RDC) is a Chatbot that leverages current and new information/data using search APIs and the LLM API to provide accurate and up-to-date answers to user queries. Unlike traditional LLMs like ChatGPT, which are trained on static datasets, RDC utilizes the LangChain Library to dynamically gather information and overcome the limitations of static data.

## Dependencies

The project uses the following dependencies:

- `@huggingface/hub: ^0.8.3`
- `@huggingface/inference: ^1.8.0`
- `@pinecone-database/pinecone: ^0.1.6`
- `@types/webspeechapi: ^0.0.29`
- `axios: ^1.4.0`
- `cheerio: ^1.0.0-rc.12`
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



   



