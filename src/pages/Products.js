import { useFormik } from 'formik';
import React, { useState, useEffect } from 'react';
// material
import { Box, Card, CardContent, Container, Grid, Typography, Tooltip, LinearProgress, IconButton } from '@mui/material';
import { ChatController, MuiChat } from 'chat-ui-react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import micFill from '@iconify/icons-eva/mic-fill';
import micOffOutline from '@iconify/icons-eva/mic-off-outline';
import refreshFill from '@iconify/icons-eva/refresh-fill';
import { Icon } from '@iconify/react';
import makeStyles from "@material-ui/core/styles/makeStyles";
import axios from "axios";
// components
import Scrollbar from 'src/components/Scrollbar';
import Page from '../components/Page';
import ProfileIcon from "../assets/ProfileIcon.png";
import SpeciaLogo from "../assets/SpeciaLogo.png";
import ErrorIcon from "../assets/ErrorIcon.png";

// ----------------------------------------------------------------------

const useStyles = makeStyles((theme) => ({
  loading: {
    position: "relative",
    alignSelf: "flex-start",
    display: "inline-block",
    left: "25%"
    // position: "fixed" // remove this so we can apply flex design
  },
  bubbleContainer: {
    width: "100%",
    display: "flex"
  },
  bubbleRight: {
    color: "black",
    fontSize: "15px",
    maxWidth: "50%",
    padding: "5px 8px",
    borderRadius: "15px",
    position: "relative",
    alignSelf: "flex-start",
    display: "inline-block",
    backgroundAttachment: "fixed",
    backgroundColor: "#fff",
    left: "100%",
    boxShadow: "0px 2px 3px grey"
  },
  bubbleLeft: {
    color: "white",
    fontSize: "15px",
    maxWidth: "50%",
    padding: "5px 8px",
    borderRadius: "15px",
    position: "relative",
    alignSelf: "flex-end",
    display: "inline-block",
    backgroundAttachment: "fixed",
    backgroundColor: "#007AFF",
    boxShadow: "0px 2px 3px grey"
  }
}));

const ChatBot = () => {
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
    .catch((e) => {
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
    
    <Card style={{ backgroundColor: "#fafafa", overflow: "hidden" }} display="inline-block">
    <Scrollbar style={{ height: "450px", bottom: "0" }}>
      <CardContent>
        <div className="mui-row">
          <Grid xs sm="10" xl="5" lg="8">
            {messages.map((message, idx) => {
              return (
                <div
                  className={`${
                  message.user === "SpecIA" || message.user === "Error"
                    ? classes.bubbleLeft
                    : message.user === "Loading"
                    ? classes.loading
                    : classes.bubbleRight
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
                </div>
              );
            })}
          </Grid>
        </div>
      </CardContent>
    </Scrollbar>
    </Card>
    <Card style={{ backgroundColor: "#fafafa", borderTopLeftRadius: "0", borderTopRightRadius: "0" }} display="inline-block">
      <div style={{ display: "flex", justifyContent: "center", fontSize: "14px", paddingTop: "10px" }}>
        {listening ? "Recording..." : "Microphone is off"}
      </div>
      <CardContent style={{ display: "flex", justifyContent: "center" }}>
        <div style={{ marginRight: "15px" }}>
        {listening 
          ?
          <Tooltip title="Press to mute the recording"> 
            <IconButton
            className={`text-white ${listening ? "bg-danger" : "bg-success"}`}
            onClick={SpeechRecognition.stopListening}>
              <div style={{ color: "#00AB55" }}>
                <Icon icon={micFill} width="40px" height="40px" />
              </div>
            </IconButton>
          </Tooltip>
          :
          <Tooltip title="Press to start recording">
            <IconButton
            className={`text-white ${listening ? "bg-danger" : "bg-success"}`}
            onClick={SpeechRecognition.startListening}>
              <div style={{ color: "#FF4842" }}>
                <Icon icon={micOffOutline} width="40px" height="40px" />
              </div>
            </IconButton>
          </Tooltip>
        }
        </div>
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
};

export default function EcommerceShop() {
  return (
    <Page title="Dashboard: Products | Minimal-UI">
      <Container maxWidth="xl">
        <Box sx={{ pb: 5 }}>
          <Typography variant="h4">Specia AI</Typography>
        </Box>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={12} style={{ height: "300px" }}>
            <ChatBot />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}
