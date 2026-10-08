import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import { Alert, Box, Button, Checkbox, Chip, Container, FormControl, InputLabel, ListItemText, MenuItem, OutlinedInput, Paper, Select, Stack, TextField, Typography } from "@mui/material";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import LanguageIcon from "@mui/icons-material/Language";
import InstagramIcon from "@mui/icons-material/Instagram";
import PlaceIcon from "@mui/icons-material/Place";
import PhoneIcon from "@mui/icons-material/Phone";
import FirebaseService from "../services/FireBaseService";
import CandidateApplicationService from "../services/CandidateApplicationService";
import headerDolphin from "../assets/images/header-dolphin.png";
import footerDolphin from "../assets/images/footer.png";

const STATES = ["AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"];
const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ALLOWED_EXTENSIONS = [".pdf", ".doc", ".docx"];
const CPF_PATTERN = /^(?:\d{11}|\d{3}\.\d{3}\.\d{3}-\d{2})$/;

interface CandidateForm {
  nome_completo: string;
  telefone: string;
  cpf: string;
  cidade: string;
  estado: string;
  id_funcoes: number[];
}

const EMPTY_FORM: CandidateForm = {
  nome_completo: "",
  telefone: "",
  cpf: "",
  cidade: "",
  estado: "",
  id_funcoes: [],
};

const formatCpf = (value: string) => {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  return digits
    .replace(/^(\d{3})(\d)/, "$1.$2")
    .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
};

const VagasPage = () => {
  const [form, setForm] = useState<CandidateForm>(EMPTY_FORM);
  const [resume, setResume] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [functions, setFunctions] = useState<Array<{ id_funcao: number; funcao: string }>>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    CandidateApplicationService.getFunctions()
      .then(setFunctions)
      .catch(() => setError("Não foi possível carregar as funções disponíveis."));
  }, []);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    setSuccess(false);
    setError("");
    if (!file) {
      setResume(null);
      return;
    }

    const extension = `.${file.name.split(".").pop()?.toLowerCase() ?? ""}`;
    if (!ALLOWED_EXTENSIONS.includes(extension)) {
      setResume(null);
      setError("Envie o currículo em formato PDF, DOC ou DOCX.");
      event.target.value = "";
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setResume(null);
      setError("O currículo deve ter no máximo 10 MB.");
      event.target.value = "";
      return;
    }
    setResume(file);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSuccess(false);
    setError("");
    if ([form.nome_completo, form.telefone, form.cpf, form.cidade, form.estado].some((value) => !value.trim())) {
      setError("Preencha todos os campos antes de enviar.");
      return;
    }
    if (form.id_funcoes.length === 0) {
      setError("Selecione ao menos uma função de interesse.");
      return;
    }
    if (!resume) {
      setError("Anexe seu currículo para enviar a candidatura.");
      return;
    }
    if (!CPF_PATTERN.test(form.cpf)) {
      setError("Informe o CPF no formato 000.000.000-00.");
      return;
    }

    setSubmitting(true);
    let uploadedFileUrl: string | null = null;
    try {
      const safeFileName = resume.name.replace(/[^a-zA-Z0-9._-]/g, "_");
      uploadedFileUrl = await FirebaseService.upload(resume, `vagas/curriculos/${crypto.randomUUID()}-${safeFileName}`);
      const submission = await CandidateApplicationService.submit({
        ...form,
        cpf: form.cpf.replace(/\D/g, ""),
        arquivo: uploadedFileUrl,
        nome_arquivo: resume.name,
      });
      await Promise.allSettled((submission.previous_resume_urls || []).map((url) => FirebaseService.delete(url)));
      setForm(EMPTY_FORM);
      setResume(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      setSuccess(true);
    } catch (submissionError: any) {
      if (uploadedFileUrl) {
        try {
          await FirebaseService.delete(uploadedFileUrl);
        } catch {
          // A falha de limpeza não deve ocultar o erro de envio do formulário.
        }
      }
      setError(submissionError?.response?.data?.error || "Não foi possível enviar seu currículo. Tente novamente.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleFieldChange = (field: keyof CandidateForm) => (event: { target: { value: string } }) => {
    setSuccess(false);
    setError("");
    const value = field === "cpf" ? formatCpf(event.target.value) : event.target.value;
    setForm((current) => ({ ...current, [field]: value }));
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default", py: { xs: 0.75, sm: 2 } }}>
      <Container maxWidth="md">
        <Paper elevation={3} sx={{ p: { xs: 1.5, sm: 2.5 }, borderRadius: 2 }}>
          <Stack spacing={1.5}>
            <Box>
              <Box
                component="img"
                src={headerDolphin}
                alt="Dolphin Soluções em Engenharia"
                sx={{ display: "block", width: "100%", height: { xs: 80, sm: 115 }, objectFit: "contain", mb: 1 }}
              />
              <Typography variant="h5" component="h1" color="primary.main" fontWeight="bold" gutterBottom>
                Trabalhe conosco
              </Typography>
              <Typography color="text.secondary">
                Preencha seus dados e anexe seu currículo para se candidatar.
              </Typography>
            </Box>

            {success && <Alert severity="success">Currículo enviado com sucesso. Obrigado pelo interesse!</Alert>}
            {error && <Alert severity="error">{error}</Alert>}

            <Box component="form" onSubmit={handleSubmit} noValidate>
              <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: { xs: 1, sm: 1.5 } }}>
                <TextField sx={{ gridColumn: "1 / -1" }} label="Nome completo" value={form.nome_completo} onChange={handleFieldChange("nome_completo")} required fullWidth inputProps={{ maxLength: 45 }} />
                <TextField label="CPF" value={form.cpf} onChange={handleFieldChange("cpf")} required fullWidth inputProps={{ inputMode: "numeric", maxLength: 14 }} />
                <TextField label="Telefone" value={form.telefone} onChange={handleFieldChange("telefone")} required fullWidth inputProps={{ maxLength: 45 }} />
                <TextField label="Cidade" value={form.cidade} onChange={handleFieldChange("cidade")} required fullWidth inputProps={{ maxLength: 45 }} />
                <TextField select label="Estado" value={form.estado} onChange={handleFieldChange("estado")} required fullWidth>
                  {STATES.map((state) => <MenuItem key={state} value={state}>{state}</MenuItem>)}
                </TextField>
                <FormControl required fullWidth sx={{ gridColumn: "1 / -1" }}>
                  <InputLabel id="funcoes-label">Funções de interesse</InputLabel>
                  <Select
                    labelId="funcoes-label"
                    multiple
                    value={form.id_funcoes}
                    onChange={(event) => setForm((current) => ({ ...current, id_funcoes: event.target.value as number[] }))}
                    input={<OutlinedInput label="Funções de interesse" />}
                    renderValue={(selected) => (
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                        {(selected as number[]).map((id) => <Chip key={id} label={functions.find((item) => item.id_funcao === id)?.funcao ?? id} size="small" />)}
                      </Box>
                    )}
                  >
                    {functions.map((item) => (
                      <MenuItem key={item.id_funcao} value={item.id_funcao}>
                        <Checkbox checked={form.id_funcoes.includes(item.id_funcao)} />
                        <ListItemText primary={item.funcao} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <Box sx={{ alignSelf: "center" }}>
                  <input
                    ref={fileInputRef}
                    hidden
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                  />
                  <Button
                    type="button"
                    variant="outlined"
                    startIcon={<CloudUploadOutlinedIcon />}
                    disabled={submitting}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Anexar currículo
                  </Button>
                  <Typography variant="caption" display="block" color="text.secondary" sx={{ mt: 0.75 }}>
                    {resume ? resume.name : "Obrigatório · PDF, DOC ou DOCX · até 10 MB"}
                  </Typography>
                </Box>

                <Button type="submit" variant="contained" disabled={submitting} sx={{ width: "100%", maxWidth: "none", py: 1.25, alignSelf: "center" }}>
                  {submitting ? "Enviando currículo..." : "Enviar currículo"}
                </Button>
              </Box>
            </Box>
            <Box
              component="nav"
              aria-label="Contato e redes sociais da Dolphin"
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "repeat(2, minmax(0, 1fr))", md: "repeat(4, minmax(0, 1fr))" },
                bgcolor: "#f7942b",
                color: "common.white",
                borderRadius: 2,
                overflow: "hidden",
              }}
            >
              {[
                { href: "https://dse.com.br", label: "dse.com.br", Icon: LanguageIcon },
                { href: "https://www.instagram.com/dolphin.engenharia/", label: "@dolphin.engenharia", Icon: InstagramIcon },
                { href: "https://www.google.com/maps/search/?api=1&query=Rua+Carlos+Lacerda%2C+139%2C+Gravata%C3%AD%2FRS", label: <>Rua Carlos Lacerda, 139<br />Gravataí/RS</>, Icon: PlaceIcon },
                { href: "tel:+555130435474", label: "51 3043-5474", Icon: PhoneIcon },
              ].map(({ href, label, Icon }, index) => (
                <Box
                  key={href}
                  component="a"
                  href={href}
                  target={href.startsWith("https://") ? "_blank" : undefined}
                  rel={href.startsWith("https://") ? "noreferrer" : undefined}
                  sx={{
                    minWidth: 0,
                    minHeight: { xs: 88, md: 104 },
                    px: { xs: 1, sm: 1.5 },
                    py: 1.25,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 0.75,
                    color: "inherit",
                    textAlign: "center",
                    textDecoration: "none",
                    borderRight: { md: index < 3 ? "1px solid rgba(255,255,255,0.7)" : "none" },
                    borderBottom: { xs: index < 2 ? "1px solid rgba(255,255,255,0.7)" : "none", md: "none" },
                    "&:hover": { bgcolor: "rgba(0,0,0,0.08)" },
                    "&:focus-visible": { outline: "2px solid white", outlineOffset: -4 },
                  }}
                >
                  <Icon aria-hidden="true" sx={{ fontSize: { xs: 25, sm: 30 } }} />
                  <Typography component="span" sx={{ fontSize: { xs: 12, sm: 14, md: 16 }, lineHeight: 1.2, overflowWrap: "anywhere" }}>
                    {label}
                  </Typography>
                </Box>
              ))}
            </Box>
            <Box
              component="img"
              src={footerDolphin}
              alt="Melhorar a vida das pessoas através de Soluções em Engenharia"
              sx={{ display: "block", width: "100%", height: "auto", mt: 0.5 }}
            />
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
};

export default VagasPage;
