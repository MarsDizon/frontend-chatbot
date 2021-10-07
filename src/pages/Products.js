import { useFormik } from 'formik';
import React, { useState } from 'react';
// material
import { Box, Card, CardContent, Container, Grid, Typography } from '@mui/material';
import { ChatController, MuiChat } from 'chat-ui-react';
// components
import Page from '../components/Page';

// ----------------------------------------------------------------------

function ChatBot() {
  const [chatCtl] = React.useState(new ChatController());

  React.useMemo(async () => {
    // Chat content is displayed using ChatController
    await chatCtl.addMessage({
      type: 'text',
      content: `Hello, What's your name.`,
      self: false
    });
    const name = await chatCtl.setActionRequest({ type: 'text' });
  }, [chatCtl]);

  // Only one component used for display
  return (
    <Card>
      <CardContent>
        <MuiChat chatController={chatCtl} />
      </CardContent>
    </Card>
  );
}

export default function EcommerceShop() {
  return (
    <Page title="Dashboard: Products | Minimal-UI">
      <Container>
        <Box sx={{ pb: 5 }}>
          <Typography variant="h4">Hi, Welcome back</Typography>
        </Box>
      </Container>
    </Page>
  );
}