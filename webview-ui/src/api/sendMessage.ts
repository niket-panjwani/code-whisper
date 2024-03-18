export const sendMessage = async (messageContent: string) => {
  return fetch('http://localhost:3000/api/sendMessage', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ content: messageContent }),
  });
};
