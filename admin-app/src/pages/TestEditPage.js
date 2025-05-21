import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Button,
  Box,
  CircularProgress,
  Alert,
  Grid,
} from '@mui/material';
import TestFormBasicInfo from '../components/TestFormBasicInfo';
import TestFormVariants from '../components/TestFormVariants';
import TestFormGoals from '../components/TestFormGoals'; // Import TestFormGoals
import { fetchTest, createTest, updateTest } from '../services/api';
import { generateUUID } from '../utils/helpers';

const steps = ['Basic Information', 'Variants', 'Conversion Goal']; // Added 'Conversion Goal'

const initialGoalData = {
    _blft_ab_goal_type: '',
    _blft_ab_goal_pv_url: '',
    _blft_ab_goal_pv_url_match_type: 'exact',
    _blft_ab_goal_sc_element_selector: '',
    _blft_ab_goal_fs_form_selector: '',
    _blft_ab_goal_fs_trigger: 'submit_event',
    _blft_ab_goal_fs_thank_you_url: '',
    _blft_ab_goal_fs_success_class: '',
    _blft_ab_goal_wc_any_product: true,
    _blft_ab_goal_wc_product_id: '',
    _blft_ab_goal_sd_percentage: '',
    _blft_ab_goal_top_seconds: '',
    _blft_ab_goal_cje_event_name: '',
};

const initialFormData = {
  basicInfo: {
    name: '',
    description: '',
  },
  variants: [], // { id: 'uuid', name: 'Variant A', distribution: 50 }
  goalData: { ...initialGoalData }, // Initialize goalData
  // settings: {}, // For future phases
  status: 'draft', // WP post status
  meta: {
    _blft_ab_status: 'draft', // Plugin's internal status
    _blft_ab_description: '',
    _blft_ab_variants: [],
    ...initialGoalData, // Spread initial goal data into meta as well
  }
};

const TestEditPage = () => {
  const { testId } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(testId);

  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState(JSON.parse(JSON.stringify(initialFormData))); // Deep copy
  const [loading, setLoading] = useState(isEditMode);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

  const loadTestData = useCallback(async () => {
    if (isEditMode) {
      console.log(`Edit mode: Fetching test ID ${testId}`);
      setLoading(true);
      setError(null);
      try {
        const response = await fetchTest(testId);
        const testData = response.data;
        console.log('Fetched test data for edit:', testData);
        setFormData({
          basicInfo: {
            name: testData.title?.raw || '',
            description: testData.meta?._blft_ab_description || '',
          },
          variants: testData.meta?._blft_ab_variants || [],
          goalData: { // Populate goalData from fetched meta
            _blft_ab_goal_type: testData.meta?._blft_ab_goal_type || '',
            _blft_ab_goal_pv_url: testData.meta?._blft_ab_goal_pv_url || '',
            _blft_ab_goal_pv_url_match_type: testData.meta?._blft_ab_goal_pv_url_match_type || 'exact',
            _blft_ab_goal_sc_element_selector: testData.meta?._blft_ab_goal_sc_element_selector || '',
            _blft_ab_goal_fs_form_selector: testData.meta?._blft_ab_goal_fs_form_selector || '',
            _blft_ab_goal_fs_trigger: testData.meta?._blft_ab_goal_fs_trigger || 'submit_event',
            _blft_ab_goal_fs_thank_you_url: testData.meta?._blft_ab_goal_fs_thank_you_url || '',
            _blft_ab_goal_fs_success_class: testData.meta?._blft_ab_goal_fs_success_class || '',
            _blft_ab_goal_wc_any_product: testData.meta?._blft_ab_goal_wc_any_product === undefined ? true : Boolean(testData.meta._blft_ab_goal_wc_any_product),
            _blft_ab_goal_wc_product_id: testData.meta?._blft_ab_goal_wc_product_id || '',
            _blft_ab_goal_sd_percentage: testData.meta?._blft_ab_goal_sd_percentage || '',
            _blft_ab_goal_top_seconds: testData.meta?._blft_ab_goal_top_seconds || '',
            _blft_ab_goal_cje_event_name: testData.meta?._blft_ab_goal_cje_event_name || '',
          },
          status: testData.status || 'draft',
          meta: { // Ensure all meta fields are populated
            _blft_ab_status: testData.meta?._blft_ab_status || 'draft',
            _blft_ab_description: testData.meta?._blft_ab_description || '',
            _blft_ab_variants: testData.meta?._blft_ab_variants || [],
            _blft_ab_goal_type: testData.meta?._blft_ab_goal_type || '',
            _blft_ab_goal_pv_url: testData.meta?._blft_ab_goal_pv_url || '',
            _blft_ab_goal_pv_url_match_type: testData.meta?._blft_ab_goal_pv_url_match_type || 'exact',
            _blft_ab_goal_sc_element_selector: testData.meta?._blft_ab_goal_sc_element_selector || '',
            _blft_ab_goal_fs_form_selector: testData.meta?._blft_ab_goal_fs_form_selector || '',
            _blft_ab_goal_fs_trigger: testData.meta?._blft_ab_goal_fs_trigger || 'submit_event',
            _blft_ab_goal_fs_thank_you_url: testData.meta?._blft_ab_goal_fs_thank_you_url || '',
            _blft_ab_goal_fs_success_class: testData.meta?._blft_ab_goal_fs_success_class || '',
            _blft_ab_goal_wc_any_product: testData.meta?._blft_ab_goal_wc_any_product === undefined ? true : Boolean(testData.meta._blft_ab_goal_wc_any_product),
            _blft_ab_goal_wc_product_id: testData.meta?._blft_ab_goal_wc_product_id || '',
            _blft_ab_goal_sd_percentage: testData.meta?._blft_ab_goal_sd_percentage || '',
            _blft_ab_goal_top_seconds: testData.meta?._blft_ab_goal_top_seconds || '',
            _blft_ab_goal_cje_event_name: testData.meta?._blft_ab_goal_cje_event_name || '',
          }
        });
      } catch (err) {
        console.error('Error fetching test data:', err);
        setError(err.message || 'Failed to load test data.');
      } finally {
        setLoading(false);
      }
    } else {
      console.log('Create mode: Initializing form data.');
      // Ensure at least one variant for new tests
      const defaultVariant = { id: generateUUID(), name: 'Variant A', distribution: 100 };
      setFormData(prev => ({
        ...JSON.parse(JSON.stringify(initialFormData)),
        variants: [defaultVariant],
        meta: {
            ...initialFormData.meta,
            _blft_ab_variants: [defaultVariant]
        }
      }));
      setLoading(false);
    }
  }, [testId, isEditMode]);

  useEffect(() => {
    loadTestData();
  }, [loadTestData]);

  const handleFormChange = (section, data) => {
    console.log(`Form change in section: ${section}`, data);
    setFormData((prev) => {
        if (section === 'basicInfo') {
            return {
                ...prev,
                basicInfo: data,
                meta: { ...prev.meta, _blft_ab_description: data.description }
            };
        }
        if (section === 'variants') {
             return {
                ...prev,
                variants: data,
                meta: { ...prev.meta, _blft_ab_variants: data }
            };
        }
        if (section === 'goalData') {
            return {
                ...prev,
                goalData: data,
                meta: { ...prev.meta, ...data } // Spread goal data into meta
            };
        }
        return prev;
    });
  };
  
  const validateStep = () => {
    const errors = {};
    if (activeStep === 0) { // Basic Info
        if (!formData.basicInfo.name?.trim()) {
            errors.name = 'Test name is required.';
        }
    }
    if (activeStep === 1) { // Variants
        if (!formData.variants || formData.variants.length === 0) {
            errors.variants_general = 'At least one variant is required.';
        } else {
            const variantErrors = formData.variants.map(v => {
                const vErrors = {};
                if (!v.name?.trim()) vErrors.name = 'Variant name is required.';
                if (v.distribution === undefined || v.distribution === null || v.distribution < 0 || v.distribution > 100) {
                    vErrors.distribution = 'Distribution must be between 0 and 100.';
                }
                return vErrors;
            });
            if (variantErrors.some(ve => Object.keys(ve).length > 0)) {
                errors.variants = variantErrors;
            }
            const totalDistribution = formData.variants.reduce((sum, v) => sum + (Number(v.distribution) || 0), 0);
            if (totalDistribution !== 100) {
                errors.variants_general = (errors.variants_general ? errors.variants_general + " " : "") + `Total distribution must be 100%. Current: ${totalDistribution}%.`;
            }
        }
    }
    if (activeStep === 2) { // Conversion Goal
        if (!formData.goalData._blft_ab_goal_type) {
            errors.goal_type = 'Goal type is required.';
        } else {
            // Add specific validations for each goal type if needed
            if (formData.goalData._blft_ab_goal_type === 'page_visit' && !formData.goalData._blft_ab_goal_pv_url?.trim()) {
                errors.goal_pv_url = 'Target Page URL is required for Page Visit goal.';
            }
            if (formData.goalData._blft_ab_goal_type === 'selector_click' && !formData.goalData._blft_ab_goal_sc_element_selector?.trim()) {
                errors.goal_sc_element_selector = 'Element CSS Selector is required for Selector Click goal.';
            }
            // TODO: Add more validations for other goal types
        }
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };


  const handleNext = () => {
    if (validateStep()) {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSubmit = async () => {
    if (!validateStep()) { // Validate current step before final submit too
        alert("Please correct the errors before submitting.");
        return;
    }
    // Final validation across all steps if needed (though current setup validates per step)
    let allValid = true;
    // Simulate validating all steps if we had more
    if (!formData.basicInfo.name?.trim()) {
        setValidationErrors(prev => ({...prev, name: 'Test name is required.'}));
        allValid = false;
    }
    if (formData.variants.length === 0) {
         setValidationErrors(prev => ({...prev, variants_general: 'At least one variant is required.'}));
        allValid = false;
    } else {
        const totalDistribution = formData.variants.reduce((sum, v) => sum + (Number(v.distribution) || 0), 0);
        if (totalDistribution !== 100) {
            setValidationErrors(prev => ({...prev, variants_general: (prev.variants_general || "") + ` Total distribution must be 100%. Current: ${totalDistribution}%.`}));
            allValid = false;
        }
    }


    if (!allValid) {
        alert("Please ensure all fields are correctly filled.");
        return;
    }


    setSaving(true);
    setError(null);
    const payload = {
      title: { raw: formData.basicInfo.name }, // Send title as an object with 'raw' property
      status: formData.status, // WP post status, e.g., 'draft' or 'publish'
      meta: {
        _blft_ab_status: formData.meta._blft_ab_status || 'draft', // Plugin specific status
        _blft_ab_description: formData.basicInfo.description,
        _blft_ab_variants: formData.variants,
        // Add goal data to meta payload
        _blft_ab_goal_type: formData.goalData._blft_ab_goal_type,
        _blft_ab_goal_pv_url: formData.goalData._blft_ab_goal_pv_url,
        _blft_ab_goal_pv_url_match_type: formData.goalData._blft_ab_goal_pv_url_match_type,
        _blft_ab_goal_sc_element_selector: formData.goalData._blft_ab_goal_sc_element_selector,
        _blft_ab_goal_fs_form_selector: formData.goalData._blft_ab_goal_fs_form_selector,
        _blft_ab_goal_fs_trigger: formData.goalData._blft_ab_goal_fs_trigger,
        _blft_ab_goal_fs_thank_you_url: formData.goalData._blft_ab_goal_fs_thank_you_url,
        _blft_ab_goal_fs_success_class: formData.goalData._blft_ab_goal_fs_success_class,
        _blft_ab_goal_wc_any_product: Boolean(formData.goalData._blft_ab_goal_wc_any_product),
        _blft_ab_goal_wc_product_id: formData.goalData._blft_ab_goal_wc_product_id ? parseInt(formData.goalData._blft_ab_goal_wc_product_id, 10) : 0,
        _blft_ab_goal_sd_percentage: formData.goalData._blft_ab_goal_sd_percentage ? parseInt(formData.goalData._blft_ab_goal_sd_percentage, 10) : 0,
        _blft_ab_goal_top_seconds: formData.goalData._blft_ab_goal_top_seconds ? parseInt(formData.goalData._blft_ab_goal_top_seconds, 10) : 0,
        _blft_ab_goal_cje_event_name: formData.goalData._blft_ab_goal_cje_event_name,
      },
    };
    console.log('Submitting test data:', payload);

    try {
      if (isEditMode) {
        await updateTest(testId, payload);
        console.log('Test updated successfully');
      } else {
        await createTest(payload);
        console.log('Test created successfully');
      }
      navigate('/tests'); // Or to the main plugin page that lists tests
    } catch (err) {
      console.error('Error saving test:', err);
      setError(err.response?.data?.message || err.message || 'Failed to save test.');
      // Potentially parse err.response.data.data for specific field errors from API
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}><CircularProgress /></Box>;
  }
  if (error && !saving) { // Don't show general load error if a save error occurs
    return <Alert severity="error" sx={{ m: 2 }}>{error}</Alert>;
  }

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return <TestFormBasicInfo formData={formData} handleChange={handleFormChange} errors={validationErrors} />;
      case 1:
        return <TestFormVariants formData={formData} handleChange={handleFormChange} errors={validationErrors} />;
      case 2: // New case for Conversion Goal
        return <TestFormGoals goalData={formData.goalData} onGoalDataChange={(data) => handleFormChange('goalData', data)} errors={validationErrors} />;
      // Add cases for 'Settings' in later phases
      default:
        return 'Unknown step';
    }
  };

  return (
    <Container maxWidth="md">
      <Paper sx={{ p: { xs: 2, md: 3 }, my: { xs: 2, md: 4 } }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 3 }}>
          {isEditMode ? 'Edit A/B Test' : 'Create New A/B Test'}
        </Typography>

        <Stepper activeStep={activeStep} sx={{ mb: 3 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {error && saving && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        
        <form onSubmit={(e) => e.preventDefault()}>
            {getStepContent(activeStep)}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                <Button
                disabled={activeStep === 0}
                onClick={handleBack}
                sx={{ mr: 1 }}
                >
                Back
                </Button>
                {activeStep === steps.length - 1 ? (
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSubmit}
                    disabled={saving}
                >
                    {saving ? <CircularProgress size={24} /> : (isEditMode ? 'Save Changes' : 'Create Test')}
                </Button>
                ) : (
                <Button variant="contained" color="primary" onClick={handleNext}>
                    Next
                </Button>
                )}
            </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default TestEditPage;