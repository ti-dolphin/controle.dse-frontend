import { Box } from "@mui/material";
import RequisitionListPage from "./RequisitionListPage/RequisitionListPage";

const RequisitionHomePage = () => {
  return (
    <Box sx={{ minHeight: "100vh", width: "100%" }}>
      <RequisitionListPage />
    </Box>
  );
};

export default RequisitionHomePage;
