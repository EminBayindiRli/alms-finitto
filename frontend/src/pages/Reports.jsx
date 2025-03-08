import { useState, useEffect } from 'react';
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
  Input,
  Select,
  FormControl,
  FormLabel,
  Badge,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  useColorModeValue,
  Spinner,
  Alert,
  AlertIcon,
  useToast,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Checkbox,
  Divider,
  Tag,
  Progress,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from '@chakra-ui/react';
import {
  DownloadIcon,
  CalendarIcon,
  RepeatIcon,
  ChevronDownIcon,
  EmailIcon,
  ViewIcon,
  TimeIcon,
  CheckIcon,
  WarningIcon,
  InfoIcon,
  StarIcon,
} from '@chakra-ui/icons';
import { FiFile, FiUsers, FiUserCheck, FiBarChart2, FiPieChart, FiTrendingUp, FiClock, FiFilter } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { AdminService } from '../services/api';

// Mock veri: Rapor türleri
const REPORT_TYPES = [
  {
    id: 'performance',
    name: 'Performans Raporu',
    description: 'Çalışanların performans metriklerinin detaylı analizi',
    icon: FiBarChart2,
    color: 'blue',
  },
  {
    id: 'activity',
    name: 'Aktivite Raporu',
    description: 'Çalışanların sistem aktivitelerinin zaman analizi',
    icon: FiClock,
    color: 'green',
  },
  {
    id: 'training',
    name: 'Eğitim Raporu',
    description: 'Eğitim tamamlama oranları ve eğitim etkinliği',
    icon: FiUserCheck,
    color: 'purple',
  },
  {
    id: 'comparison',
    name: 'Karşılaştırma Raporu',
    description: 'Departmanlar veya takımlar arası performans karşılaştırması',
    icon: FiTrendingUp,
    color: 'orange',
  },
  {
    id: 'summary',
    name: 'Özet Rapor',
    description: 'Tüm sistem verilerinin özet gösterimi',
    icon: FiPieChart,
    color: 'teal',
  }
];

// Mock veri: Oluşturulan raporlar
const GENERATED_REPORTS = [
  {
    id: '1',
    name: 'Q3 2023 Performans Raporu',
    type: 'performance',
    createdAt: '2023-09-30',
    createdBy: 'Ahmet Yönetici',
    size: '2.4 MB',
    status: 'completed',
    filters: {
      department: 'Tümü',
      period: 'Q3 2023',
    }
  },
  {
    id: '2',
    name: 'Satış Ekibi Aktivite Analizi',
    type: 'activity',
    createdAt: '2023-09-15',
    createdBy: 'Ahmet Yönetici',
    size: '1.8 MB',
    status: 'completed',
    filters: {
      department: 'Sales',
      period: 'Son 30 Gün',
    }
  },
  {
    id: '3',
    name: 'Eğitim Tamamlama Raporu - 2023',
    type: 'training',
    createdAt: '2023-09-01',
    createdBy: 'Sistem',
    size: '3.2 MB',
    status: 'completed',
    filters: {
      department: 'Tümü',
      period: '2023 Yılı',
    }
  },
  {
    id: '4',
    name: 'Departman Karşılaştırma Raporu',
    type: 'comparison',
    createdAt: '2023-08-15',
    createdBy: 'Ahmet Yönetici',
    size: '4.1 MB',
    status: 'completed',
    filters: {
      department: 'Tümü',
      period: 'Son 90 Gün',
    }
  },
  {
    id: '5',
    name: 'Aylık Özet Rapor - Eylül 2023',
    type: 'summary',
    createdAt: '2023-09-30',
    createdBy: 'Sistem',
    size: '1.5 MB',
    status: 'processing',
    filters: {
      department: 'Tümü',
      period: 'Eylül 2023',
    }
  }
];

// Mock veri: Programlanmış raporlar
const SCHEDULED_REPORTS = [
  {
    id: '1',
    name: 'Aylık Performans Özeti',
    type: 'performance',
    frequency: 'Aylık',
    nextRunDate: '2023-10-01',
    recipients: ['yonetim@alms-system.com', 'hr@alms-system.com'],
    status: 'active',
  },
  {
    id: '2',
    name: 'Haftalık Aktivite Raporu',
    type: 'activity',
    frequency: 'Haftalık',
    nextRunDate: '2023-10-02',
    recipients: ['yonetim@alms-system.com'],
    status: 'active',
  },
  {
    id: '3',
    name: 'Çeyreklik Departman Karşılaştırması',
    type: 'comparison',
    frequency: 'Çeyreklik',
    nextRunDate: '2023-12-31',
    recipients: ['yonetim@alms-system.com', 'department_leads@alms-system.com'],
    status: 'active',
  }
];

// Mock veri: Departmanlar
const DEPARTMENTS = [
  { id: 'all', name: 'Tümü' },
  { id: 'product_development', name: 'Product Development' },
  { id: 'sales', name: 'Sales' },
  { id: 'hr', name: 'HR' },
  { id: 'marketing', name: 'Marketing' },
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

// Rapor türüne göre renk belirleme
const getReportTypeColor = (type) => {
  const reportType = REPORT_TYPES.find(r => r.id === type);
  return reportType ? reportType.color : 'gray';
};

// Rapor türüne göre ikon belirleme
const getReportTypeIcon = (type) => {
  const reportType = REPORT_TYPES.find(r => r.id === type);
  return reportType ? reportType.icon : FiFile;
};

// Duruma göre badge rengi belirleme
const getStatusColor = (status) => {
  switch (status) {
    case 'completed':
      return 'green';
    case 'processing':
      return 'orange';
    case 'failed':
      return 'red';
    case 'active':
      return 'blue';
    case 'inactive':
      return 'gray';
    default:
      return 'gray';
  }
};

const Reports = () => {
  const { isAdmin } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [selectedReportType, setSelectedReportType] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedTeam, setSelectedTeam] = useState('all');
  const [selectedPeriod, setSelectedPeriod] = useState('last_30_days');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [includeMetrics, setIncludeMetrics] = useState({
    performance: true,
    activity: true,
    training: true,
    communications: false,
  });
  const [reportName, setReportName] = useState('');
  const [generatedReports, setGeneratedReports] = useState(GENERATED_REPORTS);
  const [scheduledReports, setScheduledReports] = useState(SCHEDULED_REPORTS);
  const [isCreatingReport, setIsCreatingReport] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

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
            setGeneratedReports(GENERATED_REPORTS);
            setScheduledReports(SCHEDULED_REPORTS);
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

  const openReportCreationModal = (reportType) => {
    setSelectedReportType(reportType);
    setReportName(`Yeni ${reportType.name} - ${new Date().toLocaleDateString('tr-TR')}`);
    onOpen();
  };

  const createReport = async () => {
    setIsCreatingReport(true);
    try {
      // Gerçek API isteği burada yapılacak
      // const response = await AdminService.createReport({
      //   name: reportName,
      //   type: selectedReportType.id,
      //   department: selectedDepartment,
      //   team: selectedTeam,
      //   period: selectedPeriod,
      //   startDate: startDate,
      //   endDate: endDate,
      //   includeMetrics,
      // });

      // Mock işlem
      setTimeout(() => {
        const newReport = {
          id: String(generatedReports.length + 1),
          name: reportName,
          type: selectedReportType.id,
          createdAt: new Date().toISOString().split('T')[0],
          createdBy: 'Ahmet Yönetici',
          size: '0 KB',
          status: 'processing',
          filters: {
            department: DEPARTMENTS.find(d => d.id === selectedDepartment)?.name || 'Tümü',
            period: PERIODS.find(p => p.id === selectedPeriod)?.name || 'Özel',
          }
        };

        setGeneratedReports([newReport, ...generatedReports]);
        
        toast({
          title: 'Rapor Oluşturuldu',
          description: 'Rapor oluşturma işlemi başlatıldı. İşlem tamamlandığında rapor indirilebilir olacak.',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });

        setIsCreatingReport(false);
        onClose();

        // Rapor işlenmesini simüle edelim
        setTimeout(() => {
          setGeneratedReports(prev => 
            prev.map(report => 
              report.id === newReport.id 
                ? { ...report, status: 'completed', size: '1.7 MB' } 
                : report
            )
          );
        }, 5000);

      }, 2000);
    } catch (error) {
      console.error("Rapor oluşturma hatası:", error);
      toast({
        title: "Rapor Oluşturma Hatası",
        description: "Rapor oluşturulurken bir sorun oluştu.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      setIsCreatingReport(false);
    }
  };

  const downloadReport = async (reportId) => {
    try {
      // Gerçek API isteği
      // const reportBlob = await AdminService.downloadReport(reportId);
      
      // PDF'i indir
      toast({
        title: 'Rapor İndiriliyor',
        description: 'Rapor indirme işlemi başlatıldı.',
        status: 'info',
        duration: 3000,
        isClosable: true,
      });

      // İndirme simülasyonu
      setTimeout(() => {
        toast({
          title: 'Rapor İndirildi',
          description: 'Rapor başarıyla indirildi.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      }, 2000);
    } catch (error) {
      console.error("Rapor indirme hatası:", error);
      toast({
        title: "İndirme Hatası",
        description: "Rapor indirilirken bir sorun oluştu.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleScheduleStatusChange = (reportId, newStatus) => {
    setScheduledReports(prev => 
      prev.map(report => 
        report.id === reportId ? { ...report, status: newStatus } : report
      )
    );

    toast({
      title: 'Durum Güncellendi',
      description: `Rapor durumu "${newStatus}" olarak güncellendi.`,
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  const deleteReport = (reportId) => {
    setGeneratedReports(prev => prev.filter(report => report.id !== reportId));
    
    toast({
      title: 'Rapor Silindi',
      description: 'Rapor başarıyla silindi.',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  const deleteSchedule = (scheduleId) => {
    setScheduledReports(prev => prev.filter(schedule => schedule.id !== scheduleId));
    
    toast({
      title: 'Programlı Rapor Silindi',
      description: 'Programlı rapor başarıyla silindi.',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
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

  return (
    <Box p={5}>
      <VStack spacing={8} align="stretch">
        {/* Başlık */}
        <Flex justifyContent="space-between" alignItems="center" wrap="wrap" gap={4}>
          <Box>
            <Heading size="lg">Raporlar</Heading>
            <Text color="gray.600">
              Sistem raporlarını görüntüleyin, oluşturun ve indirin
            </Text>
          </Box>
        </Flex>

        {/* Rapor İstatistikleri */}
        <SimpleGrid columns={{ base: 1, md: 4 }} spacing={4}>
          <Stat bg={cardBg} p={4} borderRadius="lg" boxShadow="sm">
            <StatLabel>Toplam Rapor</StatLabel>
            <StatNumber>{generatedReports.length}</StatNumber>
            <StatHelpText>Bu ay: {generatedReports.filter(r => r.createdAt.startsWith('2023-09')).length}</StatHelpText>
          </Stat>

          <Stat bg={cardBg} p={4} borderRadius="lg" boxShadow="sm">
            <StatLabel>Programlı Raporlar</StatLabel>
            <StatNumber>{scheduledReports.length}</StatNumber>
            <StatHelpText>Aktif: {scheduledReports.filter(s => s.status === 'active').length}</StatHelpText>
          </Stat>

          <Stat bg={cardBg} p={4} borderRadius="lg" boxShadow="sm">
            <StatLabel>İşlenen Raporlar</StatLabel>
            <StatNumber>
              {generatedReports.filter(r => r.status === 'processing').length}
            </StatNumber>
            <StatHelpText>Kuyrukta</StatHelpText>
          </Stat>

          <Stat bg={cardBg} p={4} borderRadius="lg" boxShadow="sm">
            <StatLabel>Depolama Kullanımı</StatLabel>
            <StatNumber>
              {generatedReports.reduce((acc, report) => {
                const size = parseFloat(report.size.replace(' MB', ''));
                return acc + (isNaN(size) ? 0 : size);
              }, 0).toFixed(1)} MB
            </StatNumber>
            <StatHelpText>Toplam</StatHelpText>
          </Stat>
        </SimpleGrid>

        {/* Rapor Türleri */}
        <Box>
          <Heading size="md" mb={4}>Yeni Rapor Oluştur</Heading>
          <SimpleGrid columns={{ base: 1, md: 2, lg: 5 }} spacing={4}>
            {REPORT_TYPES.map(reportType => (
              <Card 
                key={reportType.id} 
                bg={cardBg} 
                cursor="pointer" 
                _hover={{ shadow: 'md', transform: 'translateY(-2px)' }}
                transition="all 0.2s"
                onClick={() => openReportCreationModal(reportType)}
              >
                <CardBody>
                  <VStack spacing={3} align="start">
                    <Flex 
                      bg={`${reportType.color}.50`} 
                      color={`${reportType.color}.500`} 
                      p={3} 
                      borderRadius="full"
                    >
                      <Icon as={reportType.icon} boxSize={5} />
                    </Flex>
                    <Box>
                      <Heading size="sm">{reportType.name}</Heading>
                      <Text fontSize="sm" color="gray.500" mt={1}>{reportType.description}</Text>
                    </Box>
                  </VStack>
                </CardBody>
              </Card>
            ))}
          </SimpleGrid>
        </Box>

        {/* Raporlar Tabı */}
        <Box>
          <Tabs isFitted onChange={setActiveTab} index={activeTab}>
            <TabList mb="1em">
              <Tab>Oluşturulan Raporlar</Tab>
              <Tab>Programlı Raporlar</Tab>
            </TabList>
            <TabPanels>
              {/* Oluşturulan Raporlar */}
              <TabPanel px={0}>
                <Box overflowX="auto">
                  <Table variant="simple" borderRadius="md" boxShadow="sm" bg={cardBg}>
                    <Thead>
                      <Tr>
                        <Th>Rapor Adı</Th>
                        <Th>Oluşturulma Tarihi</Th>
                        <Th>Filtreler</Th>
                        <Th>Boyut</Th>
                        <Th>Durum</Th>
                        <Th>İşlemler</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {generatedReports.map(report => (
                        <Tr key={report.id}>
                          <Td>
                            <Flex align="center">
                              <Icon 
                                as={getReportTypeIcon(report.type)} 
                                color={`${getReportTypeColor(report.type)}.500`}
                                mr={2}
                              />
                              <Box>
                                <Text fontWeight="medium">{report.name}</Text>
                                <Text fontSize="xs" color="gray.500">
                                  {report.createdBy} tarafından oluşturuldu
                                </Text>
                              </Box>
                            </Flex>
                          </Td>
                          <Td>{report.createdAt}</Td>
                          <Td>
                            <VStack align="start" spacing={1}>
                              <Badge colorScheme="blue">
                                Departman: {report.filters.department}
                              </Badge>
                              <Badge colorScheme="purple">
                                Dönem: {report.filters.period}
                              </Badge>
                            </VStack>
                          </Td>
                          <Td>{report.size}</Td>
                          <Td>
                            <Badge colorScheme={getStatusColor(report.status)}>
                              {report.status === 'completed' ? 'Tamamlandı' : 
                               report.status === 'processing' ? 'İşleniyor' : 
                               report.status === 'failed' ? 'Başarısız' : report.status}
                            </Badge>
                          </Td>
                          <Td>
                            <HStack spacing={2}>
                              <Button 
                                size="sm" 
                                leftIcon={<DownloadIcon />} 
                                colorScheme="blue"
                                isDisabled={report.status !== 'completed'}
                                onClick={() => downloadReport(report.id)}
                              >
                                İndir
                              </Button>
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                colorScheme="red"
                                onClick={() => deleteReport(report.id)}
                              >
                                Sil
                              </Button>
                            </HStack>
                          </Td>
                        </Tr>
                      ))}
                      {generatedReports.length === 0 && (
                        <Tr>
                          <Td colSpan={6} textAlign="center" py={4}>
                            <Text color="gray.500">Henüz rapor oluşturulmamış.</Text>
                          </Td>
                        </Tr>
                      )}
                    </Tbody>
                  </Table>
                </Box>
              </TabPanel>

              {/* Programlı Raporlar */}
              <TabPanel px={0}>
                <Box overflowX="auto">
                  <Table variant="simple" borderRadius="md" boxShadow="sm" bg={cardBg}>
                    <Thead>
                      <Tr>
                        <Th>Rapor Adı</Th>
                        <Th>Sıklık</Th>
                        <Th>Sonraki Çalışma</Th>
                        <Th>Alıcılar</Th>
                        <Th>Durum</Th>
                        <Th>İşlemler</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {scheduledReports.map(schedule => (
                        <Tr key={schedule.id}>
                          <Td>
                            <Flex align="center">
                              <Icon 
                                as={getReportTypeIcon(schedule.type)} 
                                color={`${getReportTypeColor(schedule.type)}.500`}
                                mr={2}
                              />
                              <Text fontWeight="medium">{schedule.name}</Text>
                            </Flex>
                          </Td>
                          <Td>
                            <HStack>
                              <RepeatIcon />
                              <Text>{schedule.frequency}</Text>
                            </HStack>
                          </Td>
                          <Td>
                            <HStack>
                              <CalendarIcon />
                              <Text>{schedule.nextRunDate}</Text>
                            </HStack>
                          </Td>
                          <Td>
                            <VStack align="start" spacing={1}>
                              {schedule.recipients.map((recipient, index) => (
                                <HStack key={index}>
                                  <EmailIcon color="blue.500" />
                                  <Text fontSize="sm">{recipient}</Text>
                                </HStack>
                              ))}
                            </VStack>
                          </Td>
                          <Td>
                            <Badge colorScheme={getStatusColor(schedule.status)}>
                              {schedule.status === 'active' ? 'Aktif' : 'Pasif'}
                            </Badge>
                          </Td>
                          <Td>
                            <HStack spacing={2}>
                              <Menu>
                                <MenuButton as={Button} size="sm" rightIcon={<ChevronDownIcon />}>
                                  Durum
                                </MenuButton>
                                <MenuList>
                                  <MenuItem 
                                    icon={<CheckIcon />} 
                                    onClick={() => handleScheduleStatusChange(schedule.id, 'active')}
                                  >
                                    Aktif
                                  </MenuItem>
                                  <MenuItem 
                                    icon={<WarningIcon />} 
                                    onClick={() => handleScheduleStatusChange(schedule.id, 'inactive')}
                                  >
                                    Pasif
                                  </MenuItem>
                                </MenuList>
                              </Menu>
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                colorScheme="red"
                                onClick={() => deleteSchedule(schedule.id)}
                              >
                                Sil
                              </Button>
                            </HStack>
                          </Td>
                        </Tr>
                      ))}
                      {scheduledReports.length === 0 && (
                        <Tr>
                          <Td colSpan={6} textAlign="center" py={4}>
                            <Text color="gray.500">Henüz programlı rapor oluşturulmamış.</Text>
                          </Td>
                        </Tr>
                      )}
                    </Tbody>
                  </Table>
                </Box>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>

        {/* Rapor Oluşturma Modalı */}
        <Modal isOpen={isOpen} onClose={onClose} size="xl">
          <ModalOverlay />
          <ModalContent>
            {selectedReportType && (
              <>
                <ModalHeader>
                  <Flex align="center">
                    <Icon 
                      as={selectedReportType.icon} 
                      color={`${selectedReportType.color}.500`} 
                      mr={2} 
                    />
                    <Text>{selectedReportType.name} Oluştur</Text>
                  </Flex>
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  <VStack spacing={6} align="stretch">
                    <FormControl>
                      <FormLabel>Rapor Adı</FormLabel>
                      <Input 
                        value={reportName} 
                        onChange={(e) => setReportName(e.target.value)} 
                        placeholder="Rapor adını girin" 
                      />
                    </FormControl>

                    <SimpleGrid columns={2} spacing={4}>
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

                      <FormControl>
                        <FormLabel>Takım</FormLabel>
                        <Select 
                          value={selectedTeam} 
                          onChange={(e) => setSelectedTeam(e.target.value)}
                          isDisabled={selectedDepartment === 'all'}
                        >
                          {TEAMS.map(team => (
                            <option key={team.id} value={team.id}>{team.name}</option>
                          ))}
                        </Select>
                      </FormControl>
                    </SimpleGrid>

                    <FormControl>
                      <FormLabel>Zaman Aralığı</FormLabel>
                      <Select 
                        value={selectedPeriod} 
                        onChange={(e) => setSelectedPeriod(e.target.value)}
                      >
                        {PERIODS.map(period => (
                          <option key={period.id} value={period.id}>{period.name}</option>
                        ))}
                      </Select>
                    </FormControl>

                    {selectedPeriod === 'custom' && (
                      <SimpleGrid columns={2} spacing={4}>
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

                    <Box>
                      <FormLabel mb={2}>Dahil Edilecek Metrikler</FormLabel>
                      <SimpleGrid columns={2} spacing={3}>
                        <Checkbox 
                          isChecked={includeMetrics.performance} 
                          onChange={(e) => setIncludeMetrics({...includeMetrics, performance: e.target.checked})}
                        >
                          Performans Metrikleri
                        </Checkbox>
                        <Checkbox 
                          isChecked={includeMetrics.activity} 
                          onChange={(e) => setIncludeMetrics({...includeMetrics, activity: e.target.checked})}
                        >
                          Aktivite Verileri
                        </Checkbox>
                        <Checkbox 
                          isChecked={includeMetrics.training} 
                          onChange={(e) => setIncludeMetrics({...includeMetrics, training: e.target.checked})}
                        >
                          Eğitim Bilgileri
                        </Checkbox>
                        <Checkbox 
                          isChecked={includeMetrics.communications} 
                          onChange={(e) => setIncludeMetrics({...includeMetrics, communications: e.target.checked})}
                        >
                          İletişim Analizi
                        </Checkbox>
                      </SimpleGrid>
                    </Box>

                    <Divider />

                    <Box>
                      <Heading size="sm" mb={2}>Rapor Önizleme</Heading>
                      <Card variant="outline">
                        <CardBody>
                          <VStack align="start" spacing={2}>
                            <Flex align="center" w="full" justify="space-between">
                              <Text fontWeight="bold">{reportName || "Rapor Adı"}</Text>
                              <Badge colorScheme={getReportTypeColor(selectedReportType.id)}>
                                {selectedReportType.name}
                              </Badge>
                            </Flex>
                            <Divider />
                            <SimpleGrid columns={2} spacing={2} w="full">
                              <Box>
                                <Text fontSize="sm" color="gray.500">Departman</Text>
                                <Text>{DEPARTMENTS.find(d => d.id === selectedDepartment)?.name || 'Seçilmedi'}</Text>
                              </Box>
                              <Box>
                                <Text fontSize="sm" color="gray.500">Takım</Text>
                                <Text>{TEAMS.find(t => t.id === selectedTeam)?.name || 'Seçilmedi'}</Text>
                              </Box>
                              <Box>
                                <Text fontSize="sm" color="gray.500">Dönem</Text>
                                <Text>{PERIODS.find(p => p.id === selectedPeriod)?.name || 'Seçilmedi'}</Text>
                              </Box>
                              <Box>
                                <Text fontSize="sm" color="gray.500">Metrikler</Text>
                                <Flex gap={1} flexWrap="wrap">
                                  {Object.entries(includeMetrics)
                                    .filter(([_, isChecked]) => isChecked)
                                    .map(([key, _]) => (
                                      <Tag key={key} size="sm" colorScheme="blue" mr={1} mb={1}>
                                        {key.charAt(0).toUpperCase() + key.slice(1)}
                                      </Tag>
                                    ))
                                  }
                                </Flex>
                              </Box>
                            </SimpleGrid>
                          </VStack>
                        </CardBody>
                      </Card>
                    </Box>
                  </VStack>
                </ModalBody>
                <ModalFooter>
                  <Button 
                    colorScheme="blue" 
                    mr={3} 
                    leftIcon={<FiBarChart2 />} 
                    onClick={createReport}
                    isLoading={isCreatingReport}
                    loadingText="Oluşturuluyor..."
                    isDisabled={!reportName.trim()}
                  >
                    Rapor Oluştur
                  </Button>
                  <Button variant="ghost" onClick={onClose}>İptal</Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </VStack>
    </Box>
  );
};

export default Reports; 