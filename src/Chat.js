import React, { useEffect, useState } from "react";
import ScrollToBottom from "react-scroll-to-bottom";

function Chat({ socket, username, room }) {
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);

  const sendMessage = async () => {
    if (currentMessage !== "") {
      const messageData = {
        type: "message",
        room: room,
        author: username,
        message: currentMessage,
        time:
          new Date(Date.now()).getHours() +
          ":" +
          new Date(Date.now()).getMinutes(),
      };

      await socket.emit("send_message", messageData);
     
      setMessageList((list) => [...list, messageData]);
      setCurrentMessage("");
    }
  };
  const joinData = () => {
    return socket.emit("send_message",
      {
        type: "join_message",
        room: room,
        author: username,
        message: `${username} has joined the room`,
        time:
          new Date(Date.now()).getHours() +
          ":" +
          new Date(Date.now()).getMinutes(),
      }
    );
  }

  // const quitRoom = () => {
    
  //   return socket.emit("send_message", 
  //     {
  //       type: "quit_message",
  //       room: room,
  //       author: username,
  //       message: `${username} quit the room`,
  //       time:
  //         new Date(Date.now()).getHours() +
  //         ":" +
  //         new Date(Date.now()).getMinutes(),
  //     }
  //   )

  // }

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessageList((list) => [...list, data ]);
    });
    joinData();
    
  }, [socket]);
  
  return (
    <div className="chat-window">
      <div className="chat-header">
        <p>Live Chat</p>
      </div>
      <div className="room">
        <p>Chat Room: {room}</p>
        
      </div>
      <div className="room">
        <p>Your name: {username}</p>
      </div>
      <div className="chat-body">

        <ScrollToBottom className="message-container">
          {messageList.map((messageContent) => {
            return (
             <>
             { 
              // xử lý send message
              messageContent.type === "join_message" ?
                <div
                  className="join-message"
                  id={username === messageContent.author ? "you" : "other"}
                >
                  <div>
                    <div className="join-message-content">
                      <p>{messageContent.message}</p>
                    </div>
                   
                  </div>
                </div> 
                :
                // xử lý join_room
                <div
                  className="message"
                  id={username === messageContent.author ? "you" : "other"}
                >
                  <div>
                    <div className="message-content">
                      <p>{messageContent.message}</p>
                    </div>
                    <div className="message-meta">
                      <p id="time">{messageContent.time}</p>
                      <p id="author">{messageContent.author}</p>
                    </div>
                  </div>
                </div> 
                }
             </>
            );
          })}
        </ScrollToBottom>
      </div>
      <div className="chat-footer">
        <input
          type="text"
          value={currentMessage}
          placeholder="Hey..."
          onChange={(event) => {
            setCurrentMessage(event.target.value);
          }}
          onKeyPress={(event) => {
            event.key === "Enter" && sendMessage();
          }}
        />
        <button onClick={sendMessage}>&#9658;</button>
      </div>
    </div>
  );
}

export default Chat;
