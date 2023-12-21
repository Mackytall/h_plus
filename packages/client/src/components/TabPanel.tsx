import { ReactNode } from 'react';
import Box from '@mui/material/Box';

export interface ITabPanelProps {
  children?: ReactNode;
  index: number;
  value: number;
  label: string;
}

const TabPanel = ({ children, value, index, label, ...other }: ITabPanelProps) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`${label}-${index}`}
      aria-labelledby={`${label}-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 1 }}>{children}</Box>}
    </div>
  );
};

export default TabPanel;
