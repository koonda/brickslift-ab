import React from 'react';
import { TextField, Typography, Paper, Grid } from '@mui/material';

const TestFormBasicInfo = ({ formData, handleChange, errors }) => {
  console.log('TestFormBasicInfo rendered. FormData:', formData, "Errors:", errors);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    handleChange('basicInfo', { ...formData.basicInfo, [name]: value });
  };

  return (
    <Paper elevation={2} sx={{ p: 3, mt: 2 }}>
      <Typography variant="h6" gutterBottom component="div" sx={{ mb: 2 }}>
        Basic Information
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Test Name"
            name="name"
            value={formData.basicInfo.name || ''}
            onChange={handleInputChange}
            variant="outlined"
            required
            error={!!errors?.name}
            helperText={errors?.name}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Description"
            name="description"
            value={formData.basicInfo.description || ''}
            onChange={handleInputChange}
            multiline
            rows={4}
            variant="outlined"
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
      </Grid>
    </Paper>
  );
};

export default TestFormBasicInfo;