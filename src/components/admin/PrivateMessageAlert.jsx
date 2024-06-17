// src/components/PrivateMessageAlert.js
import React, { useEffect } from 'react';

const PrivateMessageAlert = () => {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Ensure this code runs only in the browser environment
      import('sockjs-client').then((SockJS) => {
        import('stompjs').then((Stomp) => {
          const socket = new SockJS.default('/ws');
          const stompClient = Stomp.default.over(socket);
          stompClient.connect({}, (frame) => {
            console.log('Connected: ' + frame);
            stompClient.subscribe('/user/specific', (result) => {
              const message = JSON.parse(result.body);
              alert(`Admin received private message: ${message.text}`);
            });
          });

          return () => {
            stompClient.disconnect();
          };
        });
      });
    }
  }, []);

  return null;
};

export default PrivateMessageAlert;
