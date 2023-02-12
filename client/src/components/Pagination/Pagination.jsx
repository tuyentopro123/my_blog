import React from 'react'
import './Pagination.scss';
import Pagination  from '@mui/material/Pagination';
import PaginationItem from '@mui/material/PaginationItem';
import { Link } from 'react-router-dom';


const PaginationType = ({func,numb,defaultPage}) => {
  return (
    <Pagination 
        className= "pagination"
        key={`slider-${defaultPage}`} 
        count={numb} 
        color="primary"  
        defaultPage={defaultPage}
        showFirstButton
        variant="outlined"
        shape="rounded"
        showLastButton 
        onChange={func}
    />
  )
}

export default PaginationType