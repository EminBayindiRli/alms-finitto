import { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Switch,
  FormControlLabel,
  Divider,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import {
  VisibilityOff as VisibilityOffIcon,
  DarkMode as DarkModeIcon,
  Language as LanguageIcon,
  Notifications as NotificationsIcon,
  Delete as DeleteIcon,
  CloudDownload as CloudDownloadIcon,
} from '@mui/icons-material';

const Settings = () => {
  const [settings, setSettings] = useState({
    darkMode: false,
    language: 'tr',
    notifications: true,
    privacy: true,
    dataExport: false,
  });

  const [openDialog, setOpenDialog] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSettingChange = (setting: string, value: boolean | string) => {
    setSettings({
      ...settings,
      [setting]: value,
    });
    setSaveSuccess(false);
  };

  const handleSave = () => {
    // Burada API'ye ayarları kaydedecek
    console.log('Settings saved', settings);
    setSaveSuccess(true);
    
    // 5 saniye sonra başarı mesajını kaldır
    setTimeout(() => {
      setSaveSuccess(false);
    }, 5000);
  };

  const handleDialogOpen = () => {
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  return (
    <Box sx={{ flexGrow: 1, p: 2 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Ayarlar
      </Typography>

      {saveSuccess && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Ayarlarınız başarıyla kaydedildi!
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Uygulama Ayarları
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <List>
              <ListItem>
                <ListItemIcon>
                  <DarkModeIcon />
                </ListItemIcon>
                <ListItemText 
                  primary="Karanlık Mod" 
                  secondary="Uygulamayı karanlık temada görüntüle" 
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.darkMode}
                      onChange={(e) => handleSettingChange('darkMode', e.target.checked)}
                    />
                  }
                  label=""
                />
              </ListItem>
              
              <ListItem>
                <ListItemIcon>
                  <LanguageIcon />
                </ListItemIcon>
                <ListItemText 
                  primary="Dil" 
                  secondary="Uygulama dilini seçin" 
                />
                <FormControl variant="outlined" size="small" sx={{ minWidth: 120 }}>
                  <Select
                    value={settings.language}
                    onChange={(e) => handleSettingChange('language', e.target.value)}
                    displayEmpty
                  >
                    <MenuItem value="tr">Türkçe</MenuItem>
                    <MenuItem value="en">English</MenuItem>
                    <MenuItem value="de">Deutsch</MenuItem>
                    <MenuItem value="fr">Français</MenuItem>
                  </Select>
                </FormControl>
              </ListItem>
              
              <ListItem>
                <ListItemIcon>
                  <NotificationsIcon />
                </ListItemIcon>
                <ListItemText 
                  primary="Bildirimler" 
                  secondary="Tüm bildirimleri etkinleştir/devre dışı bırak" 
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.notifications}
                      onChange={(e) => handleSettingChange('notifications', e.target.checked)}
                    />
                  }
                  label=""
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Gizlilik Ayarları
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <List>
              <ListItem>
                <ListItemIcon>
                  <VisibilityOffIcon />
                </ListItemIcon>
                <ListItemText 
                  primary="Profil Gizliliği" 
                  secondary="Profilimi diğer kullanıcılardan gizle" 
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.privacy}
                      onChange={(e) => handleSettingChange('privacy', e.target.checked)}
                    />
                  }
                  label=""
                />
              </ListItem>
              
              <ListItem>
                <ListItemIcon>
                  <CloudDownloadIcon />
                </ListItemIcon>
                <ListItemText 
                  primary="Veri İndirme" 
                  secondary="Tüm kişisel verilerinizi indirebilirsiniz" 
                />
                <Button 
                  variant="outlined" 
                  size="small"
                  onClick={() => handleSettingChange('dataExport', true)}
                >
                  İndir
                </Button>
              </ListItem>
              
              <ListItem>
                <ListItemIcon>
                  <DeleteIcon color="error" />
                </ListItemIcon>
                <ListItemText 
                  primary="Hesabı Sil" 
                  secondary="Hesabınızı ve tüm verilerinizi kalıcı olarak silin" 
                />
                <Button 
                  variant="outlined" 
                  color="error" 
                  size="small"
                  onClick={handleDialogOpen}
                >
                  Sil
                </Button>
              </ListItem>
            </List>
          </Paper>
          
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button 
              variant="contained" 
              color="primary"
              size="large"
              onClick={handleSave}
            >
              Ayarları Kaydet
            </Button>
          </Box>
        </Grid>
      </Grid>
      
      <Dialog
        open={openDialog}
        onClose={handleDialogClose}
      >
        <DialogTitle>Hesabı Silmeyi Onayla</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Hesabınızı silmek istediğinizden emin misiniz? Bu işlem geri alınamaz ve tüm verileriniz kalıcı olarak silinecektir.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            İptal
          </Button>
          <Button onClick={handleDialogClose} color="error">
            Hesabımı Sil
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Settings; 