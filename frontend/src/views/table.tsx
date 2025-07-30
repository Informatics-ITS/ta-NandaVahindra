// src/components/TablePage.tsx
import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import { visuallyHidden } from '@mui/utils';
import SearchIcon from '@mui/icons-material/Search';
import Tooltip from '@mui/material/Tooltip';

import {
    fetchEventsData,
    Event as ApiEventData, // Renamed import to avoid conflict
    FetchEventsParams,
    Metric, // Import the new Metric interface
} from '../api/tableData'; // Adjust path as needed
import { debounce, InputAdornment, TextField } from '@mui/material';

// --- UPDATED: Data interface to use the Metric type ---
interface Data {
    number: number;
    id: string | null;
    name: string | null;
    startDate: string | null;
    endDate: string | null;
    payload: Metric;
    revenue: Metric;
    user: Metric;
}

type Order = 'asc' | 'desc';

interface HeadCell {
    disablePadding: boolean;
    id: keyof Data;
    label: string;
    numeric: boolean;
    sortable?: boolean;
    minWidth?: number;
    visible?: boolean;
}

const headCellsConfig: readonly HeadCell[] = [
    { id: 'number', numeric: false, disablePadding: true, label: 'No.', sortable: false },
    { id: 'id', numeric: false, disablePadding: true, label: 'Event ID', sortable: true, minWidth: 150, visible: false },
    { id: 'name', numeric: false, disablePadding: true, label: 'Event Name', sortable: true, minWidth: 150 },
    { id: 'startDate', numeric: false, disablePadding: false, label: 'Start Date', sortable: true, minWidth: 150 },
    { id: 'endDate', numeric: false, disablePadding: false, label: 'End Date', sortable: true, minWidth: 150 },
    { id: 'revenue', numeric: true, disablePadding: false, label: 'Revenue', sortable: true, minWidth: 150 }, // Set to numeric for alignment
    { id: 'user', numeric: true, disablePadding: false, label: 'User', sortable: true, minWidth: 150 }, // Set to numeric and sortable
    { id: 'payload', numeric: true, disablePadding: false, label: 'Payload', sortable: true, minWidth: 150 },// Set to numeric for alignment
];

interface EnhancedTableProps {
    onRequestSort: (event: React.MouseEvent<unknown>, property: keyof Data) => void;
    order: Order;
    orderBy: keyof Data;
    visibleHeadCells: readonly HeadCell[];
}

function EnhancedTableHead(props: EnhancedTableProps) {
    const { order, orderBy, onRequestSort, visibleHeadCells } = props;
    const createSortHandler =
        (property: keyof Data) => (event: React.MouseEvent<unknown>) => {
            const column = visibleHeadCells.find(hc => hc.id === property);
            if (column && column.sortable !== false) {
                onRequestSort(event, property);
            }
        };

    return (
        <TableHead>
            <TableRow sx={{
                '& th': {
                    backgroundColor: 'background.default',
                    fontWeight: 'bold',
                },
                '& th .MuiTableSortLabel-root': {
                    color: 'text.primary',
                    '&:hover': {
                        color: 'text.secondary',
                    },
                },
                '& th .MuiTableSortLabel-icon': {
                    color: 'action.active !important',
                },
            }}>
                {visibleHeadCells.map((headCell) => (
                    <TableCell
                        key={`header-${headCell.id}`}
                        align={headCell.numeric ? 'right' : 'left'}
                        padding={'normal'}
                        sortDirection={headCell.sortable !== false && orderBy === headCell.id ? order : false}
                        sx={{ minWidth: headCell.minWidth }}
                    >
                        {headCell.sortable !== false ? (
                            <TableSortLabel
                                active={orderBy === headCell.id}
                                direction={orderBy === headCell.id ? order : 'asc'}
                                onClick={createSortHandler(headCell.id)}
                            >
                                {headCell.label}
                                {orderBy === headCell.id ? (
                                    <Box component="span" sx={visuallyHidden}>
                                        {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                    </Box>
                                ) : null}
                            </TableSortLabel>
                        ) : (
                            headCell.label
                        )}
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}

// Utility function to format numbers with German locale
const formatNumber = (input: string | null | undefined): string => {
    if (input === null || typeof input === 'undefined' || String(input).trim() === '') return 'N/A';
    const cleanedNumber = Number(String(input).replace(/,/g, ''));
    if (isNaN(cleanedNumber)) {
        return String(input); // Return original string if not a valid number
    }
    return cleanedNumber.toLocaleString('de-DE');
};


export const TablePage = () => {
    const [order, setOrder] = useState<Order>('asc');
    const [orderBy, setOrderBy] = useState<keyof Data>('startDate');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [dense, setDense] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const [apiRows, setApiRows] = useState<Data[]>([]);
    const [rowCount, setRowCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const prevSearchQueryRef = useRef<string>(searchQuery);
    const visibleHeadCells = useMemo(() => headCellsConfig.filter(cell => cell.visible !== false), []);

    // Core data loading function
    const loadData = useCallback(async (query: string, currentPage: number, currentRowsPerPage: number, currentOrderBy: keyof Data, currentOrder: Order) => {
        setLoading(true);
        setError(null);
        const params: FetchEventsParams = {
            currentPage: currentPage + 1,
            itemsPerPage: currentRowsPerPage,
            sortBy: currentOrderBy as string,
            sortOrder: currentOrder,
            searchQuery: query,
        };

        try {
            const { events: fetchedEvents, pagination: fetchedPagination } = await fetchEventsData(params);
            
            // --- UPDATED: Map the full event object ---
            setApiRows(fetchedEvents.map((event: ApiEventData, index: number) => ({
                number: currentPage * currentRowsPerPage + index + 1,
                id: event.id,
                name: event.name,
                startDate: event.startDate,
                endDate: event.endDate,
                // Assign the entire metric object
                payload: event.payload,
                revenue: event.revenue,
                user: event.user,
            })));
            setRowCount(fetchedPagination.totalItems || 0);
        } catch (err: any) {
            console.error("Failed to fetch table data:", err);
            setError(err.message || "An unknown error occurred.");
            setApiRows([]);
            setRowCount(0);
        } finally {
            setLoading(false);
        }
    }, []);

    const debouncedLoadDataForSearch = useCallback(
        debounce((query: string) => {
            loadData(query, 0, rowsPerPage, orderBy, order);
        }, 500),
        [rowsPerPage, orderBy, order, loadData]
    );

    useEffect(() => {
        const searchQueryChanged = prevSearchQueryRef.current !== searchQuery;
        if (searchQueryChanged) {
            debouncedLoadDataForSearch(searchQuery);
        } else {
            loadData(searchQuery, page, rowsPerPage, orderBy, order);
        }
        prevSearchQueryRef.current = searchQuery;
    }, [page, rowsPerPage, orderBy, order, searchQuery, loadData, debouncedLoadDataForSearch]);


    const handleRequestSort = (_event: React.MouseEvent<unknown>, property: keyof Data) => {
        const column = visibleHeadCells.find(hc => hc.id === property);
        if (column && column.sortable === false) return;
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
        setPage(0);
    };

    const handleChangePage = (_event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value);
        setPage(0);
    };

    const handleChangeDense = (event: React.ChangeEvent<HTMLInputElement>) => {
        setDense(event.target.checked);
    };

    if (loading && apiRows.length === 0 && searchQuery === '') {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                <CircularProgress />
                <Typography sx={{ ml: 2 }}>Loading events...</Typography>
            </Box>
        );
    }

    if (error) {
        return <Box sx={{ p: 3 }}><Alert severity="error">Error fetching data: {error}</Alert></Box>;
    }

    return (
        <Box sx={{ width: '100%', p: 2 }}>
            <Paper sx={{ width: '100%', mb: 2, overflow: 'hidden' }}>
                <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                    <Typography variant="h6" id="tableTitle" component="div">Event List</Typography>
                    <TextField
                        variant="outlined"
                        size="small"
                        placeholder="Search event..."
                        value={searchQuery}
                        onChange={handleSearchChange}
                        InputProps={{
                            startAdornment: (<InputAdornment position="start"><SearchIcon /></InputAdornment>),
                        }}
                        sx={{ width: { xs: '100%', sm: 300, md: 400 } }}
                    />
                </Box>
                <TableContainer sx={{ maxHeight: 500 }}>
                    <Table stickyHeader sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size={dense ? 'small' : 'medium'}>
                        <EnhancedTableHead
                            order={order}
                            orderBy={orderBy}
                            onRequestSort={handleRequestSort}
                            visibleHeadCells={visibleHeadCells}
                        />
                        <TableBody>
                            {loading && (
                                <TableRow>
                                    <TableCell colSpan={visibleHeadCells.length} align="center" sx={{ py: 3 }}>
                                        <CircularProgress size={24} />
                                        <Typography variant="caption" sx={{ ml: 1, display: 'block' }}>Refreshing...</Typography>
                                    </TableCell>
                                </TableRow>
                            )}
                            {!loading && apiRows.length === 0 && (
                                 <TableRow>
                                    <TableCell colSpan={visibleHeadCells.length} align="center" sx={{ py: 3 }}>
                                        <Typography>No events found.</Typography>
                                    </TableCell>
                                </TableRow>
                            )}
                            {!loading && apiRows.map((row) => {
                                const uniqueKey = row.id ? `event-${row.id}-${row.number}` : `event-num-${row.number}`;
                                return (
                                    <TableRow hover role="row" tabIndex={-1} key={uniqueKey} sx={{ cursor: 'default' }}>
                                        {visibleHeadCells.map((headCell) => {
                                            const cellValue = row[headCell.id];
                                            let displayValue: string | React.ReactNode;
                                            let tooltipContent: React.ReactNode = null;
                                            
                                            // --- UPDATED: Logic to handle metric objects and generate dynamic tooltips ---
                                            if (headCell.id === 'revenue' || headCell.id === 'payload' || headCell.id === 'user') {
                                                const metricData = cellValue as Metric;
                                                displayValue = formatNumber(metricData?.delta);

                                                tooltipContent = (
                                                    <Box sx={{ textAlign: 'left', p: 0.5 }}>
                                                        <strong>{headCell.label} Details</strong><br />
                                                        Baseline: {formatNumber(metricData?.baseline)}<br />
                                                        Event: {formatNumber(metricData?.event)}<br />
                                                        Delta: {formatNumber(metricData?.delta)}
                                                    </Box>
                                                );
                                            } else {
                                                displayValue = cellValue !== null && typeof cellValue !== 'undefined' ? String(cellValue) : 'N/A';
                                            }

                                            return (
                                                <TableCell
                                                    key={`cell-${row.number}-${headCell.id}`}
                                                    align={headCell.numeric ? 'right' : 'left'}
                                                    padding={'normal'}
                                                >
                                                    {tooltipContent ? (
                                                        <Tooltip title={tooltipContent} arrow>
                                                            <span>{displayValue}</span>
                                                        </Tooltip>
                                                    ) : (
                                                        displayValue
                                                    )}
                                                </TableCell>
                                            );
                                        })}
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25, 50]}
                    component="div"
                    count={rowCount}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    labelRowsPerPage="Rows per page:"
                    labelDisplayedRows={({ from, to, count }) => `${from}-${to} of ${count !== -1 ? count : `more than ${to}`}`}
                />
            </Paper>
            <FormControlLabel
                control={<Switch checked={dense} onChange={handleChangeDense} />}
                label="Dense padding"
            />
        </Box>
    );
};

