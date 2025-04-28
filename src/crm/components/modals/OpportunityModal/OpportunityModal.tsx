import { Alert, AlertColor, Box, Button, CircularProgress, Modal } from "@mui/material";
import React, { useContext, useEffect, useRef, useState } from "react";
import { OpportunityInfoContext } from "../../../context/OpportunityInfoContext";
import { CloseModalButton } from "../../../../generalUtilities";
import SaveProgressModal from "../SaveProgressModal/SaveProgressModal";
import OpportunityRegistration from "../../OpportunityRegistration/OpportunityRegistration";
import { Opportunity } from "../../../types";
import { defaultOpportunity, getOpportunityById, updateOpportunity } from "../../../utils";
import { AlertInterface } from "../../../../Requisitions/types";
import { fetchAllProjects } from "../../../../Requisitions/utils";
import GuideSelector from "../../GuideSelector/GuideSelector";
import Slider from "react-slick";
import { BaseButtonStyles } from "../../../../utilStyles";
import { styles } from "./OpportunityModal.styles";
import OpportunityInteraction from "../../OpportunityInteraction/OpportunityInteraction";

const OpportunityModal = () => {
  const {
    currentOppIdSelected,
    setCurrentOppIdSelected,
    creatingOpportunity,
    setCreatingOpportunity,
  } = useContext(OpportunityInfoContext);

  const [opp, setOpp] = useState<Opportunity>(defaultOpportunity);
  const [open, setOpen] = React.useState(false);
  const [saveProgressModalOpen, setSaveProgressModalOpen] =
    React.useState(false);
  const [changeWasMade, setChangeWasMade] = React.useState(false);
  const [alert, setAlert] = useState<AlertInterface>();
  const [loading, setLoading] = useState(false);
  const [slideIndex, setSlideIndex] = useState(0);
  const sliderRef = React.useRef<Slider | null>(null);
  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setCreatingOpportunity(false);
    setSaveProgressModalOpen(false);
    setCurrentOppIdSelected(0);
    setChangeWasMade(false);
    setSlideIndex(0);
    setOpen(false);
    setLoading(false);
  };

  const displayAlert = async (severity: string, message: string) => {
    setTimeout(() => {
      setAlert(undefined);
    }, 3000);
    setAlert({ severity, message });
    return;
  };

  const handleChangeGuide = (index: number) => {
    sliderRef.current?.slickGoTo(index);
    setSlideIndex(index);
  };

  const handleSave = async () => {
     console.log("handleSave");
    setLoading(true);
    try{ 
      const updatedOpportunity = await updateOpportunity(opp);
      console.log('updatedOpportunity', updatedOpportunity);
      setOpp(updatedOpportunity);
      setChangeWasMade(false);
      displayAlert("success", "Oportunidade salva com sucesso!");
    }catch(e){ 
      console.error(e);
      displayAlert("error", "Erro ao salvar oportunidade");
    }finally{ 
      setLoading(false);
    }

  };

  useEffect(() => {
    const fetchOpportunity = async () => {
      try {
        const data : Opportunity = await getOpportunityById(currentOppIdSelected);
        setOpp(data);
      } catch (e) {
        console.error(e);
        displayAlert("error", "Erro ao buscar dados da oportuidade");
      } finally {
        if (currentOppIdSelected) {
          handleOpen();
        }
      }
    };
    if (currentOppIdSelected) {
      fetchOpportunity();
    }
  }, [currentOppIdSelected]);

  useEffect(() => {
    if (creatingOpportunity) {
      handleOpen();
    }
  }, [creatingOpportunity]);

  return (
    <div>
      <Modal
        open={open}
        aria-labelledby="opportunity-modal-title"
        aria-describedby="opportunity-modal-description"
      >
        <Box sx={styles.modalBox}>
          <GuideSelector
            slideIndex={slideIndex}
            handleChangeGuide={handleChangeGuide}
          />
          { 
            loading ?
            <CircularProgress />
            : 
              <Box sx={styles.contentBox}>
                {alert && (
                  <Alert severity={alert.severity as AlertColor}
                   sx={{ border: alert.severity === "error" ? "1px solid red" : "1px solid green" }}>
                    {alert.message}
                  </Alert>
                )}
                <Slider ref={sliderRef}>
                  <OpportunityRegistration
                    handleClose={handleClose}
                    opp={opp}
                    setOpp={setOpp}
                  />
                  <OpportunityInteraction
                    opp={opp}
                    setOpp={setOpp}
                  />
                  <div>Escope</div>
                  <div>Venda</div>
                  <div>Seguidores</div>
                </Slider>
              </Box>
          }
          <Button onClick={handleSave} sx={{ ...BaseButtonStyles, width: 200 }}>Salvar</Button>

          <CloseModalButton
            handleClose={() => {
              if (!changeWasMade) {
                handleClose();
                return;
              }
              setSaveProgressModalOpen(true);
            }}
          />
          <SaveProgressModal
            open={saveProgressModalOpen}
            handleNo={handleClose}
            handleYes={handleSave}
          />
        </Box>
      </Modal>
    </div>
  );
};

export default OpportunityModal;
