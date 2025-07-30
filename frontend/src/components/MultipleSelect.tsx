import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Chip from '@mui/material/Chip';


interface MultipleSelectChipProps {
  label: string;
  options: string[];
  value: string[];
  onChange: (selectedValues: string[]) => void;
}

export const MultipleSelectChip: React.FC<MultipleSelectChipProps> = ({ label, options, value, onChange }) => {
  const theme = useTheme();

  const handleChange = (event: SelectChangeEvent<typeof value>) => {
    const { target: { value: selectedValue } } = event;
    const selectedValues = typeof selectedValue === 'string' ? selectedValue.split(',') : selectedValue;
    onChange(selectedValues);
  };

  return (
    <FormControl sx={{width: 200, maxWidth: 400}}>
      <InputLabel sx={{fontWeight: 600}}>{label}</InputLabel>
      <Select
        multiple
        value={value}
        onChange={handleChange}
        input={<OutlinedInput label={label} />}
        renderValue={(selected) => {
            const maxItems = 3; // Set the maximum number of items to display
            const displayedItems = (selected as string[]).slice(0, maxItems);
            const remainingCount = (selected as string[]).length - maxItems;
          
            return (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {displayedItems.map((val) => (
                  <Chip key={val} label={val} />
                ))}
                {remainingCount > 0 && (
                  <Chip label={`+${remainingCount} more`} sx={{ backgroundColor: '#e0e0e0' }} />
                )}
              </Box>
            );
          }}
        sx={{borderRadius: 3}}
      >
        {options.map((option) => (
          <MenuItem
            key={option}
            value={option}
            sx={{
                fontWeight: value.includes(option)
                  ? theme.typography.fontWeightBold
                  : theme.typography.fontWeightRegular,
                '&:hover': {
                  backgroundColor: 'rgba(226, 0, 18, 0.1)',
                },
                '&.Mui-selected': {
                  backgroundColor: 'rgba(226, 0, 18, 0.2)',
                },
              }}
          >
            {option}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
