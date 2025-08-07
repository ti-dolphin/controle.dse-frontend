import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../../redux/store';

const checklsitTable = () => {

    const dispatch = useDispatch();
    const user = useSelector((state: RootState) => state.user.user);
    const navigate = useNavigate();
    
 
  return (
    <div>checklsitTable</div>
  )
}

export default checklsitTable