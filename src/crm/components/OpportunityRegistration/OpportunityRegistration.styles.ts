import { SxProps, Theme } from "@mui/material";
import { BaseButtonStyles } from "../../../utilStyles";

export const styles: Record<string, SxProps<Theme>> = {
    container: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    },
    modal: {
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        backgroundColor: "white",
        display: "flex",
        flexDirection: "column",
        gap: 2,
        boxShadow: 24,
        p: 4,
        zIndex: 30,
        borderRadius: 2,
        width: "400px",
    },
};