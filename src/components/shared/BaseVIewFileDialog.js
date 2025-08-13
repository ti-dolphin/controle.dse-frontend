import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, Button, Dialog, Typography } from "@mui/material";
// Supported file types
const SUPPORTED_EXTENSIONS = {
    pdf: ["pdf"],
    image: ["png", "jpg", "jpeg", "gif", "bmp", "webp", "svg",],
    xlsx: ["xlsx", "xls"],
};
const BaseViewFileDialog = ({ open, onClose, fileUrl, title = "Visualizar Arquivo", }) => {
    // Function to validate file type based on extension
    const getFileType = (url) => {
        const regex = /\.([a-zA-Z0-9]+)(?=\?|$)/;
        const extension = url.match(regex)?.[1] || "";
        if (SUPPORTED_EXTENSIONS.pdf.includes(extension.toLowerCase()))
            return "pdf";
        if (SUPPORTED_EXTENSIONS.image.includes(extension.toLowerCase()))
            return "image";
        if (SUPPORTED_EXTENSIONS.xlsx.includes(extension.toLowerCase()))
            return "xlsx";
        return "unsupported";
    };
    const fileType = getFileType(fileUrl);
    // Render content based on file type
    const renderFileContent = () => {
        switch (fileType) {
            case "pdf":
                return (_jsx(Box, { sx: { width: "100%", height: "100%" }, children: _jsx("iframe", { src: fileUrl, title: "PDF Preview", style: { width: "100%", height: "100%", border: "none" }, "aria-label": "Visualiza\u00E7\u00E3o do arquivo PDF" }) }));
            case "image":
                return (_jsx(Box, { sx: {
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "100%",
                    }, children: _jsx("img", { src: fileUrl, alt: "Imagem selecionada", style: {
                            maxWidth: "100%",
                            maxHeight: "100%",
                            objectFit: "contain",
                        } }) }));
            case "xlsx":
                return (_jsxs(Box, { sx: { textAlign: "center", p: 4 }, children: [_jsx(Typography, { variant: "body1", color: "text.secondary", mb: 2, children: "Arquivos Excel n\u00E3o podem ser visualizados diretamente no navegador." }), _jsx(Button, { variant: "contained", color: "primary", href: fileUrl, download: true, "aria-label": "Baixar arquivo Excel", children: "Baixar Arquivo" })] }));
            case "unsupported":
            default:
                return (_jsx(Box, { sx: { textAlign: "center", p: 4 }, children: _jsx(Typography, { variant: "body1", color: "error.main", children: "Tipo de arquivo n\u00E3o suportado ou URL inv\u00E1lida." }) }));
        }
    };
    return (_jsx(Dialog, { open: open, onClose: onClose, "aria-labelledby": "view-file-dialog-title", sx: {
            "& .MuiDialog-paper": {
                maxWidth: "90vw",
                width: "100%",
                height: "80vh",
                borderRadius: 2,
                p: 3,
            },
        }, children: _jsxs(Box, { sx: {
                display: "flex",
                flexDirection: "column",
                height: "100%",
                gap: 2,
            }, children: [_jsx(Typography, { id: "view-file-dialog-title", variant: "h6", color: "primary.main", fontWeight: 600, textAlign: "center", children: title }), _jsx(Box, { sx: { flex: 1, overflow: "auto" }, children: renderFileContent() }), _jsx(Box, { sx: { display: "flex", justifyContent: "center" }, children: _jsx(Button, { onClick: onClose, variant: "contained", color: "error", sx: { minWidth: "100px" }, "aria-label": "Fechar di\u00E1logo", children: "Fechar" }) })] }) }));
};
export default BaseViewFileDialog;
