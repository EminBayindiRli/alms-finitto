import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Tabs,
  Tab,
  TextField,
  MenuItem,
  Button,
} from '@mui/material';
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  AreaChart,
  Area,
} from 'recharts';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`analytics-tabpanel-${index}`}
      aria-labelledby={`analytics-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

// Örnek veri
const performanceData = [
  { name: '1. Hafta', ortalama: 65, en_yuksek: 95, en_dusuk: 40 },
  { name: '2. Hafta', ortalama: 68, en_yuksek: 97, en_dusuk: 45 },
  { name: '3. Hafta', ortalama: 75, en_yuksek: 100, en_dusuk: 55 },
  { name: '4. Hafta', ortalama: 72, en_yuksek: 98, en_dusuk: 50 },
  { name: '5. Hafta', ortalama: 80, en_yuksek: 100, en_dusuk: 60 },
  { name: '6. Hafta', ortalama: 78, en_yuksek: 99, en_dusuk: 58 },
];

const contentUsageData = [
  { name: 'Video', değer: 40 },
  { name: 'Döküman', değer: 30 },
  { name: 'Quiz', değer: 20 },
  { name: 'Canlı Ders', değer: 10 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const timeSpentData = [
  { name: 'Pazartesi', değer: 120 },
  { name: 'Salı', değer: 150 },
  { name: 'Çarşamba', değer: 180 },
  { name: 'Perşembe', değer: 140 },
  { name: 'Cuma', değer: 160 },
  { name: 'Cumartesi', değer: 90 },
  { name: 'Pazar', değer: 70 },
];

const Analytics = () => {
  const [tabValue, setTabValue] = useState(0);
  const [dateRange, setDateRange] = useState('son-30-gun');

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  useEffect(() => {
    // Burada gerçek API'den veri çekilecek
    // Şimdilik mock veri kullanıyoruz
  }, [dateRange]);

  return (
    <Box sx={{ flexGrow: 1, p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Analitik
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            select
            label="Tarih Aralığı"
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            size="small"
            sx={{ minWidth: 150 }}
          >
            <MenuItem value="son-7-gun">Son 7 Gün</MenuItem>
            <MenuItem value="son-30-gun">Son 30 Gün</MenuItem>
            <MenuItem value="son-90-gun">Son 90 Gün</MenuItem>
            <MenuItem value="tum-zamanlar">Tüm Zamanlar</MenuItem>
          </TextField>
          <Button variant="contained">Rapor İndir</Button>
        </Box>
      </Box>

      <Paper sx={{ width: '100%', borderRadius: 2 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="Performans Analizi" />
          <Tab label="İçerik Kullanımı" />
          <Tab label="Zaman Analizi" />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          <Typography variant="h6" gutterBottom>
            Öğrenci Performans Analizi
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart
                  data={performanceData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="ortalama"
                    name="Ortalama Puan"
                    stroke="#8884d8"
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="en_yuksek"
                    name="En Yüksek Puan"
                    stroke="#82ca9d"
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="en_dusuk"
                    name="En Düşük Puan"
                    stroke="#ff7300"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Grid>
          </Grid>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Typography variant="h6" gutterBottom>
            İçerik Kullanım Analizi
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                  <Pie
                    data={contentUsageData}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={150}
                    fill="#8884d8"
                    dataKey="değer"
                  >
                    {contentUsageData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="body1" gutterBottom>
                İçerik kullanımı, öğrencilerin farklı kaynaklara erişim oranlarını gösterir. Bu dönemde:
              </Typography>
              <ul>
                <li>Video içerikleri en çok kullanılan kaynak türüdür (%40)</li>
                <li>Döküman kaynaklarının kullanımı %30 oranındadır</li>
                <li>Quiz ve değerlendirme araçları %20 oranında kullanılmaktadır</li>
                <li>Canlı dersler %10 ile en az kullanılan içerik türüdür</li>
              </ul>
            </Grid>
          </Grid>
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <Typography variant="h6" gutterBottom>
            Zaman Kullanım Analizi
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart
                  data={timeSpentData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis label={{ value: 'Dakika', angle: -90, position: 'insideLeft' }} />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="değer"
                    name="Harcanan Süre (dk)"
                    stroke="#82ca9d"
                    fill="#82ca9d"
                    fillOpacity={0.3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Grid>
          </Grid>
        </TabPanel>
      </Paper>
    </Box>
  );
};

export default Analytics; 