export const sendMessage = async (messageContent: string, user_id: string) => {
  return fetch('https://code-whisper-api-949cfdbef458.herokuapp.com/api/sendMessage', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ content: messageContent, user_id: user_id}),
  });
};
