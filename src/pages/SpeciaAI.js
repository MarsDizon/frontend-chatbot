import React from 'react';

// Material UI
import { Box, Container, Grid, Typography } from '@mui/material';

// Components
import ChatBot from '../components/ChatBot';
import Page from '../components/Page';

// ----------------------------------------------------------------------

export default function SpeciaPage() {
  return (
    <Page title="Specia AI">
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
