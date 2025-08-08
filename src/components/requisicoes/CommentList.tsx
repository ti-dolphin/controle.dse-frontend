import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { RootState } from '../../redux/store';
import { Box } from '@mui/material';
import { setFeedback } from '../../redux/slices/feedBackSlice';


interface RequisitionCommnet{ 

}

const CommentList = () => {
    const dispatch = useDispatch();
    const { id_requisicao } = useParams();
    const user = useSelector((state: RootState) => state.user.user);
    const [comments, setComments] = useState([]);


    const fetchCommnets = ( ) => {
       try{ 
        // const data  = await RequisitionCommentService.getMany(id_requisicao);
        // setComments(data);
       }catch(e: any){ 
        dispatch(setFeedback({
          message: `Erro ao buscar comentários da requisição: ${e.message}`,
          type: 'error'
        }))
       }
    }
  return (
    <Box>
        
    </Box>
  )
}

export default CommentList