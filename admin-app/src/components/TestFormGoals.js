import React from 'react';
import { Box, FormControl, InputLabel, Select, MenuItem, TextField, Typography, Grid, FormHelperText } from '@mui/material';

const goalTypes = [
    { value: '', label: 'Select Goal Type' },
    { value: 'page_visit', label: 'Page Visit' },
    { value: 'selector_click', label: 'Selector Click' },
    { value: 'form_submission', label: 'Form Submission' },
    { value: 'wc_add_to_cart', label: 'WooCommerce Add to Cart' },
    { value: 'scroll_depth', label: 'Scroll Depth' },
    { value: 'time_on_page', label: 'Time on Page' },
    { value: 'custom_js_event', label: 'Custom JavaScript Event' },
];

const TestFormGoals = ({ goalData, onGoalDataChange }) => {
    const handleInputChange = (event) => {
        const { name, value, type, checked } = event.target;
        onGoalDataChange({
            ...goalData,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const handleGoalTypeChange = (event) => {
        const newGoalType = event.target.value;
        // Reset specific goal fields when type changes to avoid carrying over old data
        const resetGoalData = {
            _blft_ab_goal_type: newGoalType,
            _blft_ab_goal_pv_url: '',
            _blft_ab_goal_pv_url_match_type: 'exact',
            _blft_ab_goal_sc_element_selector: '',
            _blft_ab_goal_fs_form_selector: '',
            _blft_ab_goal_fs_trigger: 'submit_event',
            _blft_ab_goal_fs_thank_you_url: '',
            _blft_ab_goal_fs_success_class: '',
            _blft_ab_goal_wc_any_product: true,
            _blft_ab_goal_wc_product_id: '', // Storing as string for TextField, convert to int on save
            _blft_ab_goal_sd_percentage: '', // Storing as string for TextField
            _blft_ab_goal_top_seconds: '', // Storing as string for TextField
            _blft_ab_goal_cje_event_name: '',
        };
        onGoalDataChange(resetGoalData);
    };

    return (
        <Box sx={{ mt: 2 }}>
            <Typography variant="h6" gutterBottom>
                Conversion Goal
            </Typography>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                    <FormControl fullWidth margin="normal">
                        <InputLabel id="goal-type-label">Goal Type</InputLabel>
                        <Select
                            labelId="goal-type-label"
                            id="_blft_ab_goal_type"
                            name="_blft_ab_goal_type"
                            value={goalData._blft_ab_goal_type || ''}
                            label="Goal Type"
                            onChange={handleGoalTypeChange}
                        >
                            {goalTypes.map((option) => (
                                <MenuItem key={option.value} value={option.value} disabled={option.value === ''}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>

                {/* Conditional Fields based on goalData._blft_ab_goal_type */}
                {goalData._blft_ab_goal_type === 'page_visit' && (
                    <>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                margin="normal"
                                name="_blft_ab_goal_pv_url"
                                label="Target Page URL"
                                value={goalData._blft_ab_goal_pv_url || ''}
                                onChange={handleInputChange}
                                helperText="e.g., /thank-you or https://example.com/pricing"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth margin="normal">
                                <InputLabel id="pv-url-match-type-label">URL Match Type</InputLabel>
                                <Select
                                    labelId="pv-url-match-type-label"
                                    name="_blft_ab_goal_pv_url_match_type"
                                    value={goalData._blft_ab_goal_pv_url_match_type || 'exact'}
                                    label="URL Match Type"
                                    onChange={handleInputChange}
                                >
                                    <MenuItem value="exact">Exact Match</MenuItem>
                                    <MenuItem value="contains">Contains</MenuItem>
                                    <MenuItem value="starts_with">Starts With</MenuItem>
                                    <MenuItem value="ends_with">Ends With</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                    </>
                )}

                {goalData._blft_ab_goal_type === 'selector_click' && (
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            margin="normal"
                            name="_blft_ab_goal_sc_element_selector"
                            label="Element CSS Selector"
                            value={goalData._blft_ab_goal_sc_element_selector || ''}
                            onChange={handleInputChange}
                            helperText="e.g., #submit-button or .cta-link"
                        />
                    </Grid>
                )}

                {goalData._blft_ab_goal_type === 'form_submission' && (
                    <>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                margin="normal"
                                name="_blft_ab_goal_fs_form_selector"
                                label="Form CSS Selector"
                                value={goalData._blft_ab_goal_fs_form_selector || ''}
                                onChange={handleInputChange}
                                helperText="e.g., form#contact-form or .wpcf7-form"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth margin="normal">
                                <InputLabel id="fs-trigger-label">Submission Trigger</InputLabel>
                                <Select
                                    labelId="fs-trigger-label"
                                    name="_blft_ab_goal_fs_trigger"
                                    value={goalData._blft_ab_goal_fs_trigger || 'submit_event'}
                                    label="Submission Trigger"
                                    onChange={handleInputChange}
                                >
                                    <MenuItem value="submit_event">Form Submit Event</MenuItem>
                                    <MenuItem value="thank_you_page">Thank You Page Visit</MenuItem>
                                    <MenuItem value="success_class">Success Class Added</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        {goalData._blft_ab_goal_fs_trigger === 'thank_you_page' && (
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    margin="normal"
                                    name="_blft_ab_goal_fs_thank_you_url"
                                    label="Thank You Page URL"
                                    value={goalData._blft_ab_goal_fs_thank_you_url || ''}
                                    onChange={handleInputChange}
                                    helperText="Relative (e.g., /thanks) or absolute URL"
                                />
                            </Grid>
                        )}
                        {goalData._blft_ab_goal_fs_trigger === 'success_class' && (
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    margin="normal"
                                    name="_blft_ab_goal_fs_success_class"
                                    label="Success CSS Class"
                                    value={goalData._blft_ab_goal_fs_success_class || ''}
                                    onChange={handleInputChange}
                                    helperText="e.g., .form-submitted-ok"
                                />
                            </Grid>
                        )}
                    </>
                )}

                {goalData._blft_ab_goal_type === 'wc_add_to_cart' && (
                    <>
                        <Grid item xs={12} sm={6}>
                             <FormControl fullWidth margin="normal">
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            name="_blft_ab_goal_wc_any_product"
                                            checked={goalData._blft_ab_goal_wc_any_product === undefined ? true : Boolean(goalData._blft_ab_goal_wc_any_product)}
                                            onChange={handleInputChange}
                                        />
                                    }
                                    label="Track for any product"
                                />
                            </FormControl>
                        </Grid>
                        {!(goalData._blft_ab_goal_wc_any_product === undefined ? true : Boolean(goalData._blft_ab_goal_wc_any_product)) && (
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    margin="normal"
                                    name="_blft_ab_goal_wc_product_id"
                                    label="Specific Product ID"
                                    type="number"
                                    value={goalData._blft_ab_goal_wc_product_id || ''}
                                    onChange={handleInputChange}
                                />
                            </Grid>
                        )}
                    </>
                )}

                {goalData._blft_ab_goal_type === 'scroll_depth' && (
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            margin="normal"
                            name="_blft_ab_goal_sd_percentage"
                            label="Scroll Depth Percentage"
                            type="number"
                            value={goalData._blft_ab_goal_sd_percentage || ''}
                            onChange={handleInputChange}
                            InputProps={{ inputProps: { min: 0, max: 100 } }}
                            helperText="Enter a value between 0 and 100"
                        />
                    </Grid>
                )}

                {goalData._blft_ab_goal_type === 'time_on_page' && (
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            margin="normal"
                            name="_blft_ab_goal_top_seconds"
                            label="Time on Page (seconds)"
                            type="number"
                            value={goalData._blft_ab_goal_top_seconds || ''}
                            onChange={handleInputChange}
                            InputProps={{ inputProps: { min: 0 } }}
                        />
                    </Grid>
                )}

                {goalData._blft_ab_goal_type === 'custom_js_event' && (
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            margin="normal"
                            name="_blft_ab_goal_cje_event_name"
                            label="Custom JavaScript Event Name"
                            value={goalData._blft_ab_goal_cje_event_name || ''}
                            onChange={handleInputChange}
                            helperText="e.g., myCustomConversionEvent"
                        />
                    </Grid>
                )}
            </Grid>
        </Box>
    );
};

export default TestFormGoals;