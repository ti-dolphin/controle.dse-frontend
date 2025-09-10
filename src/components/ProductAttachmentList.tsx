import React, { ChangeEvent, useEffect, useState } from 'react'
import ProductAttachmentService from '../services/ProductAttachmentService';
import { ProductAttachment } from '../models/ProductAttachment';
import { Box, Typography, CircularProgress, List, ListItem, Stack, ListItemSecondaryAction, Tooltip, IconButton, Button } from '@mui/material';
import BaseDeleteDialog from './shared/BaseDeleteDialog';
import BaseInputDialog from './shared/BaseInputDialog';
import BaseViewFileDialog from './shared/BaseVIewFileDialog';
import StyledLink from './shared/StyledLink';
import DeleteIcon from '@mui/icons-material/Delete';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import LinkIcon from '@mui/icons-material/Link';
import FirebaseService from '../services/FireBaseService';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { setFeedback } from '../redux/slices/feedBackSlice';
import { setProducts } from '../redux/slices/productSlice';
import { Product } from '../models/Product';





const ProductAttachmentList = () => {

  const [attachments, setAttachments] = useState<ProductAttachment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingFile, setDeletingFile] = useState<ProductAttachment | null>(null);
  const [selectedFile, setSelectedFile] = useState<ProductAttachment | null>(null);
  const [linkDialogOpen, setLinkDialogOpen] = useState(false);
  const [linkInput, setLinkInput] = useState<string>('');
  const { viewingProductAttachment, products} = useSelector((state: RootState) => state.productSlice);
  const dispatch = useDispatch();
  const openViewFile = (file: ProductAttachment) => {
    setSelectedFile(file);
  };

  const closeViewFile = () => {
    setSelectedFile(null);
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    if(!viewingProductAttachment) return;
    const file = e.target.files[0];
    const newFile: ProductAttachment = {
      id_anexo_produto: 0,
      arquivo: '',
      id_produto: viewingProductAttachment,
    };
    setLoading(true);
    try {
      const fileUrl = await FirebaseService.upload(file, file.name || '');
      newFile.arquivo = fileUrl;
      const createdFile = await ProductAttachmentService.create(newFile);
      setAttachments((prev) => [...prev, createdFile]);
      addAttachment(createdFile);
      newFile.arquivo = fileUrl;
      fetchAttachments();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const openDeleteDialog = (file: ProductAttachment) => {
    setDeletingFile(file);
    setDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setDeletingFile(null);
    setDeleteDialogOpen(false);
  };

  const openLinkDialog = () => {
    setLinkDialogOpen(true);
  };

  const closeLinkDialog = () => {
    setLinkDialogOpen(false);
  };

  const fetchAttachments = async () => {
    if (!viewingProductAttachment) return;
    setLoading(true);
    try {
      const attachments = await ProductAttachmentService.getByProduct(
        viewingProductAttachment
      );

      setAttachments(attachments);
    } catch (error: any) {
      setError("Erro ao buscar anexos.");
    } finally {
      setLoading(false);
    }
  };

  const addAttachment = (file: ProductAttachment) => {
    const product = products.find(
      (product: Product) => product.ID === viewingProductAttachment
    );
    if (!product) return;
    dispatch(
      setProducts(
        products.map((product: Product) =>
          product.ID === viewingProductAttachment
            ? { ...product, anexos: [...(product.anexos || []), file] }
            : product
        )
      )
    );
  };

  const removeAttachment = (id_anexo_produto: number, id_produto: number) => {
    const productToAttachments = new Map();
    attachments.forEach((attachment) => {
      if (!productToAttachments.has(attachment.id_produto)) {
        productToAttachments.set(attachment.id_produto, []);
      }
      productToAttachments.get(attachment.id_produto)?.push(attachment);
    });
    const updatedAttachmetns = productToAttachments
      .get(id_produto)
      ?.filter(
        (attachment: ProductAttachment) =>
          attachment.id_anexo_produto !== id_anexo_produto
      );
    dispatch(
      setProducts(
        products.map((product: Product) =>
          product.ID === id_produto
            ? { ...product, anexos: updatedAttachmetns }
            : product
        )
      )
    );
  };

  const handleDelete = async () => {
    if (deletingFile) {
      try {
        try {
          await FirebaseService.delete(deletingFile.arquivo);
        } catch (e: any) {}
        await ProductAttachmentService.delete(deletingFile.id_anexo_produto);
        setAttachments(
          attachments.filter(
            (file) => file.id_anexo_produto !== deletingFile.id_anexo_produto
          )
        );
        removeAttachment(
          deletingFile.id_anexo_produto,
          deletingFile.id_produto
        );
        setDeletingFile(null);
        setDeleteDialogOpen(false);
      } catch (e: any) {
        dispatch(
          setFeedback({
            message: "Erro ao deletar anexo.",
            type: "error",
          })
        );
      }
    }
  };

  const handleAddLink = async () => {
    if(!viewingProductAttachment) return;
    if (linkInput) {
      const newAttachment = await ProductAttachmentService.create({
        id_produto: viewingProductAttachment,
        arquivo: linkInput,
      });
      setAttachments([...attachments, newAttachment]);
      setLinkDialogOpen(false);
      setLinkInput('');
    }
  };

  useEffect(() => {
    if(viewingProductAttachment !== null) {
       fetchAttachments();
    }
  }, [viewingProductAttachment]);

  return (
    <Box>
      {error && (
        <Typography color="error" mb={1}>
          {error}
        </Typography>
      )}
      {loading ? (
        <CircularProgress />
      ) : (
        <List sx={{ maxHeight: 120, overflow: "auto" }}>
          {attachments.length === 0 && (
            <Typography variant="body2" color="text.secondary">
              Nenhum anexo encontrado.
            </Typography>
          )}
          {attachments.map((file) => (
            <ListItem key={file.id_anexo_produto} divider sx={{ height: 100 }}>
              <Stack direction="column" alignItems="start" gap={0.2}>
                <Box component={"img"} sx={{height: 50, width: 50, borderRadius: 2, boxShadow: 1}} src={file.arquivo} />

                <StyledLink
                  link={file.arquivo}
                  onClick={() => {
                    const fileExtensions = [
                      ".pdf",
                      ".jpg",
                      ".jpeg",
                      ".png",
                      ".doc",
                      ".docx",
                      ".xls",
                      ".xlsx",
                    ];
                    const isFile = fileExtensions.some((ext) =>
                      file.arquivo.toLowerCase().includes(ext)
                    );
                    if (isFile) {
                      openViewFile(file);
                    } else if (
                      file.arquivo.startsWith("http://") ||
                      file.arquivo.startsWith("https://")
                    ) {
                      window.open(file.arquivo, "_blank");
                    }
                  }}
                />
                {/* <Typography fontSize="12px" color="text.secondary">
                  Por: {file.pessoa_criado_por?.NOME || ""}
                </Typography> */}
              </Stack>
              <ListItemSecondaryAction>
                <Tooltip title="Excluir">
                  <IconButton
                    edge="end"
                    color="error"
                    onClick={() => openDeleteDialog(file)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      )}
      <Stack direction={{ xs: "column", sm: "row" }} alignItems={{ xs: "start", sm: "center" }} sx={{ gap: 0.5 }}>
        <Button
          startIcon={<CloudUploadIcon sx={{ height: "20px" }} />}
          sx={{ fontSize: "small" }}
          disabled={loading}
          component="label"
        >
          Adicionar Anexo
          <input type="file" hidden onChange={handleFileChange} accept="*" />
        </Button>
        <Button
          variant="contained"
          startIcon={<LinkIcon sx={{ height: "20px", width: "20px" }} />}
          sx={{ fontSize: "small"}}
          disabled={loading}
          onClick={openLinkDialog}
        >
          Adicionar Link
        </Button>
      </Stack>
      <BaseDeleteDialog
        open={deleteDialogOpen}
        onConfirm={handleDelete}
        onCancel={closeDeleteDialog}
      />
      <BaseViewFileDialog
        open={selectedFile !== null}
        onClose={closeViewFile}
        fileUrl={selectedFile?.arquivo || ""}
        title={'Visualizar anexo'}
      />
      <BaseInputDialog
        open={linkDialogOpen}
        onClose={closeLinkDialog}
        onConfirm={handleAddLink}
        title="Adicionar Link"
        inputLabel="URL do Link"
        inputValue={linkInput}
        onInputChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setLinkInput(e.target.value)
        }
      />
    </Box>
  )
}

export default ProductAttachmentList

