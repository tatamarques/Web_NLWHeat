import { useEffect, useState } from 'react';
import { api } from '../../services/api';
import io from "socket.io-client"

import styles from './styles.module.scss';

import logoImg from '../../assets/logo.svg';

type Message = {
  id: string;
  test: string;
  user: {
    name: string;
    avatar_url: string
  }
}
const messagesQueue: Message[] = [];

const socket = io('http://localhost:4000');
socket.on('new_message', newMessage => {
  messagesQueue.push(newMessage);
});

export function MessageList(){

  const [messages, setMessages] = useState<Message[]>([]);
 
  useEffect(() => {
     setInterval(() => {
      if (messagesQueue.length > 0) {
        setMessages( prevState => [
          messagesQueue[0],
          prevState[0],
          prevState[1],
          
        ].filter(Boolean))

        messagesQueue.shift()
      }
    }, 3000)
  }, []);

  console.log(messages)
  
  useEffect(() => {
    api.get<Message[]>('messages/last3').then(response => {
      setMessages(response.data)
    })
  }, []);


  return(
    <div className={styles.messageListWrapper}>
      <img src={logoImg} alt="DoWhile 2021"/>

      <ul className={styles.messageList}>
        {messages.map(message => {
          return(
            <li key= {message.id ? message.id : "1"} className={styles.message}>
              <p className={styles.messageContent}>{message.test} </p>
              <div className={styles.messageUser}>
                <div className={styles.userImage}>
                  <img src={message.user.avatar_url} alt={message.user.name}/>
                  
                </div> 
                <span> {message.user.name}</span> 
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}