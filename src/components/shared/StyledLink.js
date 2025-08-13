import { jsx as _jsx } from "react/jsx-runtime";
import { Typography } from '@mui/material';
const StyledLink = ({ link, onClick }) => {
    return (_jsx(Typography, { sx: {
            color: "blue",
            fontSize: "small",
            fontWeight: "light",
            fontStyle: "italic",
            cursor: 'pointer',
            '&:hover': {
                textDecoration: 'underline',
            },
            maxWidth: 150,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
        }, onClick: onClick, title: link, children: link }));
};
export default StyledLink;
