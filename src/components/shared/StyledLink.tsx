import { Typography } from '@mui/material'

interface StyledLinkProps{ 
    link: string
    onClick: () => void;
    fullScreen?: boolean;
    maxWidth?: number | string;
}

const StyledLink = ({ link, onClick, fullScreen = false, maxWidth }: StyledLinkProps) => {
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
            maxWidth: maxWidth ?? (fullScreen ? 'none' : 150),
            overflow: 'hidden',
            textOverflow: fullScreen ? 'unset' : 'ellipsis',
            whiteSpace: fullScreen ? 'normal' : 'nowrap',
            wordBreak: fullScreen ? 'break-word' : 'normal',
        }}
        onClick={onClick}
        title={link}
    >
        {link}
    </Typography>
  )
}

export default StyledLink