import { useNavigate } from 'react-router-dom';
import ChecklistTable from './ChecklistTable';
import { Box } from '@mui/material';
import UpperNavigation from '../../components/shared/UpperNavigation';

const ChecklistListPage = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/patrimonios");
  };

  return (
    <Box sx={{ height: "100vh", width: "100%" }}>
      <UpperNavigation handleBack={handleBack} />
      <Box sx={{ height: "93%" }}>
        <ChecklistTable />
      </Box>
    </Box>
  );
}

export default ChecklistListPage