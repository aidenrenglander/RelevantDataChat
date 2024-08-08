<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  //writable is used to create a reactive store that holds chat state
  import {writable} from 'svelte/store';
  import { openAIChatComplete } from './gpt';
  import { speakResponse } from './speechsynth';

   
  let chatwindow: HTMLDivElement;


  //a writable array called chat
  const chat = writable([
    {
      text: 'Hello there. How can I help you today?', 
      isUser: false, 
      user: 'Bot'
    },
  ]);


  //function that adds message to chat state
  function addMessage(text='', isUser = true, user = ''){
    chat.update(messages => [...messages, {text, isUser, user}]);
    if(isUser==false){
      speakResponse(text, selectedVoice, voiceRate);
    }
    chatwindow.scrollTop = chatwindow.scrollHeight; 
  }

  let userInput: string = "";
  let loadDataInput: string = "";
  let dataName: string = "";

  //handling user input
  async function handleUserInput(event: KeyboardEvent){
    if(event.key === 'Enter'){
      conditionsForMessage();
    }
  }

  async function conditionsForMessage(){
    if (loadDataInput !== ''){
        const inputArray = loadDataInput.split(" ");
        const fTW = inputArray.slice(0, 3).join(" ");
        console.log(fTW);
      if(fTW.toLowerCase()=='load data on'){
        dataName = inputArray.slice(3, inputArray.length).join(" ");
        const dataLoadingRes = "Hang tight while we load data on " + dataName + "... It'll take a moment..."
        addMessage(dataLoadingRes, false);
        const chainBotDataResponse = await changeLoadTyping();
        console.log(chainBotDataResponse);
        addMessage(chainBotDataResponse, false);
        userInput = "";
      }
      else{
        addMessage(userInput, true);
        //this has the bot then send a message back
        processUserMessage(userInput);
        userInput = "";
      }
      loadDataInput="";
    }
    if(userInput!==''){
      addMessage(userInput, true);
      addMessage("Your query is processing. Hang in there while we gather the relevant data for the response.", false);
      const chainBotQueryResponse = await queryTyping();
      addMessage(chainBotQueryResponse, false);
      userInput="";
    }
  }


  let context: string;
   //process user message and then get response
  async function processUserMessage(input=''){
    console.log(`User response is: ${input}`)
    const botResponse = await openAIChatComplete($chat, context);
    addMessage(botResponse, false);
  }


//language options code
 /**
	 * @type {any[]}
	 */
  let voices: any[] = [];
  let selectedVoice: string = 'en-US';
  let voiceRate: number = 1.0;


  function populateVoiceList() {
    if (typeof speechSynthesis === 'undefined') {
      return;
    }

    voices = speechSynthesis.getVoices();
  }

  onMount(() => {
    populateVoiceList();
    if (typeof speechSynthesis !== 'undefined' && speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = populateVoiceList;
    }
  });

  //speech recognition code
  let recognition: SpeechRecognition;
  let recognizedText = '';
  let buttonText = 'Press and Hold to Speak';
  let isDataLoaded: boolean = false;


  onMount(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      recognizedText = event.results[0][0].transcript;
    };

    recognition.onend = () => {
      const textArray = recognizedText.split(" ");
      console.log(recognizedText);
      const firstThreeWords = textArray.slice(0, 3).join(" ");
      if(firstThreeWords.toLowerCase()=='load data on'){
        loadDataInput=recognizedText;
        conditionsForMessage();
        isDataLoaded = !isDataLoaded;
      }
      else if(isDataLoaded){
        userInput=recognizedText;
        conditionsForMessage();
      }
      else{
        addMessage(recognizedText);
        processUserMessage(recognizedText);
      }
    }
  });
  
  function startListening(){
    recognizedText='';
    buttonText = 'Listening...'
    recognition.start();
  }

  function stopListening(){
    buttonText = 'Press and Hold to Speak'
    recognition.stop();
  }
  

  const changeLoadTyping = async() => {
    const url = '../api';
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json'
      },
      method: "POST",
      body: JSON.stringify({loadDataInput, dataName}),
    })
      .then((res)=>res.json()).then((res)=>res?.result);

      console.log(response);

    return response;
  }

  const queryTyping = async() => {
    const url = '../api';
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json'
      },
      method: "POST",
      body: JSON.stringify({userInput}),
    })
      .then((res)=>res.json()).then((res)=>res?.result);

      console.log(response);

    // return response.output_text;
    return response
  }


</script>   

<style>
  .chat-window{
    height: 300px;
    overflow-y: auto;
    border: 1px solid white;
    padding-bottom: 25px;
    padding-top: 10px;
    padding-left: 10px;
  }
  .input{
    color: white;
  }
  .sender{
    color: rgb(236, 72, 153)
  }
  button{
    border-width: 2px;
    border-radius: 1.5rem;
    background-color: #60a5f9;
    font-size: 15px;
  }
  button:hover{
    background-color: #ec4899;
  }
</style>


<main>
  <div class="py-5">
    <p>Please Select Voice/Language:</p>
    <select bind:value={selectedVoice} id="voiceSelect" class="rounded-3xl bg-blue-400">
      {#each voices as voice}
        <option value="{voice.lang}" data-lang="{voice.lang}" data-name="{voice.name}">
          {voice.name} ({voice.lang})
          {#if voice.default} — DEFAULT{/if}
        </option>
      {/each}
    </select>
  </div>

  <div class="pb-5">
    <p>Please Select Voice Speed: 
      {voiceRate}
    </p>
    <input bind:value={voiceRate} type="range" min="0.5" max="2.0" step="0.01" id="rate" class="appearance-none rounded-3xl w-3/12 h-4 bg-pink-500">
  </div>

  <div bind:this = {chatwindow} class="chat-window rounded-3xl">
    {#each $chat as message}
      <div class="message {message.isUser ? 'User' : 'Bot'}">
        {#if message.isUser}
          <span class="sender">You:</span>
          {message.text}
        {:else}
          <span class="sender">Bot:</span>
          {message.text}
        {/if}
      </div>
    {/each}
  </div>
</main>

<div class="flex justify-between">
  
  <div class="flex-1">
    <input class = "input" type = "text" placeholder="Type here to load context. Type 'Load data on ____' (e.g. 'Load data on Orcam')" on:keyup={handleUserInput} bind:value={loadDataInput}/>
    <input class = "input" type = "text" placeholder="Type your questions here..." on:keyup={handleUserInput} bind:value={userInput}/>
  </div>
  
  <button
  on:mousedown="{startListening}"
  on:mouseup="{stopListening}"
  >
  {buttonText}
  </button>

</div>





