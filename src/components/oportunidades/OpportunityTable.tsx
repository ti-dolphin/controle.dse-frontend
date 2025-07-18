import React, { useCallback, useEffect, useState } from 'react'
import { useOpportunityColumns } from '../../hooks/oportunidades/useOpportunityColumns';
import { useDispatch, useSelector } from 'react-redux';
import OpportunityService from '../../services/oportunidades/OpportunityService';
import { RootState } from '../../redux/store';

const OpportunityTable = () => {
 const dispatch = useDispatch();
 const user = useSelector((state: RootState) => state.user.user);
 
 const { columns } = useOpportunityColumns();

 const [searchTerm, setSearchTerm ] = useState('');
 //fetchData
//  const fetchData = useCallback(async () => {
//     if(user){ 
//        const data = await OpportunityService.getMany({
//          user: user,
         
//        });
//     }
//     console.log("opps", data);
//  }, [dispatch]);

 useEffect(() => {

 }, [dispatch]);

  return (
    <div>

    </div>
  )
}

export default OpportunityTable