import React, { useEffect } from 'react'
import OpportunityTable from '../../components/oportunidades/OpportunityTable'
import { Box } from '@mui/material'
import UpperNavigation from '../../components/shared/UpperNavigation'
import { useNavigate } from 'react-router-dom'

const OpportunityListPage = () => {
  const navbarRef = React.useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/");
  }
 
  return (
    <Box sx={{ height: "100vh", padding: 1 }}>
      <Box ref={navbarRef}>
        <UpperNavigation handleBack={handleBack} />
      </Box>
      <Box sx={{ height: `calc(100% - ${navbarRef.current?.offsetHeight}px)`, overflow: "hidden" }}>
        <OpportunityTable />
      </Box>
    </Box>
  );
}

export default OpportunityListPage