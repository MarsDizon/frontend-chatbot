import React, { useState, useEffect } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import axios from "axios";

// Material UI
import { Card, CardContent, Grid, Tooltip, LinearProgress, IconButton } from '@mui/material';
import makeStyles from "@material-ui/core/styles/makeStyles";

// Icons
import { Icon } from '@iconify/react';
import micFill from '@iconify/icons-eva/mic-fill';
import micOffOutline from '@iconify/icons-eva/mic-off-outline';
import refreshFill from '@iconify/icons-eva/refresh-fill';

// Components
import Scrollbar from 'src/components/Scrollbar';
import ProfileIcon from "../assets/ProfileIcon.png";
import SpeciaLogo from "../assets/SpeciaLogo.png";
import ErrorIcon from "../assets/ErrorIcon.png";

// ----------------------------------------------------------------------

const useStyles = makeStyles(() => ({
  loading: {
    position: "relative",
    alignSelf: "center",
  },
  user: {
    color: "black",
    fontSize: "15px",
    maxWidth: "90%",
    padding: "5px 8px",
    borderRadius: "15px",
    position: "relative",
    alignSelf: "flex-end",
    backgroundColor: "#fff",
    boxShadow: "0px 2px 3px grey"
  },
  specia: {
    color: "white",
    fontSize: "15px",
    maxWidth: "90%",
    padding: "5px 8px",
    borderRadius: "15px",
    position: "relative",
    alignSelf: "flex-start",
    backgroundColor: "#007AFF",
    boxShadow: "0px 2px 3px grey"
  }
}));

export default function ChatBot() {
  const classes = useStyles();
  
  const [messages, setMessages] = useState([]);
  const { transcript, listening, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();

  const HandleRecordingEnded = (transcript) => {
    resetTranscript();

    setMessages((messages) => [
      ...messages,
      { user: "User", message: transcript },
      { user: "Loading", message: "" },
    ]);

    axios
    .post(`http://localhost:5005/webhooks/rest/webhook`, {
      sender: "test_user",
      message: transcript,
    })
    .then((res) => {
      console.log(res);
      setMessages((messages) => {
        const newMessages = [...messages];
        newMessages[messages.length - 1] = { user: "SpecIA", message: res.data[0].text };
        return newMessages;
      });
      SpeechRecognition.startListening();
    })
    .catch(() => {
      setMessages((messages) => {
        const newMessages = [...messages];
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
      HandleRecordingEnded(transcript);
    }
  }, [listening, transcript]);

  if (!browserSupportsSpeechRecognition) {
    return <span>Browser doesn't support speech recognition.</span>;
  }

  // Only one component used for display
  return (
    <div>
    
    <Card style={{ backgroundColor: "#fafafa", overflow: "hidden", borderBottomLeftRadius: "0", borderBottomRightRadius: "0" }} display="inline-block">
      <Scrollbar style={{ height: "450px" }}>
        <CardContent>
            <Grid container direction="column">
              {messages.map((message, idx) => {
                return (
                  <Grid item
                    className={`${
                    message.user === "SpecIA" || message.user === "Error"
                      ? classes.specia
                      : message.user === "Loading"
                      ? classes.loading
                      : classes.user 
                    }`}
                    key={idx}
                    style={{ display: "flex", alignItems: "center", bottom: "0" }}
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
                          <LinearProgress color="inherit" style={{ width: "1005px", marginTop: "35px" }} />
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
                        : `${message.user}: ${message.message}`}
                    </span>
                  </Grid>
                );
              })}
            </Grid>
        </CardContent>
      </Scrollbar>
    </Card>

    {/* Microphone Component */}
    <Card style={{ backgroundColor: "#fafafa", borderTopLeftRadius: "0", borderTopRightRadius: "0" }} display="inline-block">

      {/* Caption to let user know if microphone is recording */}
      <div style={{ display: "flex", justifyContent: "center", fontSize: "14px", paddingTop: "10px" }}>
        {listening ? "Recording..." : "Microphone is off"}
      </div>

      {/* Toggle Microphone Recording On and Off */}
      <CardContent style={{ display: "flex", justifyContent: "center" }}>
        <div style={{ marginRight: "15px" }}>
        {listening 
          ?
          <Tooltip title="Press to mute the recording"> 
            <IconButton
              className={`text-white ${listening ? "bg-danger" : "bg-success"}`}
              onClick={SpeechRecognition.stopListening}>
                <Icon icon={micFill} width="40px" height="40px" style={{ color: "#00AB55" }} />
            </IconButton>
          </Tooltip>
          :
          <Tooltip title="Press to start recording">
            <IconButton
              className={`text-white ${listening ? "bg-danger" : "bg-success"}`}
              onClick={SpeechRecognition.startListening}>
                <Icon icon={micOffOutline} style={{ color: "#FF4842" }} width="40px" height="40px" />
            </IconButton>
          </Tooltip>
        }
        </div>

        {/* User Tooltip over Icons */}
        <Tooltip title="Reset">
            <IconButton
            className={`text-white ${listening ? "bg-danger" : "bg-success"}`}
            onClick={() => {
              resetTranscript();
              setMessages([]);
              return null;
            }}>
              <div style={{ color: "grey" }}>
                <Icon icon={refreshFill} width="40px" height="40px" />
              </div>
            </IconButton>
        </Tooltip>
      </CardContent>
    </Card>
    </div>
  );
}
