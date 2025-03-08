import { useState, useEffect } from 'react';
import {
  Box,
  Heading,
  Text,
  SimpleGrid,
  Card,
  CardHeader,
  CardBody,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Flex,
  Badge,
  Select,
  Stack,
  Progress,
  Tooltip,
  Spinner,
  Alert,
  AlertIcon,
  useColorModeValue,
} from '@chakra-ui/react';
import { Line, Bar, Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  RadialLinearScale,
  Title,
  Tooltip as ChartTooltip,
  Legend,
  Filler,
} from 'chart.js';
import { useAuth } from '../context/AuthContext';
import { EmployeeService, AdminService } from '../services/api';

// ChartJS bileşenlerini kaydet
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  RadialLinearScale,
  Title,
  ChartTooltip,
  Legend,
  Filler
);

const Performance = () => {
  const { user, isAdmin } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [employeeData, setEmployeeData] = useState(null);
  const [adminData, setAdminData] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [selectedDepartment, setSelectedDepartment] = useState('All');
  const [trendPeriod, setTrendPeriod] = useState('weekly');

  const cardBg = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.700', 'gray.200');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        if (isAdmin()) {
          // Admin verilerini yükle
          const data = await AdminService.getAllAnalyses();
          setAdminData(data);
        } else {
          // Çalışan verilerini yükle
          const employeeId = user?.id || '1';
          const data = await EmployeeService.getAnalysis(employeeId);
          setEmployeeData(data);
        }
      } catch (err) {
        console.error('Veri yükleme hatası:', err);
        setError('Veriler yüklenirken bir sorun oluştu. Lütfen daha sonra tekrar deneyin.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, isAdmin]);

  // Çalışan performans karşılaştırma grafiği (Admin için)
  const getEmployeeComparisonData = () => {
    if (!adminData) return null;

    // Örnek veri - gerçek veri için backend API'den veri çekilmelidir
    return {
      labels: ['Görev Tamamlama', 'E-posta Verimliliği', 'Toplantı Verimliliği', 'İletişim', 'İşbirliği'],
      datasets: [
        {
          label: 'Şirket Ortalaması',
          data: [0.75, 0.68, 0.72, 0.65, 0.70],
          backgroundColor: 'rgba(53, 162, 235, 0.2)',
          borderColor: 'rgba(53, 162, 235, 1)',
          borderWidth: 1,
        },
        {
          label: 'En İyi Performans',
          data: [0.92, 0.88, 0.90, 0.85, 0.89],
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
        },
        {
          label: 'En Düşük Performans',
          data: [0.60, 0.55, 0.58, 0.52, 0.56],
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1,
        },
      ]
    };
  };

  // Departman performans grafiği (Admin için)
  const getDepartmentPerformanceData = () => {
    if (!adminData || !adminData.department_statistics) return null;

    const departments = Object.keys(adminData.department_statistics);
    const taskCompletionRates = departments.map(dept => 
      adminData.department_statistics[dept].avg_task_completion * 100
    );
    const emailResponseRates = departments.map(dept => 
      adminData.department_statistics[dept].avg_email_response * 100
    );

    return {
      labels: departments,
      datasets: [
        {
          label: 'Görev Tamamlama (%)',
          data: taskCompletionRates,
          backgroundColor: 'rgba(53, 162, 235, 0.5)',
          borderColor: 'rgba(53, 162, 235, 1)',
          borderWidth: 1,
        },
        {
          label: 'E-posta Yanıt Verimliliği (%)',
          data: emailResponseRates,
          backgroundColor: 'rgba(75, 192, 192, 0.5)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
        }
      ]
    };
  };

  // Çalışan performans radar grafiği
  const getPerformanceRadarData = () => {
    if (!employeeData || !employeeData.current_metrics) return null;

    const metrics = employeeData.current_metrics;
    
    return {
      labels: ['Görev Tamamlama', 'E-posta Verimliliği', 'Toplantı Verimliliği', 'İletişim', 'İşbirliği', 'Zaman Yönetimi', 'Dosya Aktivitesi'],
      datasets: [
        {
          label: 'Kişisel Performans',
          data: [
            metrics.task_completion_rate * 100,
            metrics.email_efficiency * 100,
            metrics.meeting_efficiency * 100,
            metrics.communication_score * 100,
            metrics.collaboration_score * 100,
            metrics.time_efficiency * 100,
            metrics.file_activity * 100
          ],
          backgroundColor: 'rgba(53, 162, 235, 0.2)',
          borderColor: 'rgba(53, 162, 235, 1)',
          borderWidth: 1,
        },
        {
          label: 'Takım Ortalaması',
          data: [80, 75, 70, 82, 78, 76, 73],
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
        }
      ]
    };
  };

  // Çalışan için performans grafiği - zaman içindeki değişim
  const getPerformanceTrendData = () => {
    if (!employeeData || !employeeData.historical_trends) return null;

    const trends = employeeData.historical_trends;
    const labels = trends.task_completion.map(t => `Gün ${t.day}`);
    
    return {
      labels,
      datasets: [
        {
          label: 'Görev Tamamlama (%)',
          data: trends.task_completion.map(t => t.completion_rate * 100),
          borderColor: 'rgba(53, 162, 235, 1)',
          backgroundColor: 'rgba(53, 162, 235, 0.5)',
          fill: false,
          tension: 0.1
        },
        {
          label: 'İşbirliği Puanı (%)',
          data: trends.collaboration.map(t => (t.file_sharing + t.comments) / 20 * 100),
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: 'rgba(75, 192, 192, 0.5)',
          fill: false,
          tension: 0.1
        },
        {
          label: 'Toplantı Katılımı (%)',
          data: trends.collaboration.map(t => t.meeting_participation * 100),
          borderColor: 'rgba(255, 159, 64, 1)',
          backgroundColor: 'rgba(255, 159, 64, 0.5)',
          fill: false,
          tension: 0.1
        }
      ]
    };
  };

  // Admin Dashboard
  const renderAdminPerformance = () => {
    if (!adminData) return null;

    const departmentData = getDepartmentPerformanceData();
    const employeeComparisonData = getEmployeeComparisonData();

    return (
      <Box p={5}>
        <Heading mb={6}>Performans Analizi - Şirket Geneli</Heading>
        
        {/* Departman Filtreleme */}
        <Flex mb={5} align="center">
          <Text mr={2} fontWeight="bold">Departman:</Text>
          <Select 
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            w="200px"
          >
            <option value="All">Tümü</option>
            {Object.keys(adminData.department_statistics).map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </Select>
        </Flex>
        
        {/* Performans Metrikleri */}
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={5} mb={8}>
          <Card bg={cardBg}>
            <CardBody>
              <Stat>
                <StatLabel>Ortalama Görev Tamamlama</StatLabel>
                <StatNumber>
                  {selectedDepartment === 'All' 
                    ? `${Math.round(Object.values(adminData.department_statistics).reduce((sum, dept) => sum + dept.avg_task_completion, 0) / Object.keys(adminData.department_statistics).length * 100)}%` 
                    : `${Math.round(adminData.department_statistics[selectedDepartment].avg_task_completion * 100)}%`
                  }
                </StatNumber>
              </Stat>
            </CardBody>
          </Card>
          
          <Card bg={cardBg}>
            <CardBody>
              <Stat>
                <StatLabel>E-posta Yanıt Verimliliği</StatLabel>
                <StatNumber>
                  {selectedDepartment === 'All' 
                    ? `${Math.round(Object.values(adminData.department_statistics).reduce((sum, dept) => sum + dept.avg_email_response, 0) / Object.keys(adminData.department_statistics).length * 100)}%` 
                    : `${Math.round(adminData.department_statistics[selectedDepartment].avg_email_response * 100)}%`
                  }
                </StatNumber>
              </Stat>
            </CardBody>
          </Card>
          
          <Card bg={cardBg}>
            <CardBody>
              <Stat>
                <StatLabel>Toplam Çalışan</StatLabel>
                <StatNumber>{adminData.total_employees}</StatNumber>
              </Stat>
            </CardBody>
          </Card>
        </SimpleGrid>
        
        {/* Grafik Sekmeleri */}
        <Tabs isLazy onChange={setActiveTab} index={activeTab}>
          <TabList>
            <Tab>Departman Performansı</Tab>
            <Tab>Çalışan Karşılaştırması</Tab>
            <Tab>Trend Analizi</Tab>
          </TabList>
          
          <TabPanels>
            {/* Departman Performans Grafiği */}
            <TabPanel>
              <Card bg={cardBg} p={4}>
                <CardHeader>
                  <Heading size="md">Departman Performans Karşılaştırması</Heading>
                </CardHeader>
                <CardBody>
                  <Box h="400px">
                    {departmentData && <Bar 
                      data={departmentData} 
                      options={{ 
                        maintainAspectRatio: false,
                        scales: {
                          y: {
                            beginAtZero: true,
                            max: 100
                          }
                        }
                      }} 
                    />}
                  </Box>
                </CardBody>
              </Card>
            </TabPanel>
            
            {/* Çalışan Karşılaştırma Grafiği */}
            <TabPanel>
              <Card bg={cardBg} p={4}>
                <CardHeader>
                  <Heading size="md">Çalışan Performans Karşılaştırması</Heading>
                </CardHeader>
                <CardBody>
                  <Box h="400px">
                    {employeeComparisonData && <Radar 
                      data={employeeComparisonData} 
                      options={{ 
                        maintainAspectRatio: false,
                        scales: {
                          r: {
                            beginAtZero: true,
                            max: 1,
                            ticks: {
                              stepSize: 0.2
                            }
                          }
                        }
                      }} 
                    />}
                  </Box>
                </CardBody>
              </Card>
            </TabPanel>
            
            {/* Trend Analizi Grafiği */}
            <TabPanel>
              <Card bg={cardBg} p={4}>
                <CardHeader>
                  <Flex justify="space-between" align="center">
                    <Heading size="md">Performans Trend Analizi</Heading>
                    <Select 
                      value={trendPeriod}
                      onChange={(e) => setTrendPeriod(e.target.value)}
                      w="150px"
                    >
                      <option value="weekly">Haftalık</option>
                      <option value="monthly">Aylık</option>
                      <option value="quarterly">Üç Aylık</option>
                    </Select>
                  </Flex>
                </CardHeader>
                <CardBody>
                  <Box h="400px">
                    <Line 
                      data={{
                        labels: ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran'],
                        datasets: [
                          {
                            label: 'Ortalama Görev Tamamlama',
                            data: [75, 78, 76, 79, 82, 85],
                            borderColor: 'rgba(53, 162, 235, 1)',
                            backgroundColor: 'rgba(53, 162, 235, 0.5)',
                            tension: 0.1
                          },
                          {
                            label: 'Ortalama İşbirliği',
                            data: [68, 70, 72, 75, 74, 78],
                            borderColor: 'rgba(75, 192, 192, 1)',
                            backgroundColor: 'rgba(75, 192, 192, 0.5)',
                            tension: 0.1
                          }
                        ]
                      }} 
                      options={{ 
                        maintainAspectRatio: false,
                        scales: {
                          y: {
                            beginAtZero: true,
                            max: 100
                          }
                        }
                      }} 
                    />
                  </Box>
                </CardBody>
              </Card>
            </TabPanel>
          </TabPanels>
        </Tabs>
        
        {/* Performans Dağılımı */}
        <Card bg={cardBg} mt={8}>
          <CardHeader>
            <Heading size="md">Performans Dağılımı</Heading>
          </CardHeader>
          <CardBody>
            <Stack spacing={4}>
              <Box>
                <Flex justify="space-between" mb={1}>
                  <Text>Yüksek Performans (%25)</Text>
                  <Text>4 Çalışan</Text>
                </Flex>
                <Progress value={25} colorScheme="green" borderRadius="md" />
              </Box>
              
              <Box>
                <Flex justify="space-between" mb={1}>
                  <Text>Orta-Yüksek Performans (%35)</Text>
                  <Text>6 Çalışan</Text>
                </Flex>
                <Progress value={35} colorScheme="blue" borderRadius="md" />
              </Box>
              
              <Box>
                <Flex justify="space-between" mb={1}>
                  <Text>Orta Performans (%20)</Text>
                  <Text>3 Çalışan</Text>
                </Flex>
                <Progress value={20} colorScheme="yellow" borderRadius="md" />
              </Box>
              
              <Box>
                <Flex justify="space-between" mb={1}>
                  <Text>Düşük-Orta Performans (%15)</Text>
                  <Text>2 Çalışan</Text>
                </Flex>
                <Progress value={15} colorScheme="orange" borderRadius="md" />
              </Box>
              
              <Box>
                <Flex justify="space-between" mb={1}>
                  <Text>Düşük Performans (%5)</Text>
                  <Text>1 Çalışan</Text>
                </Flex>
                <Progress value={5} colorScheme="red" borderRadius="md" />
              </Box>
            </Stack>
          </CardBody>
        </Card>
      </Box>
    );
  };

  // Çalışan Dashboard
  const renderEmployeePerformance = () => {
    if (!employeeData) return null;

    const performanceRadarData = getPerformanceRadarData();
    const performanceTrendData = getPerformanceTrendData();
    const metrics = employeeData.current_metrics;

    return (
      <Box p={5}>
        <Heading mb={6}>Performans Analizi - Kişisel</Heading>
        
        {/* Performans Özeti Kartları */}
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={5} mb={8}>
          <Card bg={cardBg}>
            <CardBody>
              <Stat>
                <StatLabel>Genel Performans</StatLabel>
                <StatNumber>
                  {Math.round(employeeData.performance_summary.overall_score * 100)}%
                </StatNumber>
                <StatHelpText>
                  <StatArrow type="increase" />
                  3% Artış
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>
          
          <Card bg={cardBg}>
            <CardBody>
              <Stat>
                <StatLabel>Görev Tamamlama</StatLabel>
                <StatNumber>{Math.round(metrics.task_completion_rate * 100)}%</StatNumber>
                <StatHelpText>
                  <StatArrow type="increase" />
                  5% Artış
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>
          
          <Card bg={cardBg}>
            <CardBody>
              <Stat>
                <StatLabel>E-posta Verimliliği</StatLabel>
                <StatNumber>{Math.round(metrics.email_efficiency * 100)}%</StatNumber>
                <StatHelpText>
                  <StatArrow type="decrease" />
                  2% Azalış
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>
          
          <Card bg={cardBg}>
            <CardBody>
              <Stat>
                <StatLabel>İşbirliği Puanı</StatLabel>
                <StatNumber>{Math.round(metrics.collaboration_score * 100)}%</StatNumber>
                <StatHelpText>
                  <StatArrow type="increase" />
                  8% Artış
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>
        </SimpleGrid>
        
        {/* Performans Radar ve Trend Grafikleri */}
        <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={5} mb={8}>
          <Card bg={cardBg}>
            <CardHeader>
              <Heading size="md">Performans Metrikleri</Heading>
            </CardHeader>
            <CardBody>
              <Box h="300px">
                {performanceRadarData && <Radar data={performanceRadarData} options={{ maintainAspectRatio: false }} />}
              </Box>
            </CardBody>
          </Card>
          
          <Card bg={cardBg}>
            <CardHeader>
              <Flex justify="space-between" align="center">
                <Heading size="md">Performans Trendi</Heading>
                <Select 
                  value={trendPeriod}
                  onChange={(e) => setTrendPeriod(e.target.value)}
                  w="150px"
                >
                  <option value="weekly">Haftalık</option>
                  <option value="monthly">Aylık</option>
                </Select>
              </Flex>
            </CardHeader>
            <CardBody>
              <Box h="300px">
                {performanceTrendData && <Line data={performanceTrendData} options={{ maintainAspectRatio: false }} />}
              </Box>
            </CardBody>
          </Card>
        </SimpleGrid>
        
        {/* Detaylı Metrikler */}
        <Card bg={cardBg}>
          <CardHeader>
            <Heading size="md">Detaylı Performans Metrikleri</Heading>
          </CardHeader>
          <CardBody>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
              {/* Görev Tamamlama */}
              <Box>
                <Text fontWeight="bold" mb={2}>Görev Tamamlama</Text>
                <Stack spacing={3}>
                  <Box>
                    <Flex justify="space-between" mb={1}>
                      <Text fontSize="sm">Zamanında Tamamlanan Görevler</Text>
                      <Badge colorScheme="green">{Math.round(metrics.task_completion_rate * 100)}%</Badge>
                    </Flex>
                    <Progress value={metrics.task_completion_rate * 100} colorScheme="green" borderRadius="md" />
                  </Box>
                  
                  <Box>
                    <Flex justify="space-between" mb={1}>
                      <Text fontSize="sm">Görev Kalitesi</Text>
                      <Badge colorScheme="blue">85%</Badge>
                    </Flex>
                    <Progress value={85} colorScheme="blue" borderRadius="md" />
                  </Box>
                </Stack>
              </Box>
              
              {/* İletişim ve İşbirliği */}
              <Box>
                <Text fontWeight="bold" mb={2}>İletişim ve İşbirliği</Text>
                <Stack spacing={3}>
                  <Box>
                    <Flex justify="space-between" mb={1}>
                      <Text fontSize="sm">E-posta Yanıt Süresi</Text>
                      <Badge colorScheme="blue">{Math.round(metrics.email_efficiency * 100)}%</Badge>
                    </Flex>
                    <Progress value={metrics.email_efficiency * 100} colorScheme="blue" borderRadius="md" />
                  </Box>
                  
                  <Box>
                    <Flex justify="space-between" mb={1}>
                      <Text fontSize="sm">İşbirliği</Text>
                      <Badge colorScheme="purple">{Math.round(metrics.collaboration_score * 100)}%</Badge>
                    </Flex>
                    <Progress value={metrics.collaboration_score * 100} colorScheme="purple" borderRadius="md" />
                  </Box>
                </Stack>
              </Box>
              
              {/* Toplantı Etkinliği */}
              <Box>
                <Text fontWeight="bold" mb={2}>Toplantı Etkinliği</Text>
                <Stack spacing={3}>
                  <Box>
                    <Flex justify="space-between" mb={1}>
                      <Text fontSize="sm">Toplantı Verimliliği</Text>
                      <Badge colorScheme="orange">{Math.round(metrics.meeting_efficiency * 100)}%</Badge>
                    </Flex>
                    <Progress value={metrics.meeting_efficiency * 100} colorScheme="orange" borderRadius="md" />
                  </Box>
                  
                  <Box>
                    <Flex justify="space-between" mb={1}>
                      <Text fontSize="sm">Katılım Oranı</Text>
                      <Badge colorScheme="green">92%</Badge>
                    </Flex>
                    <Progress value={92} colorScheme="green" borderRadius="md" />
                  </Box>
                </Stack>
              </Box>
              
              {/* Zaman Yönetimi */}
              <Box>
                <Text fontWeight="bold" mb={2}>Zaman Yönetimi</Text>
                <Stack spacing={3}>
                  <Box>
                    <Flex justify="space-between" mb={1}>
                      <Text fontSize="sm">Odaklanma Süresi</Text>
                      <Badge colorScheme="blue">{Math.round(metrics.time_efficiency * 100)}%</Badge>
                    </Flex>
                    <Progress value={metrics.time_efficiency * 100} colorScheme="blue" borderRadius="md" />
                  </Box>
                  
                  <Box>
                    <Flex justify="space-between" mb={1}>
                      <Text fontSize="sm">Dosya Aktivitesi</Text>
                      <Badge colorScheme="purple">{Math.round(metrics.file_activity * 100)}%</Badge>
                    </Flex>
                    <Progress value={metrics.file_activity * 100} colorScheme="purple" borderRadius="md" />
                  </Box>
                </Stack>
              </Box>
            </SimpleGrid>
          </CardBody>
        </Card>
        
        {/* Takım Karşılaştırması */}
        <Card bg={cardBg} mt={8}>
          <CardHeader>
            <Heading size="md">Takım İçindeki Durumunuz</Heading>
          </CardHeader>
          <CardBody>
            <Text mb={4}>
              {employeeData.segment_info ? (
                <>Siz <Badge colorScheme="blue">{employeeData.segment_info.segment_name}</Badge> grubundasınız. Bu grup tüm çalışanların %{employeeData.segment_info.segment_percentage}'sini oluşturuyor.</>
              ) : (
                'Segment bilgisi bulunamadı.'
              )}
            </Text>
            
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
              <Card variant="outline">
                <CardBody>
                  <Heading size="xs" mb={2}>Güçlü Alanlarınız</Heading>
                  <Text fontSize="sm">
                    {employeeData.performance_summary.strongest_area === 'task_completion_rate' ? 'Görev Tamamlama' :
                     employeeData.performance_summary.strongest_area === 'email_efficiency' ? 'E-posta Verimliliği' :
                     employeeData.performance_summary.strongest_area === 'meeting_efficiency' ? 'Toplantı Verimliliği' :
                     employeeData.performance_summary.strongest_area === 'communication_score' ? 'İletişim' :
                     employeeData.performance_summary.strongest_area === 'collaboration_score' ? 'İşbirliği' :
                     employeeData.performance_summary.strongest_area === 'time_efficiency' ? 'Zaman Yönetimi' :
                     employeeData.performance_summary.strongest_area === 'file_activity' ? 'Dosya Aktivitesi' :
                     employeeData.performance_summary.strongest_area}
                  </Text>
                </CardBody>
              </Card>
              
              <Card variant="outline">
                <CardBody>
                  <Heading size="xs" mb={2}>Gelişim Alanlarınız</Heading>
                  <Text fontSize="sm">
                    {employeeData.performance_summary.improvement_needed === 'task_completion_rate' ? 'Görev Tamamlama' :
                     employeeData.performance_summary.improvement_needed === 'email_efficiency' ? 'E-posta Verimliliği' :
                     employeeData.performance_summary.improvement_needed === 'meeting_efficiency' ? 'Toplantı Verimliliği' :
                     employeeData.performance_summary.improvement_needed === 'communication_score' ? 'İletişim' :
                     employeeData.performance_summary.improvement_needed === 'collaboration_score' ? 'İşbirliği' :
                     employeeData.performance_summary.improvement_needed === 'time_efficiency' ? 'Zaman Yönetimi' :
                     employeeData.performance_summary.improvement_needed === 'file_activity' ? 'Dosya Aktivitesi' :
                     employeeData.performance_summary.improvement_needed}
                  </Text>
                </CardBody>
              </Card>
              
              <Card variant="outline">
                <CardBody>
                  <Heading size="xs" mb={2}>Takım Katkınız</Heading>
                  <Text fontSize="sm">Takımınızdaki performansınız ortalamadan %8 daha yüksek.</Text>
                </CardBody>
              </Card>
            </SimpleGrid>
          </CardBody>
        </Card>
      </Box>
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
          Veri Yükleme Hatası
        </Text>
        <Text>{error}</Text>
      </Alert>
    );
  }

  return (
    <Box>
      {isAdmin() ? renderAdminPerformance() : renderEmployeePerformance()}
    </Box>
  );
};

export default Performance; 