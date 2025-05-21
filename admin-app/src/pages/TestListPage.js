import React, { useState, useEffect, useCallback } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  CircularProgress,
  Alert,
  IconButton,
  Tooltip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import { fetchTests, deleteTest, updateTest } from '../services/api';

const TestListPage = () => {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const navigate = useNavigate();

  const loadTests = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Note: The API currently doesn't support pagination from TestController's get_items
      // We'll fetch all and paginate client-side for now, or adjust API later.
      const response = await fetchTests({
        // per_page: rowsPerPage, 
        // page: page + 1, 
        // orderby: 'date', 
        // order: 'desc'
      });
      console.log('Fetched tests:', response.data);
      if (Array.isArray(response.data)) {
        setTests(response.data);
      } else {
        console.error("Fetched data is not an array:", response.data);
        setTests([]);
        setError("Received unexpected data format from server.");
      }
    } catch (err) {
      console.error('Error fetching tests:', err);
      setError(err.message || 'Failed to fetch tests.');
      setTests([]);
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage]); // Dependencies for API-side pagination if implemented

  useEffect(() => {
    loadTests();
  }, [loadTests]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDeleteTest = async (id) => {
    if (window.confirm('Are you sure you want to delete this test?')) {
      try {
        await deleteTest(id);
        console.log(`Test ${id} deleted`);
        loadTests(); // Refresh list
      } catch (err) {
        console.error(`Error deleting test ${id}:`, err);
        setError(err.message || `Failed to delete test ${id}.`);
      }
    }
  };
  
  const handleToggleStatus = async (test) => {
    const newStatus = test.meta._blft_ab_status === 'running' ? 'paused' : 'running';
    if (!['draft', 'running', 'paused'].includes(test.meta._blft_ab_status)) {
        alert(`Cannot toggle status for a test that is '${test.meta._blft_ab_status}'.`);
        return;
    }
    if (window.confirm(`Are you sure you want to change status to '${newStatus}'?`)) {
        try {
            await updateTest(test.id, { meta: { ...test.meta, _blft_ab_status: newStatus } });
            console.log(`Test ${test.id} status changed to ${newStatus}`);
            loadTests();
        } catch (err) {
            console.error(`Error updating test ${test.id} status:`, err);
            setError(err.message || `Failed to update test ${test.id} status.`);
        }
    }
  };


  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}><CircularProgress /></Box>;
  }

  return (
    <Paper sx={{ p: 2, m: 1 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5" component="h1">
          A/B Tests
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          component={RouterLink}
          to="/tests/new"
        >
          Create New Test
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <TableContainer>
        <Table stickyHeader aria-label="a/b tests table">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Variants</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tests.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((test) => (
              <TableRow hover key={test.id}>
                <TableCell component="th" scope="row">
                  {/* Ensure we are rendering a string. test.title from API is an object { raw: ..., rendered: ... } */}
                  {(test.title && typeof test.title.rendered === 'string') ? test.title.rendered : '(No Title)'}
                </TableCell>
                <TableCell>{test.meta?._blft_ab_status || 'N/A'}</TableCell>
                <TableCell>
                  {test.meta?._blft_ab_variants?.length || 0}
                </TableCell>
                <TableCell>
                  { (test.meta?._blft_ab_status === 'running' || test.meta?._blft_ab_status === 'paused' || test.meta?._blft_ab_status === 'draft') && (
                    <Tooltip title={test.meta._blft_ab_status === 'running' ? "Pause Test" : "Start/Resume Test"}>
                      <IconButton onClick={() => handleToggleStatus(test)} size="small">
                        {test.meta._blft_ab_status === 'running' ? <PauseIcon /> : <PlayArrowIcon />}
                      </IconButton>
                    </Tooltip>
                  )}
                  <Tooltip title="Edit Test">
                    <IconButton component={RouterLink} to={`/tests/edit/${test.id}`} size="small">
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete Test">
                    <IconButton onClick={() => handleDeleteTest(test.id)} size="small">
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
            {tests.length === 0 && !loading && (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  No A/B tests found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={tests.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
};

export default TestListPage;