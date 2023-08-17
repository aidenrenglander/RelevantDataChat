import { Configuration, OpenAIApi, ChatCompletionRequestMessageRoleEnum } from "openai";
import { PUBLIC_OPENAI_API_KEY } from '$env/static/public'


export async function openAIChatComplete(chatMessages: { text: string; isUser: boolean; user: string; }[], context: string): Promise<string>{  
  const messages = chatMessages.map((message) => {
    const role: ChatCompletionRequestMessageRoleEnum = message.isUser ? 'user' : 'assistant';
    return {
      role: role,
      content: message.text
    };
  });


  try{
    const configuration = new Configuration({
      apiKey: PUBLIC_OPENAI_API_KEY,
    });

    const openai = new OpenAIApi(configuration);

    const completion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [ {role:  'system', content: `You are a teacher answering questions to a sophisticated student`}, ...messages],
    });


    //make sure completion.data.choices[0].message.content is not undefined    
    if(
      completion.data &&
      completion.data.choices &&
      completion.data.choices.length > 0 &&
      completion.data.choices[0].message &&
      completion.data.choices[0].message.content){

        const gptResponse = completion.data.choices[0].message.content;

        return gptResponse;


    } else {
      throw new Error('Unable to retrieve chat response');
    }


  } catch(error){
    console.error('Error generating chat response:', error);
    return 'An error occured while generating the chat response.';
  }

}


