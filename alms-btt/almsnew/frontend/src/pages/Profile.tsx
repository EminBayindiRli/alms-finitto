import { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  Avatar,
  Divider,
  Card,
  CardContent,
  Switch,
  FormControlLabel,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
} from '@mui/material';
import {
  Person as PersonIcon,
  School as SchoolIcon,
  Notifications as NotificationsIcon,
  Security as SecurityIcon,
  AccountCircle as AccountCircleIcon,
} from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

const Profile = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '+90 555 123 4567',
    department: 'Bilgisayar Mühendisliği',
    role: 'Öğrenci',
  });

  const [notifications, setNotifications] = useState({
    email: true,
    system: true,
    updates: false,
  });

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleNotificationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setNotifications({
      ...notifications,
      [name]: checked,
    });
  };

  const handleSaveChanges = () => {
    // Burada API'ye profil güncellemesi gönderilecek
    console.log('Profile saved', form);
  };

  return (
    <Box sx={{ flexGrow: 1, p: 2 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Profil
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card sx={{ mb: 2 }}>
            <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Avatar 
                sx={{ width: 100, height: 100, mb: 2 }}
                src="" 
                alt={form.name}
              >
                <AccountCircleIcon sx={{ fontSize: 60 }} />
              </Avatar>
              <Typography variant="h5" component="div" gutterBottom>
                {form.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {form.email}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {form.phone}
              </Typography>
              <Chip label={form.role} color="primary" sx={{ mt: 1 }} />
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Departman Bilgileri
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <SchoolIcon />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Departman" 
                    secondary={form.department} 
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <PersonIcon />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Rol" 
                    secondary={form.role} 
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Kişisel Bilgiler
            </Typography>
            <Divider sx={{ mb: 3 }} />
            
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Ad Soyad"
                  name="name"
                  value={form.name}
                  onChange={handleFormChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="E-posta"
                  name="email"
                  value={form.email}
                  onChange={handleFormChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Telefon"
                  name="phone"
                  value={form.phone}
                  onChange={handleFormChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Departman"
                  name="department"
                  value={form.department}
                  onChange={handleFormChange}
                />
              </Grid>
              <Grid item xs={12}>
                <Button 
                  variant="contained" 
                  color="primary"
                  onClick={handleSaveChanges}
                >
                  Değişiklikleri Kaydet
                </Button>
              </Grid>
            </Grid>
          </Paper>

          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Bildirim Ayarları
            </Typography>
            <Divider sx={{ mb: 3 }} />
            
            <List>
              <ListItem>
                <ListItemIcon>
                  <NotificationsIcon />
                </ListItemIcon>
                <ListItemText 
                  primary="E-posta Bildirimleri" 
                  secondary="Önemli duyurular ve hatırlatıcılar için e-posta alın" 
                />
                <FormControlLabel 
                  control={
                    <Switch 
                      checked={notifications.email} 
                      onChange={handleNotificationChange} 
                      name="email" 
                    />
                  } 
                  label="" 
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <NotificationsIcon />
                </ListItemIcon>
                <ListItemText 
                  primary="Sistem Bildirimleri" 
                  secondary="Uygulama içi bildirimler alın" 
                />
                <FormControlLabel 
                  control={
                    <Switch 
                      checked={notifications.system} 
                      onChange={handleNotificationChange} 
                      name="system" 
                    />
                  } 
                  label="" 
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <NotificationsIcon />
                </ListItemIcon>
                <ListItemText 
                  primary="Güncellemeler" 
                  secondary="Yeni özellikler ve güncellemeler hakkında bildirimler alın" 
                />
                <FormControlLabel 
                  control={
                    <Switch 
                      checked={notifications.updates} 
                      onChange={handleNotificationChange} 
                      name="updates" 
                    />
                  } 
                  label="" 
                />
              </ListItem>
            </List>
            
            <Box sx={{ mt: 2 }}>
              <Button 
                variant="contained" 
                color="primary" 
                startIcon={<SecurityIcon />}
              >
                Şifre Değiştir
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Profile; 