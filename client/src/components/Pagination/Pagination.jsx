import React from 'react'
import './Pagination.scss';
import Pagination  from '@mui/material/Pagination';
import PaginationItem from '@mui/material/PaginationItem';
import { Link } from 'react-router-dom';


const PaginationType = ({type,page,func,numb}) => {
  return (
    <Pagination 
        className= "pagination"
        count={numb} 
        color="primary"  
        showFirstButton
        variant="outlined"
        showLastButton 
        onChange={func}
        renderItem={(item) => (
          <PaginationItem
            component={Link}
            to={`/${type}${item.page === 1 ? '' : `?${page}=${item.page}`}`}
            {...item}
          />
        )}
    />
  )
}

export default PaginationType