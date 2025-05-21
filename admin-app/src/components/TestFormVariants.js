import React from 'react';
import {
  TextField,
  Typography,
  Paper,
  Grid,
  IconButton,
  Button,
  Box,
  Slider,
  Tooltip
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { generateUUID } from '../utils/helpers';


const TestFormVariants = ({ formData, handleChange, errors }) => {
  console.log('TestFormVariants rendered. FormData:', formData, "Errors:", errors);

  const handleVariantChange = (index, field, value) => {
    let newVariants = [...formData.variants];
    newVariants[index][field] = value;

    if (field === 'distribution') {
      const newDistribution = Math.max(0, Math.min(100, Number(value) || 0));
      newVariants[index][field] = newDistribution;

      // If exactly two variants, auto-adjust the other
      if (newVariants.length === 2) {
        const otherIndex = index === 0 ? 1 : 0;
        newVariants[otherIndex].distribution = 100 - newDistribution;
      }
    }
    handleChange('variants', newVariants);
  };

  const addVariant = () => {
    if (formData.variants.length >= 2) {
      return; // Do not add more than 2 variants
    }

    let newVariantName = `Variant ${formData.variants.length + 1}`;
    if (formData.variants.length === 0) {
        newVariantName = 'Variant A';
    } else if (formData.variants.length === 1) {
        newVariantName = 'Variant B';
    }

    const newVariant = {
      id: generateUUID(),
      name: newVariantName,
      distribution: 0, // Will be adjusted below
    };
    
    let updatedVariants = [...formData.variants, newVariant];

    // Auto-adjust distribution
    if (updatedVariants.length === 1) {
        updatedVariants[0].distribution = 100;
    } else if (updatedVariants.length === 2) {
        // If adding the second variant, try to split 50/50 or give remainder to the first
        // This logic is now simpler as the first one would be 100.
        // When the second is added, the first one's slider can be used to adjust.
        // For now, let's set the new one to 0 and the first one remains 100,
        // or set both to 50 if adding the second.
        updatedVariants[0].distribution = 50;
        updatedVariants[1].distribution = 50;
    }
    handleChange('variants', updatedVariants);
  };

  const removeVariant = (index) => {
    if (formData.variants.length <= 1) {
        // Optionally, show an error or prevent deletion of the last variant
        alert("At least one variant is required.");
        return;
    }
    const newVariants = formData.variants.filter((_, i) => i !== index);
    
    // Auto-adjust distribution after removal
    if (newVariants.length > 0) {
        const totalVariants = newVariants.length;
        const equalDistribution = Math.floor(100 / totalVariants);
        const remainder = 100 % totalVariants;
        
        for (let i = 0; i < totalVariants; i++) {
            newVariants[i].distribution = equalDistribution + (i < remainder ? 1 : 0);
        }
    }
    handleChange('variants', newVariants);
  };
  
  const totalDistribution = formData.variants.reduce((sum, v) => sum + (Number(v.distribution) || 0), 0);

  return (
    <Paper elevation={2} sx={{ p: 3, mt: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        <Typography variant="h6" component="div">
          Variants
        </Typography>
        <Button
          variant="outlined"
          startIcon={<AddCircleOutlineIcon />}
          onClick={addVariant}
          size="small"
          disabled={formData.variants.length >= 2} // Disable if 2 variants already exist
        >
          Add Variant
        </Button>
      </Box>
      {errors?.variants_general && <Typography color="error" variant="caption" sx={{mb:1, display: 'block'}}>{errors.variants_general}</Typography>}
      {totalDistribution !== 100 && formData.variants.length > 0 && (
        <Typography color="error" variant="caption" sx={{mb:1, display: 'block'}}>
            Total distribution must be 100%. Current total: {totalDistribution}%
        </Typography>
      )}


      {formData.variants.map((variant, index) => (
        <Paper key={variant.id || index} variant="outlined" sx={{ p: 2, mb: 2 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={5}>
              <TextField
                fullWidth
                label={`Variant ${index + 1} Name`}
                value={variant.name}
                onChange={(e) => handleVariantChange(index, 'name', e.target.value)}
                variant="outlined"
                size="small"
                required
                error={!!errors?.variants?.[index]?.name}
                helperText={errors?.variants?.[index]?.name}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={10} sm={5}>
              <Tooltip title={`Distribution: ${variant.distribution}%`}>
                <Slider
                    value={Number(variant.distribution) || 0}
                    onChange={(e, newValue) => handleVariantChange(index, 'distribution', newValue)}
                    aria-labelledby={`variant-distribution-slider-${index}`}
                    valueLabelDisplay="auto"
                    step={1}
                    marks
                    min={0}
                    max={100}
                    disabled={formData.variants.length === 1} // Disable slider if only one variant
                />
              </Tooltip>
            </Grid>
             <Grid item xs={2} sm={1}>
                <Typography align="right" sx={{minWidth: '40px'}}>
                    {variant.distribution}%
                </Typography>
            </Grid>
            <Grid item xs={12} sm={1} sx={{ textAlign: 'right' }}>
              <IconButton onClick={() => removeVariant(index)} color="error" disabled={formData.variants.length <= 1} size="small">
                <DeleteOutlineIcon />
              </IconButton>
            </Grid>
          </Grid>
        </Paper>
      ))}
      {formData.variants.length === 0 && (
        <Typography sx={{my: 2, textAlign: 'center'}}>
            No variants defined. Click "Add Variant" to start.
        </Typography>
      )}
    </Paper>
  );
};

export default TestFormVariants;