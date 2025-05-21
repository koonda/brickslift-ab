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
    const newVariants = [...formData.variants];
    newVariants[index][field] = value;
    // Ensure distribution is a number
    if (field === 'distribution') {
        newVariants[index][field] = Number(value) || 0;
    }
    handleChange('variants', newVariants);
  };

  const addVariant = () => {
    const newVariant = {
      id: generateUUID(), // Ensure this function is available
      name: `Variant ${formData.variants.length + 1}`,
      distribution: formData.variants.length === 0 ? 100 : 0, // Default first variant to 100%
    };
    const updatedVariants = [...formData.variants, newVariant];
    
    // Auto-adjust distribution if adding more than one variant
    if (updatedVariants.length > 1) {
        const totalVariants = updatedVariants.length;
        const equalDistribution = Math.floor(100 / totalVariants);
        const remainder = 100 % totalVariants;
        
        for (let i = 0; i < totalVariants; i++) {
            updatedVariants[i].distribution = equalDistribution + (i < remainder ? 1 : 0);
        }
    } else if (updatedVariants.length === 1) {
        updatedVariants[0].distribution = 100;
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