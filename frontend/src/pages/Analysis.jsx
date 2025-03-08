import { useState, useEffect, useRef } from 'react';
import {
  Box,
  Heading,
  Text,
  Flex,
  VStack,
  HStack,
  SimpleGrid,
  Card,
  CardBody,
  CardHeader,
  Button,
  Icon,
  Select,
  FormControl,
  FormLabel,
  Badge,
  useColorModeValue,
  Spinner,
  Alert,
  AlertIcon,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Divider,
  Tag,
  Input,
  Switch,
  Radio,
  RadioGroup,
  Stack,
  Tooltip,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  InputGroup,
  InputLeftElement,
  Checkbox,
  CheckboxGroup,
} from '@chakra-ui/react';
import { 
  ChevronDownIcon, 
  InfoIcon, 
  DownloadIcon, 
  SearchIcon, 
  RepeatIcon,
  CalendarIcon,
  TimeIcon,
  QuestionIcon
} from '@chakra-ui/icons';
import { 
  FiBarChart2, 
  FiPieChart, 
  FiTrendingUp, 
  FiUsers, 
  FiActivity, 
  FiClock, 
  FiFilter, 
  FiSettings, 
  FiDownload,
  FiSliders,
  FiZap,
  FiGrid
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { AdminService } from '../services/api';

// Sahte veri: Analiz Türleri
const ANALYSIS_TYPES = [
  {
    id: 'performance',
    name: 'Performans Analizi',
    description: 'Çalışanların performans metriklerinin detaylı analizi',
    icon: FiBarChart2,
    color: 'blue',
  },
  {
    id: 'activity',
    name: 'Aktivite Analizi',
    description: 'Çalışanların sistem aktivitelerinin zaman analizi',
    icon: FiActivity,
    color: 'green',
  },
  {
    id: 'comparative',
    name: 'Karşılaştırmalı Analiz',
    description: 'Departmanlar veya çalışanlar arası karşılaştırma',
    icon: FiTrendingUp,
    color: 'orange',
  },
  {
    id: 'training',
    name: 'Eğitim Etkililik Analizi',
    description: 'Eğitimlerin performansa etkisinin analizi',
    icon: FiZap,
    color: 'purple',
  },
  {
    id: 'trends',
    name: 'Trend Analizi',
    description: 'Zaman içinde performans ve aktivite trendleri',
    icon: FiTrendingUp,
    color: 'teal',
  },
];

// Performans Veri Seti (departmanlara göre çeşitli metrikler)
const PERFORMANCE_DATA = {
  departments: ['Product Development', 'Sales', 'HR', 'Marketing', 'Finance'],
  metrics: {
    overall_performance: [82, 75, 88, 71, 79],
    email_efficiency: [78, 68, 85, 72, 75],
    time_management: [85, 70, 92, 65, 80],
    meeting_effectiveness: [76, 80, 86, 75, 82],
    focus_time: [89, 72, 84, 68, 79],
    collaboration: [84, 85, 90, 75, 78],
  },
  teams: {
    'Product Development': {
      names: ['Team-1', 'Team-2', 'Team-3'],
      metrics: {
        overall_performance: [85, 79, 83],
        email_efficiency: [80, 75, 82],
        time_management: [88, 81, 85],
        meeting_effectiveness: [75, 77, 78],
        focus_time: [92, 85, 88],
        collaboration: [83, 84, 86],
      }
    },
    'Sales': {
      names: ['Team-1', 'Team-2'],
      metrics: {
        overall_performance: [77, 73],
        email_efficiency: [70, 65],
        time_management: [72, 68],
        meeting_effectiveness: [83, 77],
        focus_time: [75, 69],
        collaboration: [88, 82],
      }
    }
  }
};

// Aktivite Veri Seti (zaman bazlı aktivite metrikleri)
const ACTIVITY_DATA = {
  timeLabels: ['8:00', '9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'],
  metrics: {
    email_activity: [5, 18, 25, 30, 8, 15, 28, 22, 20, 10],
    meeting_time: [0, 45, 30, 0, 0, 60, 45, 15, 0, 0],
    focused_work: [45, 0, 10, 25, 30, 0, 0, 15, 30, 40],
    collaboration: [10, 15, 15, 5, 0, 15, 15, 10, 10, 10],
  },
  daily: {
    labels: ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma'],
    metrics: {
      email_sent: [35, 42, 38, 30, 25],
      email_received: [68, 75, 82, 70, 55],
      meeting_hours: [3.5, 4.2, 2.8, 5.0, 2.5],
      focus_hours: [2.5, 1.8, 3.2, 1.5, 3.0],
    }
  }
};

// Karşılaştırmalı Veri Seti (önceki döneme göre karşılaştırma)
const COMPARATIVE_DATA = {
  metrics: [
    { 
      name: 'Email Verimliliği', 
      current_period: 78, 
      previous_period: 72,
      change: 8.3,
      trend: 'up'
    },
    { 
      name: 'Toplantı Etkinliği', 
      current_period: 82, 
      previous_period: 85,
      change: -3.5,
      trend: 'down'
    },
    { 
      name: 'Odaklanma Süresi', 
      current_period: 65, 
      previous_period: 58,
      change: 12.1,
      trend: 'up'
    },
    { 
      name: 'İşbirliği İndeksi', 
      current_period: 79, 
      previous_period: 75,
      change: 5.3,
      trend: 'up'
    },
    { 
      name: 'Zaman Yönetimi', 
      current_period: 81, 
      previous_period: 73,
      change: 10.9,
      trend: 'up'
    },
    { 
      name: 'Genel Performans', 
      current_period: 80, 
      previous_period: 76,
      change: 5.3,
      trend: 'up'
    },
  ],
  periods: {
    current: 'Son 30 Gün',
    previous: 'Önceki 30 Gün',
  }
};

// Eğitim Etki Verisi
const TRAINING_IMPACT_DATA = {
  training_types: ['Zaman Yönetimi', 'Email Yönetimi', 'Toplantı Verimliliği', 'İşbirliği', 'Odaklanma Teknikleri'],
  metrics: {
    before_training: [68, 72, 65, 75, 60],
    after_training: [82, 85, 78, 85, 75],
    long_term: [79, 81, 75, 82, 72],
  },
  completion_rate: 78,
  average_improvement: 22,
  best_performing: 'Zaman Yönetimi',
  participants: 125,
};

// Trend Verisi
const TREND_DATA = {
  months: ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran'],
  metrics: {
    overall_performance: [72, 73, 75, 78, 80, 82],
    email_efficiency: [68, 70, 72, 75, 77, 78],
    time_management: [65, 68, 72, 75, 79, 85],
    meeting_effectiveness: [70, 72, 74, 73, 78, 76],
  }
};

// Mock veri: Departmanlar
const DEPARTMENTS = [
  { id: 'all', name: 'Tümü' },
  { id: 'product_development', name: 'Product Development' },
  { id: 'sales', name: 'Sales' },
  { id: 'hr', name: 'HR' },
  { id: 'marketing', name: 'Marketing' },
  { id: 'finance', name: 'Finance' },
];

// Mock veri: Takımlar
const TEAMS = [
  { id: 'all', name: 'Tümü' },
  { id: 'team-1', name: 'Team-1' },
  { id: 'team-2', name: 'Team-2' },
  { id: 'team-3', name: 'Team-3' },
];

// Mock veri: Periyotlar
const PERIODS = [
  { id: 'last_7_days', name: 'Son 7 Gün' },
  { id: 'last_30_days', name: 'Son 30 Gün' },
  { id: 'last_90_days', name: 'Son 90 Gün' },
  { id: 'current_month', name: 'Bu Ay' },
  { id: 'current_quarter', name: 'Bu Çeyrek' },
  { id: 'current_year', name: 'Bu Yıl' },
  { id: 'custom', name: 'Özel Tarih Aralığı' },
];

// Renk skalası oluşturma yardımcı fonksiyonu
const getColorScale = (value, inverse = false) => {
  if (inverse) {
    if (value >= 80) return "red";
    if (value >= 60) return "orange";
    if (value >= 40) return "yellow";
    return "green";
  } else {
    if (value >= 80) return "green";
    if (value >= 60) return "blue";
    if (value >= 40) return "yellow";
    return "red";
  }
};

// Trend ikonunu belirleme
const getTrendIcon = (trend) => {
  switch (trend) {
    case 'up':
      return { color: 'green.500', icon: FiTrendingUp };
    case 'down':
      return { color: 'red.500', icon: FiTrendingUp, transform: 'rotate(180deg)' };
    default:
      return { color: 'gray.500', icon: FiActivity };
  }
};

const Analysis = () => {
  const { isAdmin } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [selectedAnalysisType, setSelectedAnalysisType] = useState('performance');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedTeam, setSelectedTeam] = useState('all');
  const [selectedPeriod, setSelectedPeriod] = useState('last_30_days');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [compareWithPrevious, setCompareWithPrevious] = useState(true);
  const [selectedMetrics, setSelectedMetrics] = useState([
    'overall_performance', 
    'email_efficiency', 
    'time_management', 
    'meeting_effectiveness', 
    'focus_time', 
    'collaboration'
  ]);
  const chartContainerRef = useRef(null);

  const cardBg = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.700', 'gray.100');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (isAdmin()) {
          // Admin verilerini yükle
          // gerçek API'den veri alınacak kısım
          
          // Mock veriler için gecikme ekleyelim
          setTimeout(() => {
            setLoading(false);
          }, 1000);
        } else {
          // Admin değilse bu sayfaya erişim yok
          setError('Bu sayfaya erişim yetkiniz bulunmamaktadır.');
          setLoading(false);
        }
      } catch (err) {
        console.error('Veri yükleme hatası:', err);
        setError('Veri yüklenirken bir sorun oluştu.');
        setLoading(false);
      }
    };

    fetchData();
  }, [isAdmin]);

  const exportAnalysisData = () => {
    // Burası gerçek uygulamada API'ye istek atarak veriyi CSV veya Excel formatında indirecek
    alert('Analiz verileri indiriliyor...');
  };

  // Analiz türüne göre başlık ve açıklama getirme
  const getAnalysisTypeInfo = () => {
    const analysisType = ANALYSIS_TYPES.find(at => at.id === selectedAnalysisType);
    return analysisType ? {
      name: analysisType.name,
      description: analysisType.description,
      icon: analysisType.icon,
      color: analysisType.color
    } : {
      name: 'Analiz',
      description: 'Sistem verilerinizin analizi',
      icon: FiBarChart2,
      color: 'blue'
    };
  };

  // Performans analizi içeriği
  const renderPerformanceAnalysis = () => {
    const data = PERFORMANCE_DATA;
    
    return (
      <VStack spacing={6} align="stretch">
        <SimpleGrid columns={{ base: 1, md: 5 }} spacing={4}>
          <Stat bg={cardBg} p={4} borderRadius="lg" boxShadow="sm">
            <StatLabel>Ortalama Performans</StatLabel>
            <StatNumber>
              {data.metrics.overall_performance.reduce((a, b) => a + b, 0) / data.metrics.overall_performance.length}%
            </StatNumber>
            <StatHelpText>Tüm departmanlar</StatHelpText>
          </Stat>
          
          <Stat bg={cardBg} p={4} borderRadius="lg" boxShadow="sm">
            <StatLabel>En Yüksek Performans</StatLabel>
            <StatNumber>
              {Math.max(...data.metrics.overall_performance)}%
            </StatNumber>
            <StatHelpText>{data.departments[data.metrics.overall_performance.indexOf(Math.max(...data.metrics.overall_performance))]}</StatHelpText>
          </Stat>
          
          <Stat bg={cardBg} p={4} borderRadius="lg" boxShadow="sm">
            <StatLabel>En Düşük Performans</StatLabel>
            <StatNumber>
              {Math.min(...data.metrics.overall_performance)}%
            </StatNumber>
            <StatHelpText>{data.departments[data.metrics.overall_performance.indexOf(Math.min(...data.metrics.overall_performance))]}</StatHelpText>
          </Stat>
          
          <Stat bg={cardBg} p={4} borderRadius="lg" boxShadow="sm">
            <StatLabel>En İyi Metrik</StatLabel>
            <StatNumber>
              {Object.keys(data.metrics).reduce((a, b) => 
                data.metrics[a].reduce((sum, val) => sum + val, 0) / data.metrics[a].length >
                data.metrics[b].reduce((sum, val) => sum + val, 0) / data.metrics[b].length
                ? a : b
              ).split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
            </StatNumber>
            <StatHelpText>Ortalama</StatHelpText>
          </Stat>
          
          <Stat bg={cardBg} p={4} borderRadius="lg" boxShadow="sm">
            <StatLabel>Departman Sayısı</StatLabel>
            <StatNumber>
              {data.departments.length}
            </StatNumber>
            <StatHelpText>Tüm organizasyon</StatHelpText>
          </Stat>
        </SimpleGrid>

        <Card>
          <CardHeader>
            <Heading size="md">Departman Bazlı Performans Analizi</Heading>
          </CardHeader>
          <CardBody>
            <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
              <Box>
                <Heading size="sm" mb={4}>Departman Performans Karşılaştırması</Heading>
                <Text color="gray.500" mb={2}>Seçilen metriklere göre departmanların performans karşılaştırması</Text>
                {/* Burada gerçek projede bir grafik kütüphanesi (Chart.js, ApexCharts vs.) kullanılacak */}
                <Box height="300px" bg="gray.100" borderRadius="md" display="flex" justifyContent="center" alignItems="center">
                  <Text>Departman Performans Grafiği</Text>
                </Box>
              </Box>
              
              <Box>
                <Heading size="sm" mb={4}>Metrik Dağılımı</Heading>
                <Text color="gray.500" mb={2}>Tüm performans metriklerinin departmanlara göre dağılımı</Text>
                {/* Burada gerçek projede bir grafik kütüphanesi (Chart.js, ApexCharts vs.) kullanılacak */}
                <Box height="300px" bg="gray.100" borderRadius="md" display="flex" justifyContent="center" alignItems="center">
                  <Text>Metrik Dağılım Grafiği</Text>
                </Box>
              </Box>
            </SimpleGrid>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <Heading size="md">Detaylı Metrik Analizi</Heading>
          </CardHeader>
          <CardBody>
            <VStack spacing={6} align="stretch">
              {selectedMetrics.map(metric => (
                <Box key={metric}>
                  <Heading size="sm" mb={2}>
                    {metric.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                  </Heading>
                  <SimpleGrid columns={{ base: 1, md: data.departments.length }} spacing={2}>
                    {data.departments.map((department, index) => (
                      <Card key={`${department}-${metric}`} variant="outline">
                        <CardBody>
                          <VStack>
                            <Text fontWeight="bold">{department}</Text>
                            <Text fontSize="2xl" color={`${getColorScale(data.metrics[metric][index])}.500`}>
                              {data.metrics[metric][index]}%
                            </Text>
                          </VStack>
                        </CardBody>
                      </Card>
                    ))}
                  </SimpleGrid>
                </Box>
              ))}
            </VStack>
          </CardBody>
        </Card>
      </VStack>
    );
  };

  // Aktivite analizi içeriği
  const renderActivityAnalysis = () => {
    const data = ACTIVITY_DATA;
    
    return (
      <VStack spacing={6} align="stretch">
        <SimpleGrid columns={{ base: 1, md: 4 }} spacing={4}>
          <Stat bg={cardBg} p={4} borderRadius="lg" boxShadow="sm">
            <StatLabel>Günlük Ortalama Email</StatLabel>
            <StatNumber>
              {data.daily.metrics.email_sent.reduce((a, b) => a + b, 0) / data.daily.metrics.email_sent.length +
               data.daily.metrics.email_received.reduce((a, b) => a + b, 0) / data.daily.metrics.email_received.length}
            </StatNumber>
            <StatHelpText>Gönderilen ve alınan</StatHelpText>
          </Stat>
          
          <Stat bg={cardBg} p={4} borderRadius="lg" boxShadow="sm">
            <StatLabel>Günlük Toplantı Süresi</StatLabel>
            <StatNumber>
              {data.daily.metrics.meeting_hours.reduce((a, b) => a + b, 0) / data.daily.metrics.meeting_hours.length} saat
            </StatNumber>
            <StatHelpText>Ortalama</StatHelpText>
          </Stat>
          
          <Stat bg={cardBg} p={4} borderRadius="lg" boxShadow="sm">
            <StatLabel>Günlük Odaklanma Süresi</StatLabel>
            <StatNumber>
              {data.daily.metrics.focus_hours.reduce((a, b) => a + b, 0) / data.daily.metrics.focus_hours.length} saat
            </StatNumber>
            <StatHelpText>Ortalama</StatHelpText>
          </Stat>
          
          <Stat bg={cardBg} p={4} borderRadius="lg" boxShadow="sm">
            <StatLabel>En Aktif Gün</StatLabel>
            <StatNumber>
              {data.daily.labels[data.daily.metrics.email_sent.indexOf(Math.max(...data.daily.metrics.email_sent))]}
            </StatNumber>
            <StatHelpText>Email aktivitesi</StatHelpText>
          </Stat>
        </SimpleGrid>

        <Card>
          <CardHeader>
            <Heading size="md">Günlük Aktivite Dağılımı</Heading>
          </CardHeader>
          <CardBody>
            <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
              <Box>
                <Heading size="sm" mb={4}>Saat Bazlı Aktivite</Heading>
                <Text color="gray.500" mb={2}>Çalışma saatleri boyunca aktivite dağılımı</Text>
                {/* Burada gerçek projede bir grafik kütüphanesi (Chart.js, ApexCharts vs.) kullanılacak */}
                <Box height="300px" bg="gray.100" borderRadius="md" display="flex" justifyContent="center" alignItems="center">
                  <Text>Saat Bazlı Aktivite Grafiği</Text>
                </Box>
              </Box>
              
              <Box>
                <Heading size="sm" mb={4}>Haftalık Aktivite Dağılımı</Heading>
                <Text color="gray.500" mb={2}>Haftanın günlerine göre email ve toplantı aktivitesi</Text>
                {/* Burada gerçek projede bir grafik kütüphanesi (Chart.js, ApexCharts vs.) kullanılacak */}
                <Box height="300px" bg="gray.100" borderRadius="md" display="flex" justifyContent="center" alignItems="center">
                  <Text>Haftalık Aktivite Grafiği</Text>
                </Box>
              </Box>
            </SimpleGrid>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <Heading size="md">Aktivite Detayları</Heading>
          </CardHeader>
          <CardBody>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
              <Box>
                <Heading size="sm" mb={4}>Email Aktivitesi</Heading>
                <Box height="240px" bg="gray.100" borderRadius="md" display="flex" justifyContent="center" alignItems="center">
                  <Text>Email Aktivite Grafiği</Text>
                </Box>
                <HStack mt={4} justify="space-between">
                  <Box>
                    <Text color="gray.500">Toplam Giden</Text>
                    <Text fontWeight="bold">{data.daily.metrics.email_sent.reduce((a, b) => a + b, 0)}</Text>
                  </Box>
                  <Box>
                    <Text color="gray.500">Toplam Gelen</Text>
                    <Text fontWeight="bold">{data.daily.metrics.email_received.reduce((a, b) => a + b, 0)}</Text>
                  </Box>
                  <Box>
                    <Text color="gray.500">Günlük Ortalama</Text>
                    <Text fontWeight="bold">
                      {Math.round((data.daily.metrics.email_sent.reduce((a, b) => a + b, 0) + 
                        data.daily.metrics.email_received.reduce((a, b) => a + b, 0)) / 
                        data.daily.labels.length)}
                    </Text>
                  </Box>
                </HStack>
              </Box>
              
              <Box>
                <Heading size="sm" mb={4}>Toplantı ve Odaklanma Dengesi</Heading>
                <Box height="240px" bg="gray.100" borderRadius="md" display="flex" justifyContent="center" alignItems="center">
                  <Text>Toplantı/Odaklanma Denge Grafiği</Text>
                </Box>
                <HStack mt={4} justify="space-between">
                  <Box>
                    <Text color="gray.500">Toplantı Zamanı</Text>
                    <Text fontWeight="bold">
                      {data.daily.metrics.meeting_hours.reduce((a, b) => a + b, 0)} saat
                    </Text>
                  </Box>
                  <Box>
                    <Text color="gray.500">Odaklanma Zamanı</Text>
                    <Text fontWeight="bold">
                      {data.daily.metrics.focus_hours.reduce((a, b) => a + b, 0)} saat
                    </Text>
                  </Box>
                  <Box>
                    <Text color="gray.500">Oran</Text>
                    <Text fontWeight="bold">
                      {Math.round((data.daily.metrics.focus_hours.reduce((a, b) => a + b, 0) / 
                        data.daily.metrics.meeting_hours.reduce((a, b) => a + b, 0)) * 100) / 100}
                    </Text>
                  </Box>
                </HStack>
              </Box>
            </SimpleGrid>
          </CardBody>
        </Card>
      </VStack>
    );
  };
  // Karşılaştırmalı analiz içeriği
  const renderComparativeAnalysis = () => {
    const data = COMPARATIVE_DATA;
    
    return (
      <VStack spacing={6} align="stretch">
        <SimpleGrid columns={{ base: 1, md: 4 }} spacing={4}>
          <Stat bg={cardBg} p={4} borderRadius="lg" boxShadow="sm">
            <StatLabel>İyileşme Oranı</StatLabel>
            <StatNumber>
              {Math.round(data.metrics.filter(m => m.trend === 'up').length / data.metrics.length * 100)}%
            </StatNumber>
            <StatHelpText>Metriklerin iyileşme oranı</StatHelpText>
          </Stat>
          
          <Stat bg={cardBg} p={4} borderRadius="lg" boxShadow="sm">
            <StatLabel>En Büyük İyileşme</StatLabel>
            <StatNumber>
              {Math.max(...data.metrics.map(m => m.change))}%
            </StatNumber>
            <StatHelpText>{data.metrics.find(m => m.change === Math.max(...data.metrics.map(m => m.change))).name}</StatHelpText>
          </Stat>
          
          <Stat bg={cardBg} p={4} borderRadius="lg" boxShadow="sm">
            <StatLabel>En Büyük Düşüş</StatLabel>
            <StatNumber>
              {Math.min(...data.metrics.map(m => m.change))}%
            </StatNumber>
            <StatHelpText>{data.metrics.find(m => m.change === Math.min(...data.metrics.map(m => m.change))).name}</StatHelpText>
          </Stat>
          
          <Stat bg={cardBg} p={4} borderRadius="lg" boxShadow="sm">
            <StatLabel>Ortalama Değişim</StatLabel>
            <StatNumber>
              {Math.round(data.metrics.reduce((a, b) => a + b.change, 0) / data.metrics.length * 10) / 10}%
            </StatNumber>
            <StatHelpText>Tüm metrikler</StatHelpText>
          </Stat>
        </SimpleGrid>

        <Card>
          <CardHeader>
            <Heading size="md">Dönemsel Karşılaştırma</Heading>
            <Text color="gray.500">
              {data.periods.current} ve {data.periods.previous} karşılaştırması
            </Text>
          </CardHeader>
          <CardBody>
            <Box>
              {/* Burada gerçek projede bir grafik kütüphanesi (Chart.js, ApexCharts vs.) kullanılacak */}
              <Box height="300px" bg="gray.100" borderRadius="md" display="flex" justifyContent="center" alignItems="center" mb={6}>
                <Text>Karşılaştırmalı Metrik Grafiği</Text>
              </Box>
              
              <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
                {data.metrics.map(metric => (
                  <Card key={metric.name} variant="outline">
                    <CardBody>
                      <Flex align="start" justify="space-between">
                        <VStack align="start" spacing={1}>
                          <Text fontSize="sm" color="gray.500">
                            {metric.name}
                          </Text>
                          <HStack>
                            <Text fontSize="xl" fontWeight="bold">
                              {metric.current_period}%
                            </Text>
                            <Flex 
                              align="center" 
                              color={metric.trend === 'up' ? 'green.500' : 'red.500'}
                            >
                              <Icon 
                                as={getTrendIcon(metric.trend).icon} 
                                mr={1} 
                                transform={getTrendIcon(metric.trend).transform} 
                              />
                              <Text fontSize="sm">
                                {metric.change}%
                              </Text>
                            </Flex>
                          </HStack>
                          <Text fontSize="xs" color="gray.500">
                            Önceki: {metric.previous_period}%
                          </Text>
                        </VStack>
                        <Box 
                          w="60px" 
                          h="40px" 
                          bg="gray.100" 
                          borderRadius="md"
                        >
                          {/* Mini grafik gelecek */}
                        </Box>
                      </Flex>
                    </CardBody>
                  </Card>
                ))}
              </SimpleGrid>
            </Box>
          </CardBody>
        </Card>
      </VStack>
    );
  };

  // Eğitim analizi içeriği
  const renderTrainingAnalysis = () => {
    const data = TRAINING_IMPACT_DATA;
    
    return (
      <VStack spacing={6} align="stretch">
        <SimpleGrid columns={{ base: 1, md: 4 }} spacing={4}>
          <Stat bg={cardBg} p={4} borderRadius="lg" boxShadow="sm">
            <StatLabel>Ortalama İyileşme</StatLabel>
            <StatNumber>
              {data.average_improvement}%
            </StatNumber>
            <StatHelpText>Eğitim sonrası</StatHelpText>
          </Stat>
          
          <Stat bg={cardBg} p={4} borderRadius="lg" boxShadow="sm">
            <StatLabel>Tamamlama Oranı</StatLabel>
            <StatNumber>
              {data.completion_rate}%
            </StatNumber>
            <StatHelpText>Tüm eğitimler</StatHelpText>
          </Stat>
          
          <Stat bg={cardBg} p={4} borderRadius="lg" boxShadow="sm">
            <StatLabel>En Etkili Eğitim</StatLabel>
            <StatNumber>
              {data.best_performing}
            </StatNumber>
            <StatHelpText>Performans artışı</StatHelpText>
          </Stat>
          
          <Stat bg={cardBg} p={4} borderRadius="lg" boxShadow="sm">
            <StatLabel>Toplam Katılımcı</StatLabel>
            <StatNumber>
              {data.participants}
            </StatNumber>
            <StatHelpText>Tüm eğitimler</StatHelpText>
          </Stat>
        </SimpleGrid>

        <Card>
          <CardHeader>
            <Heading size="md">Eğitim Etkisi Analizi</Heading>
          </CardHeader>
          <CardBody>
            <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
              <Box>
                <Heading size="sm" mb={4}>Eğitim Öncesi vs. Sonrası</Heading>
                <Text color="gray.500" mb={2}>Eğitim öncesi ve sonrası performans değişimi</Text>
                {/* Burada gerçek projede bir grafik kütüphanesi (Chart.js, ApexCharts vs.) kullanılacak */}
                <Box height="300px" bg="gray.100" borderRadius="md" display="flex" justifyContent="center" alignItems="center">
                  <Text>Eğitim Etkisi Grafiği</Text>
                </Box>
              </Box>
              
              <Box>
                <Heading size="sm" mb={4}>Uzun Vadeli Etki</Heading>
                <Text color="gray.500" mb={2}>Eğitim sonrası uzun vadeli performans etkisi</Text>
                {/* Burada gerçek projede bir grafik kütüphanesi (Chart.js, ApexCharts vs.) kullanılacak */}
                <Box height="300px" bg="gray.100" borderRadius="md" display="flex" justifyContent="center" alignItems="center">
                  <Text>Uzun Vadeli Etki Grafiği</Text>
                </Box>
              </Box>
            </SimpleGrid>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <Heading size="md">Eğitim Bazlı Performans Analizi</Heading>
          </CardHeader>
          <CardBody>
            <VStack spacing={4} align="stretch">
              {data.training_types.map((training, index) => (
                <Card key={training} variant="outline">
                  <CardBody>
                    <Flex direction={{ base: 'column', md: 'row' }} align="center" justify="space-between">
                      <Box mb={{ base: 4, md: 0 }}>
                        <Heading size="sm">{training}</Heading>
                        <Text color="gray.500" fontSize="sm">Performans Değişimi</Text>
                      </Box>
                      
                      <HStack spacing={8}>
                        <VStack align="center">
                          <Text color="gray.500" fontSize="xs">Öncesi</Text>
                          <Text fontWeight="bold">{data.metrics.before_training[index]}%</Text>
                        </VStack>
                        
                        <VStack align="center">
                          <Text color="gray.500" fontSize="xs">Sonrası</Text>
                          <Text fontWeight="bold" color="green.500">{data.metrics.after_training[index]}%</Text>
                        </VStack>
                        
                        <VStack align="center">
                          <Text color="gray.500" fontSize="xs">Uzun Vadeli</Text>
                          <Text fontWeight="bold" color={data.metrics.long_term[index] >= data.metrics.after_training[index] * 0.9 ? "green.500" : "orange.500"}>
                            {data.metrics.long_term[index]}%
                          </Text>
                        </VStack>
                        
                        <VStack align="center">
                          <Text color="gray.500" fontSize="xs">İyileşme</Text>
                          <Text fontWeight="bold" color="blue.500">
                            {data.metrics.after_training[index] - data.metrics.before_training[index]}%
                          </Text>
                        </VStack>
                      </HStack>
                    </Flex>
                  </CardBody>
                </Card>
              ))}
            </VStack>
          </CardBody>
        </Card>
      </VStack>
    );
  };

  // Trend analizi içeriği
  const renderTrendAnalysis = () => {
    const data = TREND_DATA;
    
    return (
      <VStack spacing={6} align="stretch">
        <SimpleGrid columns={{ base: 1, md: 4 }} spacing={4}>
          <Stat bg={cardBg} p={4} borderRadius="lg" boxShadow="sm">
            <StatLabel>Ortalama Artış</StatLabel>
            <StatNumber>
              {Math.round((
                data.metrics.overall_performance[data.metrics.overall_performance.length-1] / 
                data.metrics.overall_performance[0] - 1) * 100)
              }%
            </StatNumber>
            <StatHelpText>Genel Performans</StatHelpText>
          </Stat>
          
          <Stat bg={cardBg} p={4} borderRadius="lg" boxShadow="sm">
            <StatLabel>En Büyük Gelişme</StatLabel>
            <StatNumber>
              {Object.keys(data.metrics).map(key => {
                const values = data.metrics[key];
                return {
                  metric: key,
                  growth: (values[values.length-1] / values[0] - 1) * 100
                };
              }).sort((a, b) => b.growth - a.growth)[0].growth.toFixed(1)}%
            </StatNumber>
            <StatHelpText>
              {Object.keys(data.metrics).map(key => {
                const values = data.metrics[key];
                return {
                  metric: key,
                  growth: (values[values.length-1] / values[0] - 1) * 100
                };
              }).sort((a, b) => b.growth - a.growth)[0].metric.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
            </StatHelpText>
          </Stat>
          
          <Stat bg={cardBg} p={4} borderRadius="lg" boxShadow="sm">
            <StatLabel>En İstikrarlı Metrik</StatLabel>
            <StatNumber>
              {Object.keys(data.metrics).map(key => {
                const values = data.metrics[key];
                // Standart sapmayı hesapla
                const mean = values.reduce((a, b) => a + b, 0) / values.length;
                const variance = values.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / values.length;
                const stdDev = Math.sqrt(variance);
                return {
                  metric: key,
                  std: stdDev
                };
              }).sort((a, b) => a.std - b.std)[0].metric.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
            </StatNumber>
            <StatHelpText>En az dalgalanma gösteren</StatHelpText>
          </Stat>
          
          <Stat bg={cardBg} p={4} borderRadius="lg" boxShadow="sm">
            <StatLabel>Analiz Süresi</StatLabel>
            <StatNumber>
              {data.months.length} ay
            </StatNumber>
            <StatHelpText>{data.months[0]} - {data.months[data.months.length-1]}</StatHelpText>
          </Stat>
        </SimpleGrid>

        <Card>
          <CardHeader>
            <Heading size="md">Zaman İçinde Performans Trendi</Heading>
          </CardHeader>
          <CardBody>
            <Box height="400px" bg="gray.100" borderRadius="md" display="flex" justifyContent="center" alignItems="center" mb={6}>
              <Text>Performans Trend Grafiği</Text>
            </Box>
            
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
              <Card>
                <CardHeader>
                  <Heading size="sm">Metrik Bazlı Büyüme</Heading>
                </CardHeader>
                <CardBody>
                  <VStack spacing={4} align="stretch">
                    {Object.keys(data.metrics).map(metric => {
                      const values = data.metrics[metric];
                      const growth = (values[values.length-1] / values[0] - 1) * 100;
                      return (
                        <Flex key={metric} justify="space-between" align="center">
                          <Text>{metric.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</Text>
                          <HStack>
                            <Text>{growth.toFixed(1)}%</Text>
                            <Box w="100px">
                              <Divider orientation="horizontal" />
                            </Box>
                            <HStack>
                              <Text>{values[0]}%</Text>
                              <Icon 
                                as={FiTrendingUp} 
                                color={growth >= 0 ? "green.500" : "red.500"} 
                                transform={growth >= 0 ? "none" : "rotate(180deg)"}
                              />
                              <Text>{values[values.length-1]}%</Text>
                            </HStack>
                          </HStack>
                        </Flex>
                      );
                    })}
                  </VStack>
                </CardBody>
              </Card>
              
              <Card>
                <CardHeader>
                  <Heading size="sm">Aylık Değişim Oranları</Heading>
                </CardHeader>
                <CardBody>
                  <Box height="200px" bg="gray.100" borderRadius="md" display="flex" justifyContent="center" alignItems="center">
                    <Text>Aylık Değişim Grafiği</Text>
                  </Box>
                </CardBody>
              </Card>
            </SimpleGrid>
          </CardBody>
        </Card>
      </VStack>
    );
  };

  if (loading) {
    return (
      <Flex justify="center" align="center" h="50vh">
        <Spinner size="xl" color="blue.500" />
      </Flex>
    );
  }

  if (error) {
    return (
      <Alert status="error" variant="subtle" flexDirection="column" alignItems="center" justifyContent="center" textAlign="center" height="200px">
        <AlertIcon boxSize="40px" mr={0} />
        <Text mt={4} mb={1} fontSize="lg">
          Erişim Hatası
        </Text>
        <Text>{error}</Text>
      </Alert>
    );
  }

  const analysisInfo = getAnalysisTypeInfo();

  return (
    <Box p={5}>
      <VStack spacing={8} align="stretch">
        {/* Başlık */}
        <Flex justifyContent="space-between" alignItems="center" wrap="wrap" gap={4}>
          <Box>
            <Heading size="lg">Analiz Merkezi</Heading>
            <Text color="gray.600">
              Sistem verilerinizi detaylı analiz edin ve raporlayın
            </Text>
          </Box>
          <Button 
            leftIcon={<DownloadIcon />} 
            colorScheme="blue" 
            onClick={exportAnalysisData}
          >
            Analiz Verilerini İndir
          </Button>
        </Flex>

        {/* Analiz Türleri */}
        <SimpleGrid columns={{ base: 1, md: 3, lg: 5 }} spacing={4}>
          {ANALYSIS_TYPES.map(analysisType => (
            <Card 
              key={analysisType.id} 
              bg={cardBg} 
              cursor="pointer"
              borderWidth={2}
              borderColor={selectedAnalysisType === analysisType.id ? `${analysisType.color}.400` : 'transparent'}
              _hover={{ shadow: 'md', borderColor: `${analysisType.color}.200` }}
              transition="all 0.2s"
              onClick={() => setSelectedAnalysisType(analysisType.id)}
            >
              <CardBody>
                <Flex align="center">
                  <Box 
                    bg={`${analysisType.color}.50`} 
                    color={`${analysisType.color}.500`} 
                    p={3} 
                    borderRadius="full" 
                    mr={4}
                  >
                    <Icon as={analysisType.icon} boxSize={5} />
                  </Box>
                  <Box>
                    <Heading size="sm">{analysisType.name}</Heading>
                    <Text fontSize="xs" color="gray.500" mt={1}>{analysisType.description}</Text>
                  </Box>
                </Flex>
              </CardBody>
            </Card>
          ))}
        </SimpleGrid>

        {/* Filtreler */}
        <Card>
          <CardHeader>
            <Flex align="center">
              <Icon as={FiFilter} mr={2} />
              <Heading size="md">Filtreler</Heading>
            </Flex>
          </CardHeader>
          <CardBody>
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
              <FormControl>
                <FormLabel>Departman</FormLabel>
                <Select 
                  value={selectedDepartment} 
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                >
                  {DEPARTMENTS.map(dept => (
                    <option key={dept.id} value={dept.id}>{dept.name}</option>
                  ))}
                </Select>
              </FormControl>

              <FormControl isDisabled={selectedDepartment === 'all'}>
                <FormLabel>Takım</FormLabel>
                <Select 
                  value={selectedTeam} 
                  onChange={(e) => setSelectedTeam(e.target.value)}
                >
                  {TEAMS.map(team => (
                    <option key={team.id} value={team.id}>{team.name}</option>
                  ))}
                </Select>
              </FormControl>

              <FormControl>
                <FormLabel>Dönem</FormLabel>
                <Select 
                  value={selectedPeriod} 
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                >
                  {PERIODS.map(period => (
                    <option key={period.id} value={period.id}>{period.name}</option>
                  ))}
                </Select>
              </FormControl>
            </SimpleGrid>

            {selectedPeriod === 'custom' && (
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} mt={4}>
                <FormControl>
                  <FormLabel>Başlangıç Tarihi</FormLabel>
                  <Input 
                    type="date" 
                    value={startDate} 
                    onChange={(e) => setStartDate(e.target.value)} 
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Bitiş Tarihi</FormLabel>
                  <Input 
                    type="date" 
                    value={endDate} 
                    onChange={(e) => setEndDate(e.target.value)} 
                  />
                </FormControl>
              </SimpleGrid>
            )}

            <Flex mt={4} align="center">
              <FormControl display="flex" alignItems="center" maxW="300px">
                <FormLabel htmlFor="compare-with-previous" mb="0">
                  Önceki dönemle karşılaştır
                </FormLabel>
                <Switch 
                  id="compare-with-previous" 
                  isChecked={compareWithPrevious}
                  onChange={(e) => setCompareWithPrevious(e.target.checked)}
                />
              </FormControl>
            </Flex>
          </CardBody>
        </Card>

        {/* Seçilen Analiz Türüne Göre İçerik */}
        <Card>
          <CardHeader>
            <Flex align="center">
              <Box 
                bg={`${analysisInfo.color}.50`} 
                color={`${analysisInfo.color}.500`} 
                p={2} 
                borderRadius="full" 
                mr={3}
              >
                <Icon as={analysisInfo.icon} boxSize={5} />
              </Box>
              <Box>
                <Heading size="md">{analysisInfo.name}</Heading>
                <Text color="gray.500" fontSize="sm">{analysisInfo.description}</Text>
              </Box>
            </Flex>
          </CardHeader>
          <CardBody>
            {selectedAnalysisType === 'performance' && renderPerformanceAnalysis()}
            {selectedAnalysisType === 'activity' && renderActivityAnalysis()}
            {selectedAnalysisType === 'comparative' && renderComparativeAnalysis()}
            {selectedAnalysisType === 'training' && renderTrainingAnalysis()}
            {selectedAnalysisType === 'trends' && renderTrendAnalysis()}
          </CardBody>
        </Card>
      </VStack>
    </Box>
  );
};

export default Analysis; 