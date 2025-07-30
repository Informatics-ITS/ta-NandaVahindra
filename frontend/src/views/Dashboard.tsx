// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useState, useEffect, useCallback } from 'react';
import Box from "@mui/material/Box";
import { MultipleSelectChip } from '../components/MultipleSelect';
import { DashboardBox } from "../components/DashboardBox";
import Grid from '@mui/material/Grid2';
import { CardPrimary } from "../components/CardPrimary";
import { ActionSummary } from '../components/ActionSummary';
// Import Dialog components
import { Button, Dialog, DialogTitle, DialogContent, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useTheme } from '@mui/material';
import { fetchMonths, MonthOption } from '../api/monthFilter';
import { fetchCategory, CategoryOption } from '../api/categoryFilter';
import { fetchAction, ActionOption } from '../api/actionFilter';
import { fetchEventsArea, EventsAreaData } from '../api/eventsAreaData';
import { fetchEventsRegionEJ, EventsRegionEJData } from '../api/eventsRegionEJData';
import { fetchEventsRegionCJ, EventsRegionCJData } from '../api/eventsRegionCJData';
import { fetchEventsRegionBN, EventsRegionBNData } from '../api/eventsRegionBNData';
import { fetchActionSummary, ActionSummaryData } from '../api/actionSummary';
import optimImage from '../assets/optim.png';
import combatImage from '../assets/combat.png';
import cmonImage from '../assets/cmon.png';
import easymacroImage from '../assets/easymacro.png';
import massivemimoImage from '../assets/massivemimo.png';
import addneImage from '../assets/addne.png';
import repeaterImage from '../assets/repeater.png';
import RegionDetails from '../components/RegionDetails';

const Dashboard = () => {
    const [selectedMonths, setSelectedMonths] = useState<string[]>([]);
    const handleMonthChange = (selectedMonths: string[]) => {
        setSelectedMonths(selectedMonths);
    }
    const [selectedCategory, setSelectedCategory] = useState<string[]>([]);
    const handleCategoryChange = (selectedCategory: string[]) => {
        setSelectedCategory(selectedCategory);
    }
    const [selectedAction, setSelectedAction] = useState<string[]>([]);
    const handleActionChange = (selectedAction: string[]) => {
        setSelectedAction(selectedAction);
    }
    const [month, setMonth] = useState('');
    const [category, setCategory] = useState('');
    const [action, setAction] = useState('');
    const [monthOptions, setMonthOptions] = useState<MonthOption[]>([]);
    const [categoryOptions, setCategoryOptions] = useState<CategoryOption[]>([]);
    const [actionOptions, setActionOptions] = useState<ActionOption[]>([]);
    const [eventsData, setEventsData] = useState<EventsAreaData | null>(null);
    const [eventsEJData, setEventsEJData] = useState<EventsRegionEJData | null>(null);
    const [eventsCJData, setEventsCJData] = useState<EventsRegionCJData | null>(null);
    const [eventsBNData, setEventsBNData] = useState<EventsRegionBNData | null>(null);
    const [actionSummary, setActionSummary] = useState<ActionSummaryData | null>(null);
    const [selectedRegion, setSelectedRegion] = useState<string | null>(null);

    // Fetch the months data on component mount
    useEffect(() => {
        const loadFilterAndEventsData = async () => {
            try {
                // Fetch all filters and event data in parallel
                const [months, categories, actions, actionSummary, data, dataEJ, dataCJ, dataBN] = await Promise.all([
                    fetchMonths(),
                    fetchCategory(),
                    fetchAction(),
                    fetchActionSummary(),
                    fetchEventsArea(month, category, action),
                    fetchEventsRegionEJ(month, category, action),
                    fetchEventsRegionCJ(month, category, action),
                    fetchEventsRegionBN(month, category, action),
                ]);

                // Set filter data
                setMonthOptions(months);
                setCategoryOptions(categories);
                setActionOptions(actions);
                setActionSummary(actionSummary);

                // Set event data
                setEventsData(data);
                setEventsEJData(dataEJ);
                setEventsCJData(dataCJ);
                setEventsBNData(dataBN);
            } catch (error) {
                console.error('Failed to load filters or event data:', error);
            }
        };

        loadFilterAndEventsData(); // Call the function to fetch filters and events data

        // Update the query params based on selected filters
        const monthParam = selectedMonths.join(',');
        const categoryParam = selectedCategory.join(',');
        const actionParam = selectedAction.join(',');
        setMonth(monthParam);
        setCategory(categoryParam);
        setAction(actionParam);
    }, [selectedMonths, selectedCategory, selectedAction, month, category, action]);

    // Fetch the events data when the month, category, or action changes
    const loadEventsData = useCallback(async () => {
        // const startTime = performance.now();  // Record start time
        try {
            // Fetch all event data in parallel
            const [data, dataEJ, dataCJ, dataBN] = await Promise.all([
                fetchEventsArea(month, category, action),
                fetchEventsRegionEJ(month, category, action),
                fetchEventsRegionCJ(month, category, action),
                fetchEventsRegionBN(month, category, action)
            ]);
            setEventsData(data); // Update event data
            setEventsEJData(dataEJ); // Update EJ event data
            setEventsCJData(dataCJ); // Update CJ event data
            setEventsBNData(dataBN); // Update BN event data
        } catch (error) {
            console.error('Failed to fetch event data:', error);
        } finally {
            // const endTime = performance.now();  // Record end time
            // const duration = endTime - startTime;  // Calculate the difference
            // console.log(`API request completed in ${duration.toFixed(2)}ms`);
        }
    }, [month, category, action]);  // Dependency array: re-fetch data whenever these change

    const clearFilters = () => {
        setMonth('');       // Reset month to empty
        setCategory('');    // Reset category to empty
        setAction('');      // Reset action to empty
        setSelectedMonths([]); // Reset selected months
        setSelectedCategory([]); // Reset selected categories
        setSelectedAction([]); // Reset selected actions
        loadEventsData();   // Optionally reload data without filters
    };

    const theme = useTheme();
    const backgroundColor = theme.palette.mode === 'light' ? 'white' : '#1a2232';
    const textColor = theme.palette.mode === 'light' ? 'grey.900' : 'white';

    type OverviewItem = {
        desc: string;
        value: string;
        growth?: string;
      };
      
    // Function to create the overview array with customizable unit
    const createOverview = (descriptions: string[], values: string[], unit: string, growth: number | number[] = []): OverviewItem[] => {
        const growthArray = Array.isArray(growth) ? growth : new Array(descriptions.length).fill(growth);
        return descriptions.map((desc, index) => ({
            desc,
            value: `${values[index]} ${unit}`, // Append the unit to the value
            growth: growthArray[index] !== undefined
              ? `${growthArray[index] > 0 ? '+' : ''}${growthArray[index].toFixed(2)}%`
              : '',
        }));
      };

    const formatNumber = (num: number): string =>
    new Intl.NumberFormat('de-DE', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(num);

    const countArea = formatNumber(eventsData?.data.eventCounts || 0);
    const revenueArea = createOverview(['Revenue', 'Profitability', 'OPEX'], [formatNumber((eventsData?.data.totals.revenue || 0)/1_000_000),formatNumber((eventsData?.data.totals.profitability || 0) / 1_000_000),formatNumber((eventsData?.data.totals.opex || 0)/1_000_000)], 'Mio', [eventsData?.data.totals.revenueGrowth ?? 0]);
    const payloadArea = createOverview([''], [formatNumber((eventsData?.data.totals.payload || 0) / 1_000_000)], 'PB', [eventsData?.data.totals.payloadGrowth ?? 0]);
    const userArea = createOverview([''], [formatNumber((eventsData?.data.totals.user || 0))], '', eventsData?.data.totals.userGrowth ?? 0);
    const countEJ = formatNumber(eventsEJData?.data.eventCounts || 0);
    const revenueEJ = createOverview(['Revenue', 'Profitability', 'OPEX'], [formatNumber((eventsEJData?.data.totals.revenue || 0)/1_000_000), formatNumber((eventsEJData?.data.totals.profitability || 0) / 1_000_000), formatNumber((eventsEJData?.data.totals.opex || 0)/1_000_000)], 'Mio', [eventsEJData?.data.totals.revenueGrowth ?? 0]);
    const payloadEJ = createOverview([''], [formatNumber((eventsEJData?.data.totals.payload || 0)/1_000_000)], 'PB', [eventsEJData?.data.totals.payloadGrowth ?? 0]);
    const userEJ = createOverview([''], [formatNumber((eventsEJData?.data.totals.user || 0))], '', eventsEJData?.data.totals.userGrowth ?? 0);
    const countCJ = formatNumber(eventsCJData?.data.eventCounts || 0);
    const revenueCJ = createOverview(['Revenue', 'Profitability', 'OPEX'], [formatNumber((eventsCJData?.data.totals.revenue || 0)/1_000_000), formatNumber((eventsCJData?.data.totals.profitability || 0) / 1_000_000), formatNumber((eventsCJData?.data.totals.opex || 0)/1_000_000)], 'Mio', [eventsCJData?.data.totals.revenueGrowth ?? 0]);
    const payloadCJ = createOverview([''], [formatNumber((eventsCJData?.data.totals.payload || 0)/1_000_000)], 'PB', [eventsCJData?.data.totals.payloadGrowth ?? 0]);
    const userCJ = createOverview([''], [formatNumber((eventsCJData?.data.totals.user || 0))], '', eventsCJData?.data.totals.userGrowth ?? 0);
    const countBN = formatNumber(eventsBNData?.data.eventCounts || 0);
    const revenueBN = createOverview(['Revenue', 'Profitability', 'OPEX'], [formatNumber((eventsBNData?.data.totals.revenue || 0)/1_000_000), formatNumber((eventsBNData?.data.totals.profitability || 0) / 1_000_000), formatNumber((eventsBNData?.data.totals.opex || 0)/1_000_000)], 'Mio', [eventsBNData?.data.totals.revenueGrowth ?? 0]);
    const payloadBN = createOverview([''], [formatNumber((eventsBNData?.data.totals.payload || 0)/1_000_000)], 'PB', [eventsBNData?.data.totals.payloadGrowth ?? 0]);
    const userBN = createOverview([''], [formatNumber((eventsBNData?.data.totals.user || 0))], '', eventsBNData?.data.totals.userGrowth ?? 0);

    const data = [
        { image: optimImage, title: 'OPTIM', number: actionSummary?.data.optim ?? 0 },
        { image: combatImage, title: 'COMBAT', number: actionSummary?.data.Combat ?? 0 },
        { image: cmonImage, title: 'COMIS/CMON', number: actionSummary?.data.CMON ?? 0 },
        { image: easymacroImage, title: 'EASYMACRO/ADD SECTOR', number: actionSummary?.data.easymacro ?? 0 },
        { image: massivemimoImage, title: 'MASSIVEMIMO', number: actionSummary?.data.massivemimo ?? 0 },
        { image: addneImage, title: 'ADD NE', number: actionSummary?.data.AddNe ?? 0 },
        { image: repeaterImage, title: 'REPEATER', number: actionSummary?.data.repeater ?? 0 },
      ];

    return (
        <Box sx={{ p: 3 }}>
            <ActionSummary items={data}/>
            {/* Top Filters */}
            <Grid container spacing={2} mb={4} mt={4}>
                <Grid>
                    <MultipleSelectChip
                        label="Month"
                        value={selectedMonths}
                        options={monthOptions.map(option => option.label)}
                        onChange={handleMonthChange}
                    />
                </Grid>
                <Grid>
                    <MultipleSelectChip
                        label="Category"
                        value={selectedCategory}
                        options={categoryOptions.map(option => option.label)}
                        onChange={handleCategoryChange}
                    />
                </Grid>
                <Grid>
                    <MultipleSelectChip
                        label="Action"
                        value={selectedAction}
                        options={actionOptions.map(option => option.label)}
                        onChange={handleActionChange}
                    />
                </Grid>

                <Grid container spacing={3}>
                    <Button variant="contained" sx={{ height: '55px', color: textColor, backgroundColor: backgroundColor, borderRadius: 2, boxShadow: 1, textTransform: 'none', fontWeight: 'bold', fontSize:16,
                        transition: 'transform 0.1s ease-in-out',  // Smooth transition effect
                        '&:hover': {
                          transform: 'scale(1.1)'
                        }
                    }} onClick={clearFilters}>Clear</Button>
                </Grid>
            </Grid>

            {/* Dashboard Cards */}
            <Grid container spacing={3} justifyContent={'center'}>
                <Grid size={{xs:12, sm:12, md:6, lg:3}} sx={{ maxWidth: 400 }}>
                    <DashboardBox 
                        count={countArea} 
                        loc="Area Jawa Bali" 
                        color={['#005082', '#001F3F']}
                        onClick={() => setSelectedRegion('Area Jawa Bali')}
                    />
                </Grid>
                <Grid size={{xs:12, sm:12, md:6, lg:3}} sx={{ maxWidth: 400 }}>
                    <DashboardBox 
                        count={countEJ} 
                        loc="Region Jawa Timur" 
                        color={['#8A2BE2', '#4B0082']}
                        onClick={() => setSelectedRegion('Region Jawa Timur')}
                    />
                </Grid>
                <Grid size={{xs:12, sm:12, md:6, lg:3}} sx={{ maxWidth: 400 }}>
                    <DashboardBox 
                        count={countCJ} 
                        loc="Region Jawa Tengah" 
                        color={['#228B22', '#014421']}
                        onClick={() => setSelectedRegion('Region Jawa Tengah')}
                    />
                </Grid>
                <Grid size={{xs:12, sm:12, md:6, lg:3}} sx={{ maxWidth: 400 }}>
                    <DashboardBox 
                        count={countBN} 
                        loc="Region Bali Nusra" 
                        color={['#595959', '#2C2C2C']}
                        onClick={() => setSelectedRegion('Region Bali Nusra')}
                    />
                </Grid>
            </Grid>
            {/* Dialog for Region Details */}
            <Dialog
                open={!!selectedRegion}
                onClose={() => setSelectedRegion(null)}
                aria-labelledby="region-details-dialog-title"
                maxWidth="lg"
                fullWidth
                TransitionProps={{
                    unmountOnExit: true, // This will unmount the content immediately on close
                    timeout: 100 // Remove transition delay
                }}
            >
                {selectedRegion && ( // Wrap entire dialog content in conditional to prevent empty state
                    <>
                        <DialogTitle id="region-details-dialog-title">
                            {`Details for: ${selectedRegion}`}
                            <IconButton
                                aria-label="close"
                                onClick={() => setSelectedRegion(null)}
                                sx={{
                                    position: 'absolute',
                                    right: 8,
                                    top: 8,
                                    color: (theme) => theme.palette.grey[500],
                                }}
                            >
                                <CloseIcon />
                            </IconButton>
                        </DialogTitle>
                        <DialogContent dividers>
                            <RegionDetails
                                region={selectedRegion}
                                data={{ totalSales: "N/A", activeBranches: 0, keyMetric: "Details View Active" }}
                                onClose={() => setSelectedRegion(null)}
                            />
                        </DialogContent>
                    </>
                )}
            </Dialog>
            
            <Grid container spacing={3} mt={4} justifyContent={'center'}>
                <Grid size={{xs:12, sm:12, md:6, lg:3}} sx={{ maxWidth: 400 }}>
                    <CardPrimary title="Revenue Overview" loc="Area Jawa Bali" descValues={revenueArea} color={['#005082', '#001F3F']} />
                </Grid>
                <Grid size={{xs:12, sm:12, md:6, lg:3}} sx={{ maxWidth: 400 }}>
                    <CardPrimary title="Revenue Overview" loc="Region Jawa Timur" descValues={revenueEJ} color={['#005082', '#001F3F']} />
                </Grid>
                <Grid size={{xs:12, sm:12, md:6, lg:3}} sx={{ maxWidth: 400 }}>
                    <CardPrimary title="Revenue Overview" loc="Region Jawa Tengah" descValues={revenueCJ} color={['#005082', '#001F3F']} />
                </Grid>
                <Grid size={{xs:12, sm:12, md:6, lg:3}} sx={{ maxWidth: 400 }}>
                    <CardPrimary title="Revenue Overview" loc="Region Bali Nusra" descValues={revenueBN} color={['#005082', '#001F3F']} />
                </Grid>
            </Grid>
            <Grid container spacing={3} mt={4} justifyContent={'center'}>
                <Grid size={{xs:12, sm:12, md:6, lg:3}} sx={{ maxWidth: 400 }}>
                    <CardPrimary title="Payload Overview" loc="Area Jawa Bali" descValues={payloadArea} color={['#005082', '#001F3F']} />
                </Grid>
                <Grid size={{xs:12, sm:12, md:6, lg:3}} sx={{ maxWidth: 400 }}>
                    <CardPrimary title="Payload Overview" loc="Region Jawa Timur" descValues={payloadEJ} color={['#005082', '#001F3F']} />
                </Grid>
                <Grid size={{xs:12, sm:12, md:6, lg:3}} sx={{ maxWidth: 400 }}>
                    <CardPrimary title="Payload Overview" loc="Region Jawa Tengah" descValues={payloadCJ} color={['#005082', '#001F3F']} />
                </Grid>
                <Grid size={{xs:12, sm:12, md:6, lg:3}} sx={{ maxWidth: 400 }}>
                    <CardPrimary title="Payload Overview" loc="Region Bali Nusra" descValues={payloadBN} color={['#005082', '#001F3F']} />
                </Grid>
            </Grid>
            <Grid container spacing={3} mt={4} justifyContent={'center'}>
                <Grid size={{xs:12, sm:12, md:6, lg:3}} sx={{ maxWidth: 400 }}>
                    <CardPrimary title="User Overview" loc="Area Jawa Bali" descValues={userArea} color={['#005082', '#001F3F']} />
                </Grid>
                <Grid size={{xs:12, sm:12, md:6, lg:3}} sx={{ maxWidth: 400 }}>
                    <CardPrimary title="User Overview" loc="Region Jawa Timur" descValues={userEJ} color={['#005082', '#001F3F']} />
                </Grid>
                <Grid size={{xs:12, sm:12, md:6, lg:3}} sx={{ maxWidth: 400 }}>
                    <CardPrimary title="User Overview" loc="Region Jawa Tengah" descValues={userCJ} color={['#005082', '#001F3F']} />
                </Grid>
                <Grid size={{xs:12, sm:12, md:6, lg:3}} sx={{ maxWidth: 400 }}>
                    <CardPrimary title="User Overview" loc="Region Bali Nusra" descValues={userBN} color={['#005082', '#001F3F']} />
                </Grid>
            </Grid>
        </Box>
    );
};

export default Dashboard;