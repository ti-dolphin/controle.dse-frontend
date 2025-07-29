import React from 'react'
import OpportunityTable from '../../components/oportunidades/OpportunityTable'
import { Box } from '@mui/material'
import UpperNavigation from '../../components/shared/UpperNavigation'
import { useNavigate } from 'react-router-dom'

const OpportunityListPage = () => {

  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/");
  }
  return (
    <Box sx={{ height: "100vh", padding: 1 }}>
      <UpperNavigation handleBack={handleBack} />
      <Box sx={{ height: "calc(100% - 40px)", overflow: "hidden" }}>
        <OpportunityTable />
      </Box>
    </Box>
  );
}

export default OpportunityListPage