// Material UI
import { Box, Grid, Container, Typography } from '@mui/material';
import React from 'react';

// Components
import Page from '../components/Page';
import { TaskHistoryTimeline } from '../components/_dashboard/history';

// ----------------------------------------------------------------------

export default function TaskHistory() {
  return (
    <Page title="Home">
      <Container maxWidth="xl">
        <Box sx={{ pb: 5 }}>
          <Typography variant="h4">Task History</Typography>
        </Box>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={12}>
            <TaskHistoryTimeline />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}
