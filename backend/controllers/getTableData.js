const sheets = require('../config/googleServiceAccount');
const spreadsheetId = process.env.SPREADSHEET_ID;
const mainSheetName = process.env.SHEET_NAME;
const eventSheetName = "Event 2024"; // Sheet for event name lookup
const { setCache, getCache } = require('../utils/cacheUtils');

// --- Helper Function to Fetch Data ---
const fetchSheetData = async (sheetName, range) => {
    try {
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId,
            range: `${sheetName}!${range}`,
        });
        return response.data.values || [];
    } catch (error) {
        console.error(`Error fetching data from Google Sheets (Sheet: ${sheetName}, Range: ${range}):`, error);
        throw new Error(`Failed to fetch data from Google Sheets (Sheet: ${sheetName})`);
    }
};

// --- Helper Function to Create Event Name Map ---
const fetchEventNamesMap = async () => {
    const cacheKey = 'eventNamesMap';
    const cachedMap = getCache(cacheKey);
    if (cachedMap) {
        return new Map(cachedMap);
    }
    const eventNameRows = await fetchSheetData(eventSheetName, 'B2:C');
    const eventNamesMap = new Map();
    if (eventNameRows && eventNameRows.length > 0) {
        eventNameRows.forEach(row => {
            if (row[0] && row[1]) {
                eventNamesMap.set(String(row[0]).trim(), String(row[1]).trim());
            }
        });
    }
    setCache(cacheKey, Array.from(eventNamesMap.entries()), 3600 * 6); // Cache for 6 hours
    return eventNamesMap;
};

// --- Helper Function to Parse Numeric Values ---
const parseNumericValue = (value) => {
    if (value === null || typeof value === 'undefined' || String(value).trim() === '') {
        return 0;
    }
    const cleanedString = String(value).replace(/,/g, ''); // Only remove commas for parsing
    const num = parseFloat(cleanedString);
    return isNaN(num) ? 0 : num;
};

// --- Main Route Handler ---
const getTableData = async (req, res) => {
    const mainSheetRange = 'A2:X';
    const cacheKey = 'aggregatedTableData_v2'; // New key for the new data structure
    let allAggregatedData = [];

    try {
        const cachedData = getCache(cacheKey);
        if (cachedData) {
            allAggregatedData = cachedData;
        } else {
            const [eventNamesMap, rawDataFromMainSheet] = await Promise.all([
                fetchEventNamesMap(),
                fetchSheetData(mainSheetName, mainSheetRange)
            ]);

            if (rawDataFromMainSheet.length === 0) {
                return res.status(200).json({
                    status: 'success',
                    data: [],
                    pagination: { totalItems: 0, totalPages: 0, currentPage: 1, limit: parseInt(req.query.limit, 10) || 20 }
                });
            }

            const aggregatedMap = new Map();
            rawDataFromMainSheet.forEach(row => {
                const id = row[0] ? String(row[0]).trim() : null;
                if (!id) return; // Skip rows without an ID

                const name = eventNamesMap.get(id) || 'Unknown Event';

                if (!aggregatedMap.has(id)) {
                    aggregatedMap.set(id, {
                        id,
                        name,
                        startDate: row[2] || null,
                        endDate: row[3] || null,
                        payload: { baseline: 0, event: 0, delta: 0 },
                        revenue: { baseline: 0, event: 0, delta: 0 },
                        user: { baseline: 0, event: 0, delta: 0 },
                    });
                }
                
                // Aggregate metrics for each row
                const currentEntry = aggregatedMap.get(id);
                // Payload: F=baseline, G=event, H=delta
                currentEntry.payload.baseline += parseNumericValue(row[5]);
                currentEntry.payload.event += parseNumericValue(row[6]);
                currentEntry.payload.delta += parseNumericValue(row[7]);
                
                // Revenue: I=baseline, J=event, K=delta
                currentEntry.revenue.baseline += parseNumericValue(row[8]);
                currentEntry.revenue.event += parseNumericValue(row[9]);
                currentEntry.revenue.delta += parseNumericValue(row[10]);
                
                // User: L=baseline, M=event, N=delta
                currentEntry.user.baseline += parseNumericValue(row[11]);
                currentEntry.user.event += parseNumericValue(row[12]);
                currentEntry.user.delta += parseNumericValue(row[13]);
            });

            allAggregatedData = Array.from(aggregatedMap.values());
            setCache(cacheKey, allAggregatedData, 900); // Cache aggregated data for 1 hour
        }

        // --- Apply Search ---
        const { searchQuery } = req.query;
        let dataToProcess = [...allAggregatedData];

        if (searchQuery && typeof searchQuery === 'string' && searchQuery.trim() !== '') {
            const lowerCaseSearchQuery = searchQuery.toLowerCase().trim();
            dataToProcess = allAggregatedData.filter(item => 
                String(item.name).toLowerCase().includes(lowerCaseSearchQuery) ||
                String(item.id).toLowerCase().includes(lowerCaseSearchQuery)
            );
        }

        // --- Apply Sorting ---
        const { sortBy, sortOrder = 'asc' } = req.query;
        let sortedData = [...dataToProcess];

        if (sortBy && typeof sortedData[0]?.[sortBy] !== 'undefined') {
            const metricFields = ['revenue', 'payload', 'user'];

            sortedData.sort((a, b) => {
                let valA, valB;
                // If sorting by a metric field, use its delta value
                if (metricFields.includes(sortBy)) {
                    valA = a[sortBy]?.delta ?? 0;
                    valB = b[sortBy]?.delta ?? 0;
                } else {
                    valA = a[sortBy];
                    valB = b[sortBy];
                }
                
                let comparison = 0;
                if (typeof valA === 'number' && typeof valB === 'number') {
                    comparison = valA - valB;
                } else if (sortBy === 'startDate' || sortBy === 'endDate') {
                    const dateA = new Date(valA || 0);
                    const dateB = new Date(valB || 0);
                    comparison = dateA.getTime() - dateB.getTime();
                } else {
                    const strA = String(valA ?? '');
                    const strB = String(valB ?? '');
                    comparison = strA.localeCompare(strB, undefined, { sensitivity: 'base' });
                }

                return sortOrder.toLowerCase() === 'desc' ? (comparison * -1) : comparison;
            });
        }

        // --- Apply Pagination ---
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 20;
        const totalItems = sortedData.length;
        const totalPages = Math.ceil(totalItems / limit);
        const startIndex = (page - 1) * limit;
        const paginatedData = sortedData.slice(startIndex, totalPages > 0 ? startIndex + limit : 0);

        // --- Send Response ---
        return res.status(200).json({
            status: 'success',
            data: paginatedData,
            pagination: {
                totalItems,
                totalPages,
                currentPage: page,
                limit
            }
        });

    } catch (error) {
        console.error('Error processing table data:', error);
        return res.status(500).json({
            status: 'error',
            message: 'Failed to retrieve or process table data. ' + error.message
        });
    }
};

module.exports = {
    getTableData
};
