// InfoContent.js
import { useState, useEffect } from 'react';
// import { LineChart } from '@mui/x-charts/LineChart';
import { Card, CardContent, Typography, Grid2, Button, ButtonGroup, useTheme } from '@mui/material';
import { fetchGraphData, GraphData } from '../api/graphData';
import Chart from 'react-apexcharts';





// const getRandomData = () => Array.from({ length: 12 }, () => Math.floor(Math.random() * (5000 - 1000 + 1)) + 1000);

// const database = {
//     data1: {
//         regionEJ: getRandomData(),
//         regionCJ: getRandomData(),
//         regionBN: getRandomData(),
//     },
//     data2: {
//         regionEJ: getRandomData(),
//         regionCJ: getRandomData(),
//         regionBN: getRandomData(),
//     },
//     data3: {
//         regionEJ: getRandomData(),
//         regionCJ: getRandomData(),
//         regionBN: getRandomData(),
//     },
//     dataUser: {
//         regionEJ: getRandomData(),
//         regionCJ: getRandomData(),
//         regionBN: getRandomData(),
//     },
//     dataPayload: {
//         regionEJ: getRandomData(),
//         regionCJ: getRandomData(),
//         regionBN: getRandomData(),
//     },
// };

export const GraphPage2 = () => {
    const [graphData, setGraphData] = useState<GraphData | null>(null);
    const [activeDataKey, setActiveDataKey] = useState<string>('data1');
    const [data, setData] = useState<{ regionEJ: number[], regionCJ: number[], regionBN: number[] }>({ regionEJ: [], regionCJ: [], regionBN: [] }); // Set the default data

    useEffect(() => {
        const fetchData = async () => {
            const data = await fetchGraphData();
            setGraphData(data);
        };
        fetchData();
    }, []);


    const xLabels = [
        'JAN',
        'FEB',
        'MAR',
        'APR',
        'MAY',
        'JUN',
        'JUL',
        'AUG',
        'SEP',
        'OCT',
        'NOV',
        'DEC',
    ];

    const theme = useTheme();
    const monthsOfYear = [
        "January", "February", "March", "April", "May", "June", 
        "July", "August", "September", "October", "November", "December"
    ];
    
    // Function to extract data for a region, ensuring 12 months of data
    const extractRegionData = (region: string) => {
        const regionData = graphData?.data.find(r => r.region === region);
        if (!regionData) {
            return { revenue: Array(12).fill(null), profitability: Array(12).fill(null), opex: Array(12).fill(null), dataUser: Array(12).fill(null), dataPayload: Array(12).fill(null) };
        }
    
        // Initialize arrays for each category, filled with null for all 12 months
        const revenue = Array(12).fill(0);
        const profitability = Array(12).fill(0);
        const opex = Array(12).fill(0);
        const dataUser = Array(12).fill(0);
        const dataPayload = Array(12).fill(0);
    
        // Iterate over the months and update the arrays with actual data
        regionData.months.forEach((monthData) => {
            const monthIndex = monthsOfYear.indexOf(monthData.month);
            if (monthIndex !== -1) {
                revenue[monthIndex] = monthData.revenue;
                profitability[monthIndex] = monthData.profitability;
                opex[monthIndex] = monthData.opex;
                dataUser[monthIndex] = monthData.user;
                dataPayload[monthIndex] = monthData.payload;
            }
        });
    
        return { revenue, profitability, opex, dataUser, dataPayload };
    };

    const database = {
        data1: {
            regionEJ: extractRegionData("Jawa Timur").revenue,
            regionCJ: extractRegionData("Jawa Tengah").revenue,
            regionBN: extractRegionData("Bali Nusra").revenue,
        },
        data2: {
            regionEJ: extractRegionData("Jawa Timur").profitability,
            regionCJ: extractRegionData("Jawa Tengah").profitability,
            regionBN: extractRegionData("Bali Nusra").profitability,
        },
        data3: {
            regionEJ: extractRegionData("Jawa Timur").opex,
            regionCJ: extractRegionData("Jawa Tengah").opex,
            regionBN: extractRegionData("Bali Nusra").opex,
        },
        dataUser: {
            regionEJ: extractRegionData("Jawa Timur").dataUser,
            regionCJ: extractRegionData("Jawa Tengah").dataUser,
            regionBN: extractRegionData("Bali Nusra").dataUser,
        },
        dataPayload: {
            regionEJ: extractRegionData("Jawa Timur").dataPayload,
            regionCJ: extractRegionData("Jawa Tengah").dataPayload,
            regionBN: extractRegionData("Bali Nusra").dataPayload,
        },
    };

    useEffect(() => {
        if (graphData) {
            setData(database.data1);
        }
    }, [graphData]);
      
    const handleDataChange = (key: string) => {
      setActiveDataKey(key);
      setData(database[key as keyof typeof database]); // Set the selected data
    };

    const options: ApexCharts.ApexOptions = {
        chart: {
            foreColor: theme.palette.mode === 'light' ? '#000' : '#ccc',
            id:'spline-area-chart',
            toolbar:{
                show:true,
            },
          },
          stroke: {
            curve: 'smooth'
          },
          xaxis: {
            categories: xLabels
          },    
          fill: {
            type: 'gradient',
            gradient: {
              shade: 'dark', // Use dark gradient in dark mode
              type: 'vertical',
              shadeIntensity: theme.palette.mode === 'light' ? 0.7 : 0.5,
              gradientToColors: theme.palette.mode === 'light'
                ? ['#1a73e8', '#4285f4'] // Dark mode gradient colors
                : ['#85d8ce', '#7cdb86'], // Light mode gradient colors
              opacityFrom: theme.palette.mode === 'light' ? 0.5 : 0.7,
              opacityTo: theme.palette.mode === 'light' ? 0.1 : 0.3,
              stops: [0, 90, 100],
            },
        },
        dataLabels:{
            enabled: false
        },   
        yaxis: {
            labels: {
              formatter: (val) => {
                const absVal = Math.abs(val);
                if (absVal >= 1000000000) {
                  return (val / 1000000000).toFixed(1) + 'B'; // Convert to billions
                } else if (absVal >= 1000000) {
                  return (val / 1000000).toFixed(1) + 'M'; // Convert to millions
                } else if (absVal >= 100000) {
                  return (val / 1000).toFixed(1) + 'K'; // Convert to thousands
                }
                return val.toFixed(0); // For smaller numbers, display as is
              },
            },
          },
          tooltip: {
            theme: theme.palette.mode === 'light' ? 'light' : 'dark',
            shared: true,
          }
  }

  const series = [
      {
          name: 'East Java',
          data: data.regionEJ,
      },
      {
          name: 'Center Java',
          data: data.regionCJ,
      },
      {
          name: 'Bali Nusra',
          data: data.regionBN,
      },
  ]

    return (
        <div>
        <Card className='card-chart' sx={{margin: 2, boxShadow: 5, borderRadius: 4}}>
            <CardContent>
                <Grid2 container alignItems={"center"} justifyContent={"space-between"}>
                    <Grid2 size={{xs:6}}>
                        <Typography variant='subtitle1'>Total Revenue</Typography>
                        <Typography variant='h5'>Performance</Typography>
                    </Grid2>
                    <Grid2 textAlign={"right"} >
                        <ButtonGroup>
                            <Button
                                variant={activeDataKey === 'data1' ? "contained" : "outlined"}
                                onClick={() => handleDataChange('data1')}
                                color="primary"
                                size="small"
                            >
                                <Typography>Revenue</Typography>
                            </Button>
                            <Button
                                variant={activeDataKey === 'data2' ? "contained" : "outlined"}
                                onClick={() => handleDataChange('data2')}
                                color="primary"
                                size="small"
                            >
                                <Typography>Profitability</Typography>
                            </Button>
                            <Button
                                variant={activeDataKey === 'data3' ? "contained" : "outlined"}
                                onClick={() => handleDataChange('data3')}
                                color="primary"
                                size="small"
                            >
                                
                                <Typography>OPEX</Typography>
                            </Button>
                        </ButtonGroup>
                    </Grid2>
                </Grid2>
                    <Chart
                        options={options}
                        series={series}
                        height={350}
                        type='area'
                    />
                {/* <LineGraph options={options}/> */}
            </CardContent>
        </Card>
        <Grid2 container>
            <Grid2 size={{xs:12, sm:12, md:12, lg:6}}>
                <Card className='card-chart' sx={{margin: 2, boxShadow: 5, borderRadius: 4}}>
                    <CardContent>
                        <Grid2 size={{xs:6}}>
                            <Typography variant='subtitle1'>Total Payload</Typography>
                            <Typography variant='h5'>Performance</Typography>
                        </Grid2>
                        <Chart
                            options={options}
                            series={[
                            { data: database.dataPayload.regionEJ, name: 'East Java'},
                            { data: database.dataPayload.regionCJ, name: 'Central Java'},
                            { data: database.dataPayload.regionBN, name: 'Bali Nusra'},
                            ]}
                            height={300}
                            type='area'
                        />
                    </CardContent>
                </Card>
            </Grid2>
            <Grid2 size={{xs:12, sm:12, md:12, lg:6}}>
                <Card className='card-chart' sx={{margin: 2, boxShadow: 5, borderRadius: 4}}>
                    <CardContent>
                        <Grid2 size={{xs:6}}>
                            <Typography variant='subtitle1'>Total User</Typography>
                            <Typography variant='h5'>Performance</Typography>
                        </Grid2>
                        <Chart
                            options={options}
                            series={[
                            { data: database.dataUser.regionEJ, name: 'East Java'},
                            { data: database.dataUser.regionCJ, name: 'Central Java'},
                            { data: database.dataUser.regionBN, name: 'Bali Nusra'},
                            ]}
                            height={300}
                            type='area'
                        />
                    </CardContent>
                </Card>
            </Grid2>
        </Grid2>
        </div>
    );
};
