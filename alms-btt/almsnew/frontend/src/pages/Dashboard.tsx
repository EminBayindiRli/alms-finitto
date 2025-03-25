import { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Card,
  CardContent,
  CardHeader,
  Divider,
} from '@mui/material';
import {
  People as PeopleIcon,
  School as SchoolIcon,
  Assessment as AssessmentIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

// Örnek veri
const mockData = {
  overview: {
    totalUsers: 1250,
    activeUsers: 876,
    totalCourses: 42,
    completionRate: 68,
  },
  courseEngagement: [
    { name: 'Ocak', tamamlama: 65, katılım: 78 },
    { name: 'Şubat', tamamlama: 59, katılım: 63 },
    { name: 'Mart', tamamlama: 80, katılım: 85 },
    { name: 'Nisan', tamamlama: 81, katılım: 88 },
    { name: 'Mayıs', tamamlama: 56, katılım: 69 },
    { name: 'Haziran', tamamlama: 75, katılım: 82 },
  ],
  userActivity: [
    { name: 'Pts', değer: 240 },
    { name: 'Sal', değer: 300 },
    { name: 'Çrş', değer: 280 },
    { name: 'Prş', değer: 320 },
    { name: 'Cum', değer: 450 },
    { name: 'Cts', değer: 180 },
    { name: 'Paz', değer: 120 },
  ],
};

const StatCard = ({ title, value, icon, color }: { title: string; value: number | string; icon: React.ReactNode; color: string }) => (
  <Card sx={{ height: '100%' }}>
    <CardContent>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: `${color}20`, mr: 2 }}>
          {icon}
        </Box>
        <Typography variant="h6" component="div">
          {title}
        </Typography>
      </Box>
      <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
        {value}
        {title.includes('Oran') && '%'}
      </Typography>
    </CardContent>
  </Card>
);

const Dashboard = () => {
  const [data, setData] = useState(mockData);

  useEffect(() => {
    // Burada gerçek API'den veri çekilecek
    // Şimdilik mock veri kullanıyoruz
  }, []);

  return (
    <Box sx={{ flexGrow: 1, p: 2 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Gösterge Paneli
      </Typography>
      
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Toplam Kullanıcı" 
            value={data.overview.totalUsers} 
            icon={<PeopleIcon sx={{ color: '#1976d2' }} />} 
            color="#1976d2" 
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Aktif Kullanıcı" 
            value={data.overview.activeUsers} 
            icon={<PeopleIcon sx={{ color: '#4caf50' }} />} 
            color="#4caf50" 
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Toplam Kurs" 
            value={data.overview.totalCourses} 
            icon={<SchoolIcon sx={{ color: '#ff9800' }} />} 
            color="#ff9800" 
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Tamamlama Oranı" 
            value={data.overview.completionRate} 
            icon={<AssessmentIcon sx={{ color: '#9c27b0' }} />} 
            color="#9c27b0" 
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" component="h2" gutterBottom>
              Kurs Katılım ve Tamamlama Oranları
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={data.courseEngagement}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="katılım" fill="#1976d2" name="Katılım Oranı (%)" />
                <Bar dataKey="tamamlama" fill="#4caf50" name="Tamamlama Oranı (%)" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" component="h2" gutterBottom>
              Haftalık Kullanıcı Aktivitesi
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={data.userActivity}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="değer" 
                  stroke="#8884d8" 
                  name="Aktif Kullanıcı" 
                  strokeWidth={2}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard; 