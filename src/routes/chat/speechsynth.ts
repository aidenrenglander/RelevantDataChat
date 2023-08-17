

export function speakResponse(response: string, selectedVoice: string, voiceRate: number){
  const utterance = new SpeechSynthesisUtterance(response);
  utterance.lang = selectedVoice;
  utterance.rate = voiceRate;
speechSynthesis.speak(utterance);
}
