import { useState, useEffect } from 'react';
import {
  Box,
  Flex,
  Heading,
  Text,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  CircularProgress,
  CircularProgressLabel,
  useColorModeValue,
  Card,
  CardHeader,
  CardBody,
  Button,
  Stack,
  Badge,
  IconButton,
  Spinner,
  Alert,
  AlertIcon,
  useToast,
} from '@chakra-ui/react';
import { DownloadIcon, InfoOutlineIcon } from '@chakra-ui/icons';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { useAuth } from '../context/AuthContext';
import { EmployeeService, AdminService } from '../services/api';

// Chart.js bileşenlerini kaydet
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const { user, isAdmin } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [employeeData, setEmployeeData] = useState(null);
  const [adminData, setAdminData] = useState(null);
  const toast = useToast();

  const boxBg = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.700', 'gray.50');

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
          // Çalışan verilerini yükle (şu an için sabit ID)
          const employeeId = user?.id || '1'; // Gerçek kullanıcı ID'si
          const data = await EmployeeService.getAnalysis(employeeId);
          setEmployeeData(data);
        }
      } catch (err) {
        console.error('Veri yükleme hatası:', err);
        setError('Veri yüklenirken bir sorun oluştu. Lütfen daha sonra tekrar deneyin.');
        
        // Hata durumunda örnek veriler (sadece geliştirme aşamasında)
        if (isAdmin()) {
          setAdminData({
            total_employees: 15,
            department_statistics: {
              'Sales': { avg_task_completion: 0.78, avg_email_response: 0.65 },
              'Product Development': { avg_task_completion: 0.85, avg_email_response: 0.72 },
              'HR': { avg_task_completion: 0.92, avg_email_response: 0.88 },
            },
            team_statistics: {
              'Team-1': { avg_task_completion: 0.82, avg_email_response: 0.70 },
              'Team-2': { avg_task_completion: 0.75, avg_email_response: 0.68 },
              'Team-3': { avg_task_completion: 0.90, avg_email_response: 0.85 },
            }
          });
        } else {
          setEmployeeData({
            employee_id: '1',
            current_metrics: {
              task_completion_rate: 0.85,
              email_efficiency: 0.75,
              meeting_efficiency: 0.70,
              communication_score: 0.80,
              collaboration_score: 0.65,
              time_efficiency: 0.78,
              file_activity: 0.62
            },
            historical_trends: {
              task_completion: [
                { day: 1, completion_rate: 0.82, overdue_ratio: 0.15 },
                { day: 2, completion_rate: 0.84, overdue_ratio: 0.12 },
                { day: 3, completion_rate: 0.79, overdue_ratio: 0.18 },
                { day: 4, completion_rate: 0.85, overdue_ratio: 0.10 },
                { day: 5, completion_rate: 0.88, overdue_ratio: 0.08 },
                { day: 6, completion_rate: 0.86, overdue_ratio: 0.09 },
                { day: 7, completion_rate: 0.90, overdue_ratio: 0.05 }
              ],
              communication: [
                { day: 1, email_activity: 32, chat_activity: 45, response_time: 25 },
                { day: 2, email_activity: 28, chat_activity: 42, response_time: 30 },
                { day: 3, email_activity: 35, chat_activity: 50, response_time: 20 },
                { day: 4, email_activity: 30, chat_activity: 48, response_time: 28 },
                { day: 5, email_activity: 25, chat_activity: 40, response_time: 35 },
                { day: 6, email_activity: 38, chat_activity: 52, response_time: 18 },
                { day: 7, email_activity: 35, chat_activity: 55, response_time: 15 }
              ]
            },
            recommendations: [
              { suggestion: "E-posta yanıt sürelerini iyileştirin", reason: "E-posta yanıt süreleriniz ortalama 25 dakikanın üzerinde", priority: "high" },
              { suggestion: "Toplantı süresini optimize edin", reason: "Toplantılarda geçirdiğiniz süre günlük 2 saatin üzerinde", priority: "medium" },
              { suggestion: "Dosya paylaşımını artırın", reason: "Dosya paylaşım oranınız takım ortalamasının altında", priority: "low" }
            ],
            performance_summary: {
              overall_score: 0.74,
              strongest_area: "task_completion_rate",
              improvement_needed: "collaboration_score"
            }
          });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, isAdmin]);

  const handleGenerateReport = async () => {
    try {
      const employeeId = user?.id || '1';
      const response = await EmployeeService.getReport(employeeId);
      
      // PDF'i indir
      const url = window.URL.createObjectURL(new Blob([response]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `employee_${employeeId}_report.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: 'Rapor indirildi',
        description: 'Performans raporunuz başarıyla indirildi.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (err) {
      console.error('Rapor indirme hatası:', err);
      toast({
        title: 'Rapor indirilemedi',
        description: 'Rapor indirilirken bir sorun oluştu. Lütfen daha sonra tekrar deneyin.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleGenerateAllReports = async () => {
    try {
      await AdminService.generateReports();
      toast({
        title: 'Raporlar oluşturuldu',
        description: 'Tüm raporlar başarıyla oluşturuldu.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (err) {
      console.error('Rapor oluşturma hatası:', err);
      toast({
        title: 'Raporlar oluşturulamadı',
        description: 'Raporlar oluşturulurken bir sorun oluştu. Lütfen daha sonra tekrar deneyin.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  // Çalışan dashboard bileşeni
  const renderEmployeeDashboard = () => {
    if (!employeeData) return null;

    const metrics = employeeData.current_metrics;
    const trends = employeeData.historical_trends;
    
    // Görev tamamlama trendi için grafik verileri
    const taskCompletionChart = {
      labels: trends.task_completion.map(t => `Gün ${t.day}`),
      datasets: [
        {
          label: 'Görev Tamamlama Oranı',
          data: trends.task_completion.map(t => t.completion_rate * 100),
          borderColor: 'rgb(75, 192, 192)',
          backgroundColor: 'rgba(75, 192, 192, 0.5)',
        },
      ],
    };
    
    return (
      <Box p={5}>
        <Flex justifyContent="space-between" alignItems="center" mb={5}>
          <Heading size="lg">Performans Özeti</Heading>
          <Button 
            leftIcon={<DownloadIcon />} 
            colorScheme="blue"
            onClick={handleGenerateReport}
          >
            Raporu İndir
          </Button>
        </Flex>

        {/* Performans Metrikleri */}
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={5} mb={8}>
          <Card bg={boxBg} boxShadow="md">
            <CardBody>
              <Stat>
                <StatLabel>Genel Performans</StatLabel>
                <StatNumber>
                  <CircularProgress value={employeeData.performance_summary.overall_score * 100} color="green.400" size="60px">
                    <CircularProgressLabel>{Math.round(employeeData.performance_summary.overall_score * 100)}%</CircularProgressLabel>
                  </CircularProgress>
                </StatNumber>
              </Stat>
            </CardBody>
          </Card>
          
          <Card bg={boxBg} boxShadow="md">
            <CardBody>
              <Stat>
                <StatLabel>Görev Tamamlama</StatLabel>
                <StatNumber>{Math.round(metrics.task_completion_rate * 100)}%</StatNumber>
                <StatHelpText>Zamanında tamamlanan görevler</StatHelpText>
              </Stat>
            </CardBody>
          </Card>
          
          <Card bg={boxBg} boxShadow="md">
            <CardBody>
              <Stat>
                <StatLabel>İletişim Puanı</StatLabel>
                <StatNumber>{Math.round(metrics.communication_score * 100)}%</StatNumber>
                <StatHelpText>E-posta ve anlık mesajlaşma</StatHelpText>
              </Stat>
            </CardBody>
          </Card>
          
          <Card bg={boxBg} boxShadow="md">
            <CardBody>
              <Stat>
                <StatLabel>İşbirliği Puanı</StatLabel>
                <StatNumber>{Math.round(metrics.collaboration_score * 100)}%</StatNumber>
                <StatHelpText>Dosya paylaşımı ve yorumlar</StatHelpText>
              </Stat>
            </CardBody>
          </Card>
        </SimpleGrid>

        {/* Performans Grafikleri */}
        <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={5} mb={8}>
          <Card bg={boxBg} boxShadow="md">
            <CardHeader>
              <Heading size="md">Görev Tamamlama Trendi</Heading>
            </CardHeader>
            <CardBody>
              <Box h="300px">
                <Line data={taskCompletionChart} options={{ maintainAspectRatio: false }} />
              </Box>
            </CardBody>
          </Card>
          
          <Card bg={boxBg} boxShadow="md">
            <CardHeader>
              <Heading size="md">Güçlü ve Gelişim Alanları</Heading>
            </CardHeader>
            <CardBody>
              <Stack spacing={3}>
                <Box>
                  <Flex align="center" mb={2}>
                    <Badge colorScheme="green" mr={2}>En Güçlü Alan</Badge>
                    <Text fontWeight="bold">
                      {employeeData.performance_summary.strongest_area === 'task_completion_rate' ? 'Görev Tamamlama' : 
                       employeeData.performance_summary.strongest_area === 'email_efficiency' ? 'E-posta Verimliliği' :
                       employeeData.performance_summary.strongest_area === 'meeting_efficiency' ? 'Toplantı Verimliliği' :
                       employeeData.performance_summary.strongest_area === 'communication_score' ? 'İletişim' :
                       employeeData.performance_summary.strongest_area === 'collaboration_score' ? 'İşbirliği' :
                       employeeData.performance_summary.strongest_area === 'time_efficiency' ? 'Zaman Yönetimi' :
                       employeeData.performance_summary.strongest_area === 'file_activity' ? 'Dosya Aktivitesi' :
                       employeeData.performance_summary.strongest_area}
                    </Text>
                  </Flex>
                  <Text>Bu alandaki performansınızla öne çıkıyorsunuz.</Text>
                </Box>
                
                <Box>
                  <Flex align="center" mb={2}>
                    <Badge colorScheme="red" mr={2}>Gelişim Alanı</Badge>
                    <Text fontWeight="bold">
                      {employeeData.performance_summary.improvement_needed === 'task_completion_rate' ? 'Görev Tamamlama' : 
                       employeeData.performance_summary.improvement_needed === 'email_efficiency' ? 'E-posta Verimliliği' :
                       employeeData.performance_summary.improvement_needed === 'meeting_efficiency' ? 'Toplantı Verimliliği' :
                       employeeData.performance_summary.improvement_needed === 'communication_score' ? 'İletişim' :
                       employeeData.performance_summary.improvement_needed === 'collaboration_score' ? 'İşbirliği' :
                       employeeData.performance_summary.improvement_needed === 'time_efficiency' ? 'Zaman Yönetimi' :
                       employeeData.performance_summary.improvement_needed === 'file_activity' ? 'Dosya Aktivitesi' :
                       employeeData.performance_summary.improvement_needed}
                    </Text>
                  </Flex>
                  <Text>Bu alanda gelişim fırsatı bulunuyor.</Text>
                </Box>
              </Stack>
            </CardBody>
          </Card>
        </SimpleGrid>
        
        {/* Eğitim Önerileri */}
        <Card bg={boxBg} boxShadow="md" mb={5}>
          <CardHeader>
            <Heading size="md">Eğitim Önerileri</Heading>
          </CardHeader>
          <CardBody>
            <Stack spacing={4}>
              {employeeData.recommendations.map((rec, index) => (
                <Box key={index} p={4} borderWidth="1px" borderRadius="md">
                  <Flex align="center" mb={2}>
                    <Badge colorScheme={rec.priority === 'high' ? 'red' : rec.priority === 'medium' ? 'orange' : 'blue'} mr={2}>
                      {rec.priority === 'high' ? 'Yüksek' : rec.priority === 'medium' ? 'Orta' : 'Düşük'} Öncelik
                    </Badge>
                    <Text fontWeight="bold">{rec.suggestion}</Text>
                  </Flex>
                  <Text color="gray.600">{rec.reason}</Text>
                </Box>
              ))}
            </Stack>
          </CardBody>
        </Card>
      </Box>
    );
  };

  // Admin dashboard bileşeni
  const renderAdminDashboard = () => {
    if (!adminData) return null;
    
    // Departman istatistikleri için veri hazırlama
    const departmentNames = Object.keys(adminData.department_statistics);
    const taskCompletionRates = departmentNames.map(dept => 
      adminData.department_statistics[dept].avg_task_completion * 100
    );
    
    const departmentChart = {
      labels: departmentNames,
      datasets: [
        {
          label: 'Ortalama Görev Tamamlama Oranı (%)',
          data: taskCompletionRates,
          borderColor: 'rgb(53, 162, 235)',
          backgroundColor: 'rgba(53, 162, 235, 0.5)',
        },
      ],
    };
    
    return (
      <Box p={5}>
        <Flex justifyContent="space-between" alignItems="center" mb={5}>
          <Heading size="lg">Şirket Genel Bakış</Heading>
          <Button 
            leftIcon={<DownloadIcon />} 
            colorScheme="blue"
            onClick={handleGenerateAllReports}
          >
            Tüm Raporları Oluştur
          </Button>
        </Flex>

        {/* Genel İstatistikler */}
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={5} mb={8}>
          <Card bg={boxBg} boxShadow="md">
            <CardBody>
              <Stat>
                <StatLabel>Toplam Çalışan</StatLabel>
                <StatNumber>{adminData.total_employees}</StatNumber>
                <StatHelpText>Aktif çalışanlar</StatHelpText>
              </Stat>
            </CardBody>
          </Card>
          
          <Card bg={boxBg} boxShadow="md">
            <CardBody>
              <Stat>
                <StatLabel>Departman Sayısı</StatLabel>
                <StatNumber>{departmentNames.length}</StatNumber>
                <StatHelpText>Tüm departmanlar</StatHelpText>
              </Stat>
            </CardBody>
          </Card>
          
          <Card bg={boxBg} boxShadow="md">
            <CardBody>
              <Stat>
                <StatLabel>Ortalama Performans</StatLabel>
                <StatNumber>
                  {Math.round(taskCompletionRates.reduce((a, b) => a + b, 0) / taskCompletionRates.length)}%
                </StatNumber>
                <StatHelpText>Görev tamamlama oranı</StatHelpText>
              </Stat>
            </CardBody>
          </Card>
        </SimpleGrid>

        {/* Departman Performans Grafikleri */}
        <Card bg={boxBg} boxShadow="md" mb={8}>
          <CardHeader>
            <Heading size="md">Departman Performans Karşılaştırması</Heading>
          </CardHeader>
          <CardBody>
            <Box h="300px">
              <Line data={departmentChart} options={{ maintainAspectRatio: false }} />
            </Box>
          </CardBody>
        </Card>
        
        {/* Departman Detayları */}
        <SimpleGrid columns={{ base: 1, lg: 3 }} spacing={5}>
          {departmentNames.map((dept) => (
            <Card key={dept} bg={boxBg} boxShadow="md">
              <CardHeader>
                <Heading size="md">{dept}</Heading>
              </CardHeader>
              <CardBody>
                <Stack spacing={2}>
                  <Flex justify="space-between">
                    <Text>Görev Tamamlama:</Text>
                    <Text fontWeight="bold">
                      {Math.round(adminData.department_statistics[dept].avg_task_completion * 100)}%
                    </Text>
                  </Flex>
                  <Flex justify="space-between">
                    <Text>E-posta Verimliliği:</Text>
                    <Text fontWeight="bold">
                      {Math.round(adminData.department_statistics[dept].avg_email_response * 100)}%
                    </Text>
                  </Flex>
                </Stack>
              </CardBody>
            </Card>
          ))}
        </SimpleGrid>
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
      {isAdmin() ? renderAdminDashboard() : renderEmployeeDashboard()}
    </Box>
  );
};

export default Dashboard; 