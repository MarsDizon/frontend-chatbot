import React, { useState, useEffect } from "react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import ProfileIcon from "../assets/ProfileIcon.png";
import SpeciaLogo from "../assets/SpeciaLogo.png";
import ErrorIcon from "../assets/ErrorIcon.png";
import ChatBox from "./ChatBox";
import axios from "axios";

// Import Bootstrap related components
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { Spinner } from "react-bootstrap";

const ChatBot = () => {
  const [messages, setMessages] = useState([]);
  /*
  const commands =[
    {
      command: 'Stop recording*',

      callback: ()=>{setMessages((messages) =>[
        ...messages,
        {user: "user", message: transcript},
        {user: "SpecIA", message: "Okay, stopping recording"},
      ])
      SpeechRecognition.stopListening()
     }
    },
  ]
  */
  const { transcript, listening, resetTranscript, browserSupportsSpeechRecognition } =
    useSpeechRecognition();

    
  const handleRecordingEnded = (transcript) => {
    resetTranscript();

    setMessages((messages) => [
      ...messages,
      { user: "user", message: transcript },
      { user: "Loading", message: "Waiting for a response from the server." },
    ]);
    /*
    setTimeout(() => {
      setMessages((messages) => {
        const newMessages = [...messages]; //[...messages, { user: "SpecIA", message: res.data[0].text }]
        newMessages[messages.length - 1] = { user: "SpecIA", message: "Satya responded." };
        return newMessages;
      });
      SpeechRecognition.startListening();
    }, 1000);
    */

    axios
      .post(`http://localhost:5005/webhooks/rest/webhook`, {
        sender: "test_user",
        message: transcript,
      })
      .then((res) => {
        console.log(res);
        setMessages((messages) => {
          const newMessages = [...messages]; //[...messages, { user: "SpecIA", message: res.data[0].text }]
          newMessages[messages.length - 1] = { user: "SpecIA", message: res.data[0].text };
          return newMessages;
        });
        SpeechRecognition.startListening();
      })
      .catch((e) => {
        setMessages((messages) => {
          const newMessages = [...messages]; //[...messages, { user: "Error", message: "Error getting a response from the server." }]
          newMessages[messages.length - 1] = {
            user: "Error",
            message: "Error getting a response from the server.",
          };
          return newMessages;
        });
      });
  };

  useEffect(() => {
    if (!listening && transcript) {
      handleRecordingEnded(transcript);
    }
  }, [listening, transcript]);

  if (!browserSupportsSpeechRecognition) {
    return <span>Browser doesn't support speech recognition.</span>;
  }

  return (
    <>
      <div className="App">
        <p>Microphone: {listening ? "on" : "off"}</p>
        <button
          className={`text-white ${listening ? "bg-danger" : "bg-success"}`}
          onClick={SpeechRecognition.startListening}>
          {listening ? "Recording..." : "Click to speak"}
        </button>
        <button style={{color:"white",backgroundColor:"red"}} onClick={SpeechRecognition.stopListening}>Stop</button> 
        <button
          onClick={() => {
            resetTranscript();
            setMessages([]);
            return null;
          }}
        >
          Reset
        </button>
      </div>
      <Row className="justify-content-center">
        <Col xs sm="10" xl="5" lg="8">
          {messages.map((message, idx) => {
            return (
              <div
                className={`${
                  message.user === "SpecIA" || message.user === "Error"
                    ? "text-end"
                    : message.user === "Loading"
                    ? "text-center"
                    : ""
                }`}
                key={idx}
              >
                {message.user === "SpecIA" ? (
                  <img
                    src={SpeciaLogo}
                    alt="profile icon"
                    style={{ height: "40px", padding: "10px" }}
                  />
                ) : message.user === "Error" ? (
                  <img
                    src={ErrorIcon}
                    alt="profile icon"
                    style={{ height: "40px", padding: "10px" }}
                  />
                ) : message.user === "Loading" ? (
                  <>
                    <Spinner as="span" animation="grow" size="sm" role="status" />{" "}
                  </>
                ) : (
                  <img
                    src={ProfileIcon}
                    alt="profile icon"
                    style={{ height: "40px", padding: "10px" }}
                  />
                )}

                <span>
                  {message.user === "Error"
                    ? message.message
                    : message.user === "Loading"
                    ? message.message
                    : `${message.user} said: ${message.message}`}
                </span>
              </div>
            );
          })}
        </Col>
      </Row>
      
      {/*Chatbox. User inputs commands via text.*/}
      <div class="input-group mb-3">
        <input type="text" class="form-control" placeholder="Type your command"/>
        <div class="input-group-append">
            <button class="btn btn-outline-secondary" type="button">Enter</button>
        </div>
      </div>
    </>
  );
};
export default ChatBot;
