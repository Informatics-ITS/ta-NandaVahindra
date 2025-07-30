import * as React from 'react';
import { createTheme } from '@mui/material/styles';
import DashboardIcon from '@mui/icons-material/Dashboard';
// import InfoIcon from '@mui/icons-material/Info';
import { AppProvider } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import type { Navigation, Router } from '@toolpad/core';
import DashboardPage from '../views/Dashboard';
// import { InfoPage } from '../views/info';
import { TablePage } from '../views/table';
import SsidChartIcon from '@mui/icons-material/SsidChart';
import TableViewIcon from '@mui/icons-material/TableView';
// import { GraphPage } from '../views/graph';
import { GraphPage2 } from '../views/graph2';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import LogoutIcon from '@mui/icons-material/Logout';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import AutorenewRoundedIcon from '@mui/icons-material/AutorenewRounded';
import {
  ThemeSwitcher,
} from '@toolpad/core/DashboardLayout';
import { clearCache } from '../api/clearCache';

const NAVIGATION: Navigation = [
  {
    segment: 'dashboard',
    title: 'Dashboard',
    icon: <DashboardIcon />,
  },
  {
    segment: 'Graph',
    title: 'Graph',
    icon: <SsidChartIcon />,

  },
  {
    segment: 'Table',
    title: 'Table',
    icon: <TableViewIcon />,
  },
  // {
  //   segment: 'Info',
  //   title: 'Info',
  //   icon: <InfoIcon />,
  // },
  {
    segment: 'Logout',
    title: 'Logout',
    icon: <LogoutIcon />,
  },
];

const demoTheme = createTheme({
  cssVariables: {
    colorSchemeSelector: 'data-toolpad-color-scheme',
  },
  colorSchemes: {
    light: {
      palette: {
        background: {
          default: '#f1f4f5',  // Light gray background
          paper: '#ffffff',    // White paper background
        },
        text: {
          primary: '#333333',  // Dark gray for text
          secondary: '#666666', // Lighter gray for secondary text
        },
        primary: {
          main: '#e20012',  // Main primary color for selected state
          light: '#ff4757', // Lighter shade for hover effect
          dark: '#c20010',  // Darker shade for active effect
        },
        action: {
          hover: '#fbe0e2', // Color for hover state
          selected: '#fbe0e2', // Color for selected items
        },
        divider: 'rgba(0, 0, 0, 0.12)',  // Subtle divider color
      },
    },
    dark: {
      palette: {
        background: {
          default: '#0A111D',  // Dark gray background
          paper: '#0e1728',    // Slightly lighter gray for surfaces like cards
        },
        text: {
          primary: '#e5e5e5',  // Light gray for text
          secondary: '#e5e5e5', // Lighter gray for secondary text
        },
        primary: {
          main: '#ffffff',  // White primary color (corrected from '#fffff')
        },
        divider: 'rgba(0, 0, 0, 0.12)',     // Transparent for dividers
      },
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 600,
      lg: 1200,
      xl: 1536,
    },
  },
});


function DemoPageContent({ pathname }: { pathname: string }) {
  React.useEffect(() => {
    if (pathname === '/Logout') {
      // Perform logout logic
      signOut(auth)
        .then(() => {
          localStorage.removeItem('token'); // Optional: clean up
          sessionStorage.removeItem('token'); // Optional: clean up
          window.location.href = '/'; // Redirect to login page
        })
        .catch((error) => {
          console.error('Logout failed:', error);
        });
    }
  }, [pathname]);
  if (pathname === '/dashboard') {
    return <DashboardPage />;
  }
  // if ( pathname === '/Info') {
  //   return <InfoPage />;
  // }
  if ( pathname === '/Graph') {
    return <GraphPage2 />;
  }
  if ( pathname === '/Table') {
    return <TablePage />;
  }
  return (
    <DashboardPage />);
}

function clearCacheAction() {
  // Call the clearCache function from the API
  clearCache()
    .then((response) => {
      console.log('Cache cleared successfully:', response);
      // Refresh the browser after successful cache clear
      window.location.reload();
    })
    .catch((error) => {
      console.error('Error clearing cache:', error);
    });
}



function clearCacheActionButton() {
  return(
    <Stack direction="row" spacing={1}>
        <Tooltip title="Clear cache">
          <IconButton onClick={() => {
            clearCacheAction();
          }
          }>
            <AutorenewRoundedIcon />
          </IconButton>
        </Tooltip>
      <ThemeSwitcher />
    </Stack>

  )
}



export default function DashboardLayoutBranding() {

  const [pathname, setPathname] = React.useState('/dashboard');

  const router = React.useMemo<Router>(() => {
    return {
      pathname,
      searchParams: new URLSearchParams(),
      navigate: (path) => setPathname(String(path)),
    };
  }, [pathname]);

  React.useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          const token = await user.getIdToken(true); // Force refresh
          localStorage.setItem('token', token);
          sessionStorage.setItem('token', token);
        } catch (error) {
          console.error('Token refresh failed:', error);
        }
      } else {
        window.location.href = '/signin'; // redirect to login if not authenticated
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    // preview-start
    <AppProvider
      navigation={NAVIGATION}
      branding={{
      logo: '',
      title: 'Dashboard Monitoring Performance & Productivity Network',
      }}
      router={router}
      theme={demoTheme}
      hideNavigation={true}
    >
      <DashboardLayout defaultSidebarCollapsed={true} slots={{toolbarActions: clearCacheActionButton}}>
        <DemoPageContent pathname={pathname} />
      </DashboardLayout>
    </AppProvider>
    // preview-end
  );
}
