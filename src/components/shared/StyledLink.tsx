
import { Typography } from '@mui/material'
import React from 'react'

interface StyledLinkProps{ 
    link: string
    onClick: () => void;
}

const StyledLink = ({ link, onClick }: StyledLinkProps) => {
  return (
    <Typography
        sx={{
            color: "blue",
            fontSize: "small",
            fontWeight: "light",
            fontStyle: "italic",
            cursor: 'pointer',
            '&:hover': {
                textDecoration: 'underline',
            },
            maxWidth: 220,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
        }}
        onClick={onClick}
        title={link}
    >
        {link}
    </Typography>
  )
}

export default StyledLink