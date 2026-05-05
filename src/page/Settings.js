import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  Avatar,
  Stack,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  alpha,
  CircularProgress,
  TextField,
  InputAdornment,
  IconButton,
  MenuItem,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
} from "@mui/material";
import NavBar from "../component/NavBar";
import { useDispatch, useSelector } from "react-redux";
import { click, setTitle } from "../redux/sidenavReducer";
import { signout } from "../utils/Authentication";
import { getAuth, reauthenticateWithCredential, EmailAuthProvider, updatePassword } from "firebase/auth";
import { fetchAllUsers, createUser, deleteUserFromDB, resetUserPassword } from "../redux/action/userAction";
import { setOpenSuccess, setOpenFailed } from "../redux/userReducer";

import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import LogoutIcon from "@mui/icons-material/Logout";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import EditIcon from "@mui/icons-material/Edit";
import StorefrontIcon from "@mui/icons-material/Storefront";
import BuildIcon from "@mui/icons-material/Build";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import GroupIcon from "@mui/icons-material/Group";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import LockResetIcon from "@mui/icons-material/LockReset";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";

// Design tokens
const C = {
  bg: "#F4F4F4",
  surface: "#FFFFFF",
  surfaceAlt: "#FEF9F4",
  border: "#F0E4D4",
  borderLight: "#F7EEE4",
  orange: "#F47B20",
  orangeSoft: "#FEF0E3",
  orangeDark: "#D45F05",
  teal: "#0BBFA0",
  tealSoft: "#E5FAF7",
  red: "#EF4444",
  redSoft: "#FEE2E2",
  amber: "#F59E0B",
  amberSoft: "#FEF3C7",
  indigo: "#4F6EF7",
  indigoSoft: "#EEF1FE",
  purple: "#7C3AED",
  purpleSoft: "#F3EFFE",
  text: "#1E1206",
  textSub: "#78624A",
  textDim: "#C4A98A",
};
const font = "Clash Display, Plus Jakarta Sans, sans-serif";
const fontBody = "Plus Jakarta Sans, sans-serif";
const ROLES = ["Admin", "Super Admin"];

function getInitials(name = "") {
  return (
    name
      .split(" ")
      .slice(0, 2)
      .map((w) => w[0]?.toUpperCase())
      .join("") || "?"
  );
}
function roleColor(role) {
  if (!role) return { bg: C.amberSoft, color: C.amber };
  if (role.toLowerCase().includes("super")) return { bg: C.orangeSoft, color: C.orange };
  return { bg: C.indigoSoft, color: C.indigo };
}

function SettingSection({ icon, title, subtitle, children, accentColor = C.orange, accentSoft = C.orangeSoft, delay = "0s" }) {
  return (
    <Card
      elevation={0}
      sx={{
        border: `1.5px solid ${C.border}`,
        borderRadius: "20px",
        bgcolor: C.surface,
        mb: 2.5,
        overflow: "visible",
        animation: "fadeUp 0.4s ease both",
        animationDelay: delay,
        transition: "box-shadow 0.2s",
        "&:hover": { boxShadow: `0 6px 24px ${alpha(accentColor, 0.09)}` },
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Stack direction="row" alignItems="flex-start" gap={2} mb={2}>
          <Avatar sx={{ bgcolor: accentSoft, color: accentColor, width: 40, height: 40, borderRadius: "12px", flexShrink: 0 }}>{icon}</Avatar>
          <Box>
            <Typography sx={{ fontFamily: font, fontSize: "1rem", fontWeight: 700, color: C.text }}>{title}</Typography>
            {subtitle && <Typography sx={{ fontFamily: fontBody, fontSize: "0.75rem", color: C.textSub, mt: 0.2 }}>{subtitle}</Typography>}
          </Box>
        </Stack>
        <Divider sx={{ mb: 2.5, borderColor: C.borderLight }} />
        {children}
      </CardContent>
    </Card>
  );
}

function OField({ label, value, onChange, type = "text", endAdornment, disabled, select, children, required }) {
  return (
    <TextField
      fullWidth
      size="small"
      label={label}
      value={value}
      onChange={onChange}
      type={type}
      disabled={disabled}
      select={select}
      required={required}
      sx={{
        "& .MuiOutlinedInput-root": {
          borderRadius: "10px",
          fontFamily: fontBody,
          fontSize: "0.88rem",
          bgcolor: disabled ? C.surfaceAlt : C.surface,
          color: C.text,
          "& fieldset": { borderColor: C.border },
          "&:hover fieldset": { borderColor: C.orange },
          "&.Mui-focused fieldset": { borderColor: C.orange, borderWidth: 2 },
        },
        "& .MuiInputLabel-root": { fontFamily: fontBody, fontSize: "0.82rem", color: C.textSub },
        "& .MuiInputLabel-root.Mui-focused": { color: C.orange },
        "& .MuiFormLabel-asterisk": { color: C.orange },
      }}
      InputProps={endAdornment ? { endAdornment } : undefined}
    >
      {children}
    </TextField>
  );
}

function PwStrength({ password }) {
  const checks = [
    { label: "Min. 8 karakter", pass: password.length >= 8 },
    { label: "Huruf besar", pass: /[A-Z]/.test(password) },
    { label: "Angka", pass: /[0-9]/.test(password) },
  ];
  const score = checks.filter((c) => c.pass).length;
  const colors = ["", C.red, C.amber, C.teal];
  const labels = ["", "Lemah", "Cukup", "Kuat"];
  if (!password) return null;
  return (
    <Box mt={1}>
      <Stack direction="row" gap={0.6} mb={0.8}>
        {[0, 1, 2].map((i) => (
          <Box key={i} sx={{ flex: 1, height: 4, borderRadius: 2, bgcolor: i < score ? colors[score] : C.borderLight, transition: "background-color 0.3s" }} />
        ))}
      </Stack>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        {score > 0 && <Typography sx={{ fontFamily: fontBody, fontSize: "0.7rem", color: colors[score], fontWeight: 700 }}>{labels[score]}</Typography>}
        <Stack direction="row" gap={1.5} ml="auto">
          {checks.map((c) => (
            <Stack key={c.label} direction="row" alignItems="center" gap={0.3}>
              <CheckCircleIcon sx={{ fontSize: 11, color: c.pass ? C.teal : C.textDim }} />
              <Typography sx={{ fontFamily: fontBody, fontSize: "0.68rem", color: c.pass ? C.teal : C.textDim }}>{c.label}</Typography>
            </Stack>
          ))}
        </Stack>
      </Stack>
    </Box>
  );
}

function InfoRow({ icon, label, value }) {
  return (
    <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ py: 1.4, borderBottom: `1px solid ${C.borderLight}`, "&:last-child": { border: "none" } }}>
      <Stack direction="row" alignItems="center" gap={1.2}>
        <Box sx={{ color: C.textSub, display: "flex" }}>{icon}</Box>
        <Typography sx={{ fontFamily: fontBody, fontSize: "0.84rem", color: C.textSub }}>{label}</Typography>
      </Stack>
      <Typography sx={{ fontFamily: fontBody, fontSize: "0.84rem", fontWeight: 600, color: C.text }}>{value}</Typography>
    </Stack>
  );
}

const tblHead = { fontFamily: fontBody, fontSize: "0.69rem", fontWeight: 700, color: C.textSub, textTransform: "uppercase", letterSpacing: "0.06em", bgcolor: C.surfaceAlt, borderColor: C.borderLight, py: 1.2 };
const tblCell = { fontFamily: fontBody, fontSize: "0.82rem", color: C.text, borderColor: C.borderLight, py: 1.2 };

function ConfirmDialog({ open, onClose, title, icon, iconBg, iconColor, children, onConfirm, confirmLabel, confirmColor, loading, disabled }) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: "20px", border: `1.5px solid ${C.border}`, bgcolor: C.surface, px: 1 } }}>
      <DialogTitle sx={{ fontFamily: font, fontSize: "1.05rem", fontWeight: 700, color: C.text, pb: 1 }}>{title}</DialogTitle>
      <DialogContent>{children}</DialogContent>
      <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          disableElevation
          sx={{ fontFamily: fontBody, fontWeight: 600, fontSize: "0.82rem", borderRadius: "10px", px: 2.5, textTransform: "none", color: C.textSub, borderColor: C.border, "&:hover": { bgcolor: C.surfaceAlt } }}
        >
          Batal
        </Button>
        {onConfirm && (
          <Button
            onClick={onConfirm}
            disabled={loading || disabled}
            variant="contained"
            disableElevation
            sx={{
              fontFamily: fontBody,
              fontWeight: 700,
              fontSize: "0.82rem",
              borderRadius: "10px",
              px: 2.5,
              textTransform: "none",
              bgcolor: confirmColor,
              color: "#fff",
              "&:hover": { filter: "brightness(0.88)" },
              "&.Mui-disabled": { bgcolor: C.borderLight },
            }}
          >
            {loading ? <CircularProgress size={16} sx={{ color: "#fff" }} /> : confirmLabel}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}

function CreateUserDialog({ open, onClose, onSubmit, loading, error, success }) {
  const [username, setUsername] = useState("");
  const [em, setEm] = useState("");
  const [pw, setPw] = useState("");
  const [role, setRole] = useState("Admin");
  const [showPw, setShowPw] = useState(false);
  useEffect(() => {
    if (!open) {
      setUsername("");
      setEm("");
      setPw("");
      setRole("Admin");
    }
  }, [open]);
  useEffect(() => {
    if (success) onClose();
  }, [success]);
  const valid = username.trim() && em.trim() && pw.length >= 6 && role;
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: "20px", border: `1.5px solid ${C.border}`, bgcolor: C.surface, px: 1 } }}>
      <DialogTitle sx={{ fontFamily: font, fontSize: "1.05rem", fontWeight: 700, color: C.text, pb: 1 }}>
        <Stack direction="row" alignItems="center" gap={1}>
          <Avatar sx={{ bgcolor: C.orangeSoft, color: C.orange, width: 32, height: 32, borderRadius: "10px" }}>
            <PersonAddIcon sx={{ fontSize: 16 }} />
          </Avatar>
          Buat User Baru
        </Stack>
      </DialogTitle>
      <DialogContent>
        <Stack spacing={2} mt={0.5}>
          {error && (
            <Alert
              severity="error"
              icon={<WarningAmberIcon fontSize="small" />}
              sx={{ borderRadius: "10px", fontFamily: fontBody, fontSize: "0.8rem", bgcolor: C.redSoft, color: C.red, border: `1px solid ${C.red}`, "& .MuiAlert-icon": { color: C.red } }}
            >
              {error}
            </Alert>
          )}
          <OField label="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
          <OField label="Email" value={em} onChange={(e) => setEm(e.target.value)} type="email" required />
          <Box>
            <OField
              label="Password"
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              type={showPw ? "text" : "password"}
              required
              endAdornment={
                <InputAdornment position="end">
                  <IconButton size="small" onClick={() => setShowPw(!showPw)} sx={{ color: C.textSub }}>
                    {showPw ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                  </IconButton>
                </InputAdornment>
              }
            />
            <PwStrength password={pw} />
          </Box>
          <OField label="Role" value={role} onChange={(e) => setRole(e.target.value)} select required>
            {ROLES.map((r) => (
              <MenuItem key={r} value={r} sx={{ fontFamily: fontBody, fontSize: "0.84rem" }}>
                {r}
              </MenuItem>
            ))}
          </OField>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          disableElevation
          sx={{ fontFamily: fontBody, fontWeight: 600, fontSize: "0.82rem", borderRadius: "10px", px: 2.5, textTransform: "none", color: C.textSub, borderColor: C.border, "&:hover": { bgcolor: C.surfaceAlt } }}
        >
          Batal
        </Button>
        <Button
          onClick={() => onSubmit({ username: username.trim(), email: em.trim(), password: pw, role })}
          disabled={!valid || loading}
          variant="contained"
          disableElevation
          sx={{
            fontFamily: fontBody,
            fontWeight: 700,
            fontSize: "0.82rem",
            borderRadius: "10px",
            px: 2.5,
            textTransform: "none",
            bgcolor: C.orange,
            "&:hover": { bgcolor: C.orangeDark },
            "&.Mui-disabled": { bgcolor: C.borderLight, color: C.textDim },
          }}
        >
          {loading ? <CircularProgress size={16} sx={{ color: "#fff" }} /> : "Buat User"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default function Settings() {
  const dispatch = useDispatch();
  const name = useSelector((s) => s?.sidenav?.name ?? "");
  const role = useSelector((s) => s?.sidenav?.role ?? "");
  const allUsers = useSelector((s) => s?.user?.allUsers ?? []);
  const userLoading = useSelector((s) => s?.user?.loading ?? false);
  const userError = useSelector((s) => (s?.user?.openFailed?.isOpen ? s.user.openFailed.message : null));
  const userSuccess = useSelector((s) => s?.user?.openSuccess ?? false);
  const isSuperAdmin = role === "Super Admin";

  const auth = getAuth();
  const currentUser = auth.currentUser;
  const email = currentUser?.email ?? "";

  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [pwStatus, setPwStatus] = useState(null);
  const [pwMsg, setPwMsg] = useState("");
  const [pwLoading, setPwLoading] = useState(false);

  const [createOpen, setCreateOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [resetOpen, setResetOpen] = useState(false);
  const [targetUser, setTargetUser] = useState(null);
  const [userSearch, setUserSearch] = useState("");
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);

  useEffect(() => {
    dispatch(click(6));
    dispatch(setTitle("Pengaturan"));
  }, []);
  useEffect(() => {
    if (isSuperAdmin) dispatch(fetchAllUsers());
  }, [isSuperAdmin]);

  useEffect(() => {
    if (userSuccess && deleteOpen) {
      setDeleteOpen(false);
      setTargetUser(null);
    }
    if (userSuccess) {
      const t = setTimeout(() => dispatch(setOpenSuccess(false)), 2500);
      return () => clearTimeout(t);
    }
  }, [userSuccess]);

  useEffect(() => {
    if (userError) {
      const t = setTimeout(() => dispatch(setOpenFailed({ isOpen: false, message: "" })), 4000);
      return () => clearTimeout(t);
    }
  }, [userError]);

  async function handleChangePassword() {
    setPwStatus(null);
    if (!oldPass || !newPass || !confirmPass) {
      setPwStatus("error");
      setPwMsg("Semua field harus diisi.");
      return;
    }
    if (newPass !== confirmPass) {
      setPwStatus("error");
      setPwMsg("Password baru dan konfirmasi tidak cocok.");
      return;
    }
    if (newPass.length < 8) {
      setPwStatus("error");
      setPwMsg("Password minimal 8 karakter.");
      return;
    }
    if (newPass === oldPass) {
      setPwStatus("error");
      setPwMsg("Password baru tidak boleh sama dengan lama.");
      return;
    }
    setPwLoading(true);
    try {
      const cred = EmailAuthProvider.credential(email, oldPass);
      await reauthenticateWithCredential(currentUser, cred);
      await updatePassword(currentUser, newPass);
      setPwStatus("success");
      setPwMsg("Password berhasil diubah.");
      setOldPass("");
      setNewPass("");
      setConfirmPass("");
    } catch (err) {
      setPwStatus("error");
      setPwMsg(err.code === "auth/wrong-password" || err.code === "auth/invalid-credential" ? "Password lama salah." : err.code === "auth/too-many-requests" ? "Terlalu banyak percobaan. Coba lagi nanti." : "Gagal mengubah password.");
    } finally {
      setPwLoading(false);
    }
  }

  function eyeBtn(show, toggle) {
    return (
      <InputAdornment position="end">
        <IconButton onClick={toggle} edge="end" size="small" sx={{ color: C.textSub }}>
          {show ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
        </IconButton>
      </InputAdornment>
    );
  }

  const filteredUsers = allUsers.filter((u) => u.username?.toLowerCase().includes(userSearch.toLowerCase()) || u.email?.toLowerCase().includes(userSearch.toLowerCase()));
  const rc = roleColor(role);
  return (
    <Box sx={{ width: "100%", minHeight: "100vh", display: "flex", bgcolor: C.bg }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        @import url('https://api.fontshare.com/v2/css?f[]=clash-display@400,500,600,700&display=swap');
        @keyframes fadeUp { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:translateY(0); } }
      `}</style>
      <Box sx={{ width: "100%", pr: 5 }}>
        <NavBar />
        <Box sx={{ pb: 8, pt: 2, maxWidth: 860, mx: "auto" }}>
          {/* Header */}
          <Box sx={{ animation: "fadeUp 0.35s ease both", mb: 3.5, mt: 2 }}>
            <Typography sx={{ fontFamily: font, fontSize: "1.75rem", fontWeight: 700, color: C.text, letterSpacing: "-0.02em" }}>Pengaturan</Typography>
            <Typography sx={{ fontFamily: fontBody, fontSize: "0.8rem", color: C.textSub, mt: 0.2 }}>Kelola akun dan preferensi aplikasi Anda</Typography>
          </Box>

          {/* 1. Profil */}
          <SettingSection icon={<PersonOutlineIcon sx={{ fontSize: 19 }} />} title="Profil Pengguna" subtitle="Informasi akun yang sedang aktif" delay="0.08s">
            <Stack direction={{ xs: "column", sm: "row" }} alignItems={{ sm: "center" }} gap={3}>
              <Box sx={{ position: "relative", flexShrink: 0 }}>
                <Avatar sx={{ width: 76, height: 76, bgcolor: C.orangeSoft, color: C.orange, fontFamily: font, fontSize: "1.6rem", fontWeight: 700, border: `3px solid ${C.border}` }}>{getInitials(name)}</Avatar>
                <Avatar sx={{ position: "absolute", bottom: -2, right: -2, width: 24, height: 24, bgcolor: C.orange, border: `2px solid ${C.surface}` }}>
                  <EditIcon sx={{ fontSize: 12, color: "#fff" }} />
                </Avatar>
              </Box>
              <Box sx={{ flex: 1 }}>
                <Stack direction="row" alignItems="center" gap={1.2} mb={0.5}>
                  <Typography sx={{ fontFamily: font, fontSize: "1.15rem", fontWeight: 700, color: C.text }}>{name || "—"}</Typography>
                  <Chip label={role || "—"} size="small" sx={{ bgcolor: rc.bg, color: rc.color, fontFamily: fontBody, fontWeight: 700, fontSize: "0.7rem", height: 22, borderRadius: "6px" }} />
                </Stack>
                <Typography sx={{ fontFamily: fontBody, fontSize: "0.82rem", color: C.textSub }}>{email || "—"}</Typography>
              </Box>
              <Stack direction="row" alignItems="center" gap={0.7} sx={{ bgcolor: C.tealSoft, borderRadius: "10px", px: 1.5, py: 0.8, alignSelf: { xs: "flex-start", sm: "center" } }}>
                <Box sx={{ width: 7, height: 7, borderRadius: "50%", bgcolor: C.teal, flexShrink: 0, animation: "pulse 2s infinite", "@keyframes pulse": { "0%,100%": { opacity: 1 }, "50%": { opacity: 0.4 } } }} />
                <Typography sx={{ fontFamily: fontBody, fontSize: "0.72rem", fontWeight: 700, color: C.teal }}>Aktif</Typography>
              </Stack>
            </Stack>
            <Stack spacing={2} mt={3}>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <OField label="Nama Pengguna" value={name} disabled />
                <OField label="Role" value={role} disabled />
              </Stack>
              <OField label="Email" value={email} disabled />
            </Stack>
            <Typography sx={{ fontFamily: fontBody, fontSize: "0.7rem", color: C.textDim, mt: 1.5, fontStyle: "italic" }}>Untuk mengubah nama atau role, hubungi administrator sistem.</Typography>
          </SettingSection>

          {/* 2. Ganti Password */}
          <SettingSection icon={<LockOutlinedIcon sx={{ fontSize: 19 }} />} title="Ganti Password" subtitle="Pastikan password baru Anda kuat dan unik" accentColor={C.indigo} accentSoft={C.indigoSoft} delay="0.16s">
            <Stack spacing={2}>
              <OField
                label="Password Lama"
                value={oldPass}
                onChange={(e) => {
                  setOldPass(e.target.value);
                  setPwStatus(null);
                }}
                type={showOld ? "text" : "password"}
                endAdornment={eyeBtn(showOld, () => setShowOld(!showOld))}
              />
              <Box>
                <OField
                  label="Password Baru"
                  value={newPass}
                  onChange={(e) => {
                    setNewPass(e.target.value);
                    setPwStatus(null);
                  }}
                  type={showNew ? "text" : "password"}
                  endAdornment={eyeBtn(showNew, () => setShowNew(!showNew))}
                />
                <PwStrength password={newPass} />
              </Box>
              <OField
                label="Konfirmasi Password Baru"
                value={confirmPass}
                onChange={(e) => {
                  setConfirmPass(e.target.value);
                  setPwStatus(null);
                }}
                type={showConfirm ? "text" : "password"}
                endAdornment={eyeBtn(showConfirm, () => setShowConfirm(!showConfirm))}
              />
              {confirmPass && newPass && (
                <Stack direction="row" alignItems="center" gap={0.6}>
                  <CheckCircleIcon sx={{ fontSize: 13, color: confirmPass === newPass ? C.teal : C.red }} />
                  <Typography sx={{ fontFamily: fontBody, fontSize: "0.72rem", color: confirmPass === newPass ? C.teal : C.red, fontWeight: 600 }}>{confirmPass === newPass ? "Password cocok" : "Password tidak cocok"}</Typography>
                </Stack>
              )}
              {pwStatus && (
                <Alert
                  severity={pwStatus}
                  icon={pwStatus === "success" ? <CheckCircleIcon fontSize="small" /> : <WarningAmberIcon fontSize="small" />}
                  sx={{
                    borderRadius: "10px",
                    fontFamily: fontBody,
                    fontSize: "0.82rem",
                    bgcolor: pwStatus === "success" ? C.tealSoft : C.redSoft,
                    color: pwStatus === "success" ? C.teal : C.red,
                    border: `1px solid ${pwStatus === "success" ? C.teal : C.red}`,
                    "& .MuiAlert-icon": { color: "inherit" },
                  }}
                >
                  {pwMsg}
                </Alert>
              )}
              <Button
                onClick={handleChangePassword}
                disabled={pwLoading}
                variant="contained"
                disableElevation
                sx={{
                  alignSelf: "flex-start",
                  fontFamily: fontBody,
                  fontWeight: 700,
                  fontSize: "0.84rem",
                  borderRadius: "10px",
                  px: 3,
                  py: 1,
                  bgcolor: C.indigo,
                  textTransform: "none",
                  "&:hover": { bgcolor: "#3a58d4" },
                  "&.Mui-disabled": { bgcolor: C.borderLight, color: C.textDim },
                }}
              >
                {pwLoading ? <CircularProgress size={18} sx={{ color: "#fff" }} /> : "Simpan Password Baru"}
              </Button>
            </Stack>
          </SettingSection>

          {/* 3. User Management — Super Admin only */}
          {isSuperAdmin && (
            <SettingSection icon={<GroupIcon sx={{ fontSize: 19 }} />} title="Manajemen User" subtitle="Kelola akun pengguna sistem — hanya Super Admin" accentColor={C.purple} accentSoft={C.purpleSoft} delay="0.24s">
              {userError && (
                <Alert
                  severity="error"
                  icon={<WarningAmberIcon fontSize="small" />}
                  sx={{ mb: 2, borderRadius: "10px", fontFamily: fontBody, fontSize: "0.8rem", bgcolor: C.redSoft, color: C.red, border: `1px solid ${C.red}`, "& .MuiAlert-icon": { color: C.red } }}
                >
                  {userError}
                </Alert>
              )}
              {userSuccess && !deleteOpen && (
                <Alert
                  severity="success"
                  icon={<CheckCircleIcon fontSize="small" />}
                  sx={{ mb: 2, borderRadius: "10px", fontFamily: fontBody, fontSize: "0.8rem", bgcolor: C.tealSoft, color: C.teal, border: `1px solid ${C.teal}`, "& .MuiAlert-icon": { color: C.teal } }}
                >
                  Operasi berhasil.
                </Alert>
              )}

              {/* Toolbar */}
              <Stack direction={{ xs: "column", sm: "row" }} alignItems={{ sm: "center" }} justifyContent="space-between" gap={2} mb={2}>
                <TextField
                  size="small"
                  placeholder="Cari username atau email..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon sx={{ color: C.textDim, fontSize: 18 }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    width: { xs: "100%", sm: 280 },
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "10px",
                      fontFamily: fontBody,
                      fontSize: "0.84rem",
                      bgcolor: C.surfaceAlt,
                      "& fieldset": { borderColor: C.border },
                      "&:hover fieldset": { borderColor: C.orange },
                      "&.Mui-focused fieldset": { borderColor: C.orange },
                    },
                  }}
                />
                <Button
                  onClick={() => {
                    dispatch(setOpenFailed({ isOpen: false, message: "" }));
                    dispatch(setOpenSuccess(false));
                    setCreateOpen(true);
                  }}
                  variant="contained"
                  disableElevation
                  startIcon={<AddIcon sx={{ fontSize: 16 }} />}
                  sx={{ fontFamily: fontBody, fontWeight: 700, fontSize: "0.82rem", borderRadius: "10px", px: 2.5, py: 1, textTransform: "none", bgcolor: C.orange, "&:hover": { bgcolor: C.orangeDark }, whiteSpace: "nowrap" }}
                >
                  Buat User Baru
                </Button>
              </Stack>

              {/* Table */}
              <TableContainer sx={{ borderRadius: "14px", border: `1.5px solid ${C.border}`, overflow: "hidden" }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={tblHead}>Pengguna</TableCell>
                      <TableCell sx={tblHead}>Email</TableCell>
                      <TableCell sx={tblHead}>Role</TableCell>
                      <TableCell sx={{ ...tblHead, textAlign: "right" }}>Aksi</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {userLoading && !allUsers.length ? (
                      <TableRow>
                        <TableCell colSpan={4} sx={{ ...tblCell, textAlign: "center", py: 4 }}>
                          <CircularProgress size={22} sx={{ color: C.orange }} />
                        </TableCell>
                      </TableRow>
                    ) : filteredUsers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} sx={{ ...tblCell, textAlign: "center", color: C.textDim, py: 4 }}>
                          Tidak ada user ditemukan.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredUsers.map((u) => {
                        const rc2 = roleColor(u.role);
                        const isSelf = u.email === email;
                        return (
                          <TableRow key={u.key} sx={{ "&:hover": { bgcolor: C.surfaceAlt }, "&:last-child td": { border: 0 }, ...(isSelf && { bgcolor: alpha(C.orange, 0.03) }) }}>
                            <TableCell sx={tblCell}>
                              <Stack direction="row" alignItems="center" gap={1.2}>
                                <Avatar sx={{ width: 30, height: 30, bgcolor: rc2.bg, color: rc2.color, fontSize: "0.7rem", fontWeight: 700 }}>{getInitials(u.username)}</Avatar>
                                <Box>
                                  <Typography sx={{ fontFamily: fontBody, fontSize: "0.82rem", fontWeight: 600, color: C.text, lineHeight: 1.2 }}>
                                    {u.username}
                                    {isSelf && <Chip label="Anda" size="small" sx={{ ml: 0.8, height: 16, fontSize: "0.6rem", fontWeight: 700, bgcolor: C.orangeSoft, color: C.orange, fontFamily: fontBody }} />}
                                  </Typography>
                                </Box>
                              </Stack>
                            </TableCell>
                            <TableCell sx={{ ...tblCell, color: C.textSub }}>{u.email}</TableCell>
                            <TableCell sx={tblCell}>
                              <Chip label={u.role} size="small" sx={{ bgcolor: rc2.bg, color: rc2.color, fontFamily: fontBody, fontWeight: 700, fontSize: "0.7rem", height: 20, borderRadius: "6px" }} />
                            </TableCell>
                            <TableCell sx={{ ...tblCell, textAlign: "right" }}>
                              <Stack direction="row" justifyContent="flex-end" gap={0.5}>
                                <Tooltip title="Kirim Reset Password" arrow>
                                  <IconButton
                                    size="small"
                                    onClick={() => {
                                      setTargetUser(u);
                                      setResetEmailSent(false);
                                      dispatch(setOpenSuccess(false));
                                      dispatch(setOpenFailed({ isOpen: false, message: "" }));
                                      setResetOpen(true);
                                    }}
                                    sx={{ color: C.amber, "&:hover": { bgcolor: C.amberSoft } }}
                                  >
                                    <LockResetIcon sx={{ fontSize: 17 }} />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title={isSelf ? "Tidak bisa menghapus akun sendiri" : "Hapus User"} arrow>
                                  <span>
                                    <IconButton
                                      size="small"
                                      disabled={isSelf}
                                      onClick={() => {
                                        setTargetUser(u);
                                        dispatch(setOpenSuccess(false));
                                        dispatch(setOpenFailed({ isOpen: false, message: "" }));
                                        setDeleteOpen(true);
                                      }}
                                      sx={{ color: C.red, "&:hover": { bgcolor: C.redSoft }, "&.Mui-disabled": { color: C.textDim } }}
                                    >
                                      <DeleteOutlineIcon sx={{ fontSize: 17 }} />
                                    </IconButton>
                                  </span>
                                </Tooltip>
                              </Stack>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
              <Stack direction="row" alignItems="center" gap={0.8} mt={1.5}>
                <AdminPanelSettingsIcon sx={{ fontSize: 13, color: C.textDim }} />
                <Typography sx={{ fontFamily: fontBody, fontSize: "0.7rem", color: C.textDim, fontStyle: "italic" }}>Penghapusan akun Firebase Auth secara penuh memerlukan Firebase Console atau Cloud Function.</Typography>
              </Stack>
            </SettingSection>
          )}

          {/* 4. Info Aplikasi */}
          <SettingSection icon={<InfoOutlinedIcon sx={{ fontSize: 19 }} />} title="Informasi Aplikasi" subtitle="Detail teknis dan versi sistem" accentColor={C.amber} accentSoft={C.amberSoft} delay={isSuperAdmin ? "0.32s" : "0.24s"}>
            <InfoRow icon={<StorefrontIcon sx={{ fontSize: 16 }} />} label="Nama Aplikasi" value="Warehouse Management System" />
            <InfoRow icon={<BuildIcon sx={{ fontSize: 16 }} />} label="Versi" value="1.0.0" />
            <InfoRow icon={<CalendarTodayIcon sx={{ fontSize: 16 }} />} label="Tahun" value="2024" />
            <InfoRow icon={<ShieldOutlinedIcon sx={{ fontSize: 16 }} />} label="Authentication" value="Firebase Auth" />
            <Box sx={{ mt: 2, bgcolor: C.surfaceAlt, borderRadius: "12px", px: 2, py: 1.5, border: `1px solid ${C.borderLight}` }}>
              <Typography sx={{ fontFamily: fontBody, fontSize: "0.74rem", color: C.textSub, lineHeight: 1.7 }}>Untuk bantuan teknis, hubungi tim pengembang. Data tersimpan aman di Firebase Realtime Database.</Typography>
            </Box>
          </SettingSection>

          {/* 5. Log Out */}
          <SettingSection icon={<LogoutIcon sx={{ fontSize: 19 }} />} title="Keluar Akun" subtitle="Akhiri sesi Anda saat ini" accentColor={C.red} accentSoft={C.redSoft} delay={isSuperAdmin ? "0.4s" : "0.32s"}>
            <Stack direction={{ xs: "column", sm: "row" }} alignItems={{ sm: "center" }} justifyContent="space-between" gap={2}>
              <Box>
                <Typography sx={{ fontFamily: fontBody, fontSize: "0.84rem", color: C.text, fontWeight: 600 }}>Keluar dari sistem</Typography>
                <Typography sx={{ fontFamily: fontBody, fontSize: "0.76rem", color: C.textSub, mt: 0.3 }}>Sesi Anda akan diakhiri dan Anda diarahkan ke halaman login.</Typography>
              </Box>
              <Button
                onClick={() => setLogoutOpen(true)}
                variant="outlined"
                startIcon={<LogoutIcon sx={{ fontSize: 16 }} />}
                disableElevation
                sx={{
                  fontFamily: fontBody,
                  fontWeight: 700,
                  fontSize: "0.84rem",
                  borderRadius: "10px",
                  px: 3,
                  py: 1,
                  textTransform: "none",
                  whiteSpace: "nowrap",
                  flexShrink: 0,
                  color: C.red,
                  borderColor: C.red,
                  "&:hover": { bgcolor: C.redSoft },
                }}
              >
                Log Out
              </Button>
            </Stack>
          </SettingSection>
        </Box>

        {/* ── Create User Dialog ── */}
        <CreateUserDialog open={createOpen} onClose={() => setCreateOpen(false)} onSubmit={(data) => dispatch(createUser(data))} loading={userLoading} error={userError} success={userSuccess} />

        {/* ── Delete Dialog ── */}
        <ConfirmDialog
          open={deleteOpen}
          onClose={() => {
            setDeleteOpen(false);
            setTargetUser(null);
          }}
          title="Hapus User"
          confirmLabel="Hapus"
          confirmColor={C.red}
          loading={userLoading}
          onConfirm={() => dispatch(deleteUserFromDB(targetUser?.key))}
        >
          <Stack direction="row" alignItems="flex-start" gap={1.5}>
            <Avatar sx={{ bgcolor: C.redSoft, color: C.red, width: 38, height: 38, flexShrink: 0 }}>
              <WarningAmberIcon sx={{ fontSize: 19 }} />
            </Avatar>
            <Box>
              <Typography sx={{ fontFamily: fontBody, fontSize: "0.88rem", color: C.text, fontWeight: 600, mb: 0.3 }}>
                Hapus <span style={{ color: C.orange }}>{targetUser?.username}</span>?
              </Typography>
              <Typography sx={{ fontFamily: fontBody, fontSize: "0.8rem", color: C.textSub }}>Data user dihapus dari Realtime Database. Akun Firebase Auth-nya perlu dihapus manual via Firebase Console.</Typography>
            </Box>
          </Stack>
        </ConfirmDialog>

        {/* ── Reset Password Dialog ── */}
        <ConfirmDialog
          open={resetOpen}
          onClose={() => {
            setResetOpen(false);
            setTargetUser(null);
            setResetEmailSent(false);
            dispatch(setOpenSuccess(false));
            dispatch(setOpenFailed({ isOpen: false, message: "" }));
          }}
          title="Reset Password"
          confirmLabel="Kirim Email Reset"
          confirmColor={C.amber}
          loading={userLoading}
          disabled={resetEmailSent || userSuccess}
          onConfirm={() => {
            dispatch(resetUserPassword(targetUser?.email));
            setResetEmailSent(true);
          }}
        >
          {userSuccess || resetEmailSent ? (
            <Stack direction="row" alignItems="center" gap={1.5}>
              <CheckCircleIcon sx={{ color: C.teal, fontSize: 28 }} />
              <Typography sx={{ fontFamily: fontBody, fontSize: "0.88rem", color: C.teal, fontWeight: 600 }}>Email reset berhasil dikirim ke {targetUser?.email}</Typography>
            </Stack>
          ) : (
            <Stack direction="row" alignItems="flex-start" gap={1.5}>
              <Avatar sx={{ bgcolor: C.amberSoft, color: C.amber, width: 38, height: 38, flexShrink: 0 }}>
                <LockResetIcon sx={{ fontSize: 19 }} />
              </Avatar>
              <Box>
                <Typography sx={{ fontFamily: fontBody, fontSize: "0.88rem", color: C.text, fontWeight: 600, mb: 0.3 }}>
                  Kirim link reset ke <span style={{ color: C.orange }}>{targetUser?.email}</span>?
                </Typography>
                <Typography sx={{ fontFamily: fontBody, fontSize: "0.8rem", color: C.textSub }}>User akan menerima email untuk mengatur ulang passwordnya.</Typography>
              </Box>
            </Stack>
          )}
        </ConfirmDialog>

        {/* ── Logout Dialog ── */}
        <ConfirmDialog
          open={logoutOpen}
          onClose={() => setLogoutOpen(false)}
          title="Konfirmasi Log Out"
          confirmLabel="Ya, Log Out"
          confirmColor={C.red}
          onConfirm={() => {
            setLogoutOpen(false);
            dispatch(signout());
          }}
        >
          <Stack direction="row" alignItems="flex-start" gap={1.5}>
            <Avatar sx={{ bgcolor: C.redSoft, color: C.red, width: 38, height: 38, flexShrink: 0 }}>
              <WarningAmberIcon sx={{ fontSize: 19 }} />
            </Avatar>
            <Box>
              <Typography sx={{ fontFamily: fontBody, fontSize: "0.88rem", color: C.text, fontWeight: 600, mb: 0.3 }}>Apakah Anda yakin ingin keluar?</Typography>
              <Typography sx={{ fontFamily: fontBody, fontSize: "0.8rem", color: C.textSub }}>Sesi aktif Anda akan diakhiri. Anda perlu login kembali untuk mengakses sistem.</Typography>
            </Box>
          </Stack>
        </ConfirmDialog>
      </Box>
    </Box>
  );
}
