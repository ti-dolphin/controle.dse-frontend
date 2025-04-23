import { SxProps, Theme } from "@mui/material";

export const styles: Record<string, SxProps<Theme>> = {
    modalBox: {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: {
            xs: "90%",
            sm: "80%",
            md: "70%",
            lg: "60%",
            xl: "40%",
        },
        bgcolor: "background.paper",
        display: "flex",
        flexDirection: "column",
        gap: 2,
        alignItems: "center",
        boxShadow: 24,
        p: 4,
    },
    contentBox: {
        width: "100%",
        maxHeight: 500,
        overflowY: "scroll",
        overflowX: "hidden",
    },
    saveButton: {
        width: 200,
    },
};