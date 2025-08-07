import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../../redux/store';
import ChecklistTable from './ChecklistTable';
import { Box } from '@mui/material';
import UpperNavigation from '../../components/shared/UpperNavigation';

const ChecklistListPage = () => {
  console.log("ChecklistListPage");

  const user = useSelector((state: RootState) => state.user.user);
  const navigate = useNavigate()
  const dispatch = useDispatch();

  const handleBack = () => {
    navigate("/patrimonios");
  };


  return (
    <Box sx={{ height: "100vh", width: "100%" }}>
      <UpperNavigation handleBack={handleBack} />
      <Box sx={{height: '93%'}}>
        <ChecklistTable />
      </Box>
    </Box>
  );
}

export default ChecklistListPage