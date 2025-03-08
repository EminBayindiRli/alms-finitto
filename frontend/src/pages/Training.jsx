import { useState, useEffect } from 'react';
import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  SimpleGrid,
  Card,
  CardHeader,
  CardBody,
  Badge,
  Button,
  Divider,
  Progress,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Icon,
  Flex,
  Spinner,
  Alert,
  AlertIcon,
  useToast,
  useColorModeValue,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from '@chakra-ui/react';
import { CheckCircleIcon, TimeIcon, StarIcon, ExternalLinkIcon } from '@chakra-ui/icons';
import { useAuth } from '../context/AuthContext';
import { EmployeeService, AdminService } from '../services/api';

// Sahte Microsoft Learn kursları
const DEMO_COURSES = {
  "time_management": [
    { id: 1, title: "Zaman Yönetimi Temelleri", duration: "1.5 saat", modules: 5, difficulty: "Başlangıç", url: "#", completed: true },
    { id: 2, title: "Önceliklendirme Teknikleri", duration: "2 saat", modules: 7, difficulty: "Orta", url: "#", completed: false },
    { id: 3, title: "Pomodoro ve Diğer Zaman Teknikleri", duration: "1 saat", modules: 4, difficulty: "Başlangıç", url: "#", completed: false },
  ],
  "communication": [
    { id: 4, title: "Etkili İletişim Becerileri", duration: "3 saat", modules: 8, difficulty: "Orta", url: "#", completed: false },
    { id: 5, title: "E-posta Yönetimi ve İletişimi", duration: "1.5 saat", modules: 5, difficulty: "Başlangıç", url: "#", completed: true },
    { id: 6, title: "Zor Konuşmaları Yönetme", duration: "2.5 saat", modules: 6, difficulty: "İleri", url: "#", completed: false },
  ],
  "collaboration": [
    { id: 7, title: "Takım İşbirliği Temel İlkeleri", duration: "2 saat", modules: 6, difficulty: "Başlangıç", url: "#", completed: false },
    { id: 8, title: "Microsoft Teams ile Etkili İşbirliği", duration: "1.5 saat", modules: 5, difficulty: "Orta", url: "#", completed: false },
    { id: 9, title: "Dijital İşbirliği Araçları", duration: "2 saat", modules: 7, difficulty: "Orta", url: "#", completed: false },
  ],
  "productivity": [
    { id: 10, title: "Kişisel Üretkenlik ve Odaklanma", duration: "2.5 saat", modules: 8, difficulty: "Orta", url: "#", completed: true },
    { id: 11, title: "Microsoft 365 ile Üretkenlik", duration: "3 saat", modules: 10, difficulty: "Orta", url: "#", completed: false },
    { id: 12, title: "Üretkenlik için Not Alma Sistemleri", duration: "1 saat", modules: 4, difficulty: "Başlangıç", url: "#", completed: false },
  ]
};

const Training = () => {
  const { isAdmin, user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [employeeData, setEmployeeData] = useState(null);
  const [adminData, setAdminData] = useState(null);
  const [allEmployees, setAllEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const toast = useToast();

  const cardBg = useColorModeValue('white', 'gray.800');
  const subtleBg = useColorModeValue('gray.50', 'gray.700');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (isAdmin()) {
          // Admin verilerini yükle
          const data = await AdminService.getAllAnalyses();
          setAdminData(data);

          // Tüm çalışanlar için mock veri
          setAllEmployees([
            { id: '1', name: 'Ali Yılmaz', department: 'Product Development', team: 'Team-2' },
            { id: '2', name: 'Ayşe Kaya', department: 'Sales', team: 'Team-1' },
            { id: '3', name: 'Mehmet Öz', department: 'HR', team: 'Team-3' },
            { id: '4', name: 'Zeynep Demir', department: 'Product Development', team: 'Team-2' },
            { id: '5', name: 'Mustafa Şahin', department: 'Sales', team: 'Team-1' },
          ]);
        } else {
          // Çalışan verilerini yükle
          const employeeId = user?.id || '1';
          const data = await EmployeeService.getAnalysis(employeeId);
          setEmployeeData(data);
        }
      } catch (err) {
        console.error('Veri yükleme hatası:', err);
        setError('Veri yüklenirken bir sorun oluştu.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, isAdmin]);

  // Eğitim tamamlandı işlevleri
  const handleCompleteTraining = (courseId) => {
    toast({
      title: "Eğitim Tamamlandı",
      description: "Eğitimi başarıyla tamamladınız ve sisteme kaydedildi.",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  // Admin tarafından eğitim atama işlevi
  const handleAssignTraining = (courseId, employeeId) => {
    toast({
      title: "Eğitim Atandı",
      description: "Seçili eğitim çalışana başarıyla atandı.",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  // Eğitim ilerlemesini görselleştirme işlevi
  const getProgressColor = (value) => {
    if (value < 30) return "red";
    if (value < 70) return "yellow";
    return "green";
  };

  // Çalışan eğitim önerileri
  const renderEmployeeTraining = () => {
    if (!employeeData) return null;

    const recommendations = employeeData.recommendations || [];

    return (
      <Box p={5}>
        <VStack spacing={8} align="stretch">
          <Box>
            <Heading size="lg" mb={4}>Eğitim Önerileri</Heading>
            <Text color="gray.600" mb={6}>
              Performans analizinize dayanarak aşağıdaki eğitimler size özel olarak önerilmektedir.
            </Text>
          </Box>

          {/* Öncelikli Eğitim Önerileri */}
          <Box>
            <Heading size="md" mb={4}>Öncelikli Eğitim Önerileri</Heading>
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
              {recommendations.map((rec, index) => (
                <Card key={index} boxShadow="md" bg={cardBg}>
                  <CardHeader bg={subtleBg} py={3}>
                    <Flex justifyContent="space-between" alignItems="center">
                      <Heading size="sm">{rec.suggestion}</Heading>
                      <Badge colorScheme={rec.priority === 'high' ? 'red' : rec.priority === 'medium' ? 'orange' : 'blue'}>
                        {rec.priority === 'high' ? 'Yüksek' : rec.priority === 'medium' ? 'Orta' : 'Düşük'} Öncelik
                      </Badge>
                    </Flex>
                  </CardHeader>
                  <CardBody>
                    <Text fontSize="sm" color="gray.600" mb={3}>{rec.reason}</Text>

                    <Divider my={3} />

                    <Heading size="xs" mb={3}>Önerilen Kurslar</Heading>
                    <VStack spacing={3} align="stretch">
                      {DEMO_COURSES[rec.priority === 'high' ? 'communication' : rec.priority === 'medium' ? 'time_management' : 'collaboration']
                        .slice(0, 2).map(course => (
                          <Card key={course.id} variant="outline" size="sm">
                            <CardBody p={3}>
                              <Flex justifyContent="space-between">
                                <VStack align="start" spacing={1}>
                                  <Text fontWeight="bold" fontSize="sm">{course.title}</Text>
                                  <HStack spacing={2} fontSize="xs" color="gray.500">
                                    <Text>{course.duration}</Text>
                                    <Text>•</Text>
                                    <Text>{course.modules} modül</Text>
                                    <Text>•</Text>
                                    <Text>{course.difficulty}</Text>
                                  </HStack>
                                </VStack>
                                {course.completed ? (
                                  <Icon as={CheckCircleIcon} color="green.500" boxSize={5} />
                                ) : (
                                  <Button 
                                    size="xs" 
                                    colorScheme="blue" 
                                    rightIcon={<ExternalLinkIcon />}
                                    onClick={() => handleCompleteTraining(course.id)}
                                  >
                                    Başla
                                  </Button>
                                )}
                              </Flex>
                            </CardBody>
                          </Card>
                        ))}
                    </VStack>
                  </CardBody>
                </Card>
              ))}
            </SimpleGrid>
          </Box>

          {/* Tüm Kurs Kategorileri */}
          <Box mt={6}>
            <Heading size="md" mb={4}>Tüm Eğitim Kategorileri</Heading>
            <Tabs variant="enclosed" colorScheme="blue">
              <TabList>
                <Tab>İletişim</Tab>
                <Tab>Zaman Yönetimi</Tab>
                <Tab>İşbirliği</Tab>
                <Tab>Üretkenlik</Tab>
              </TabList>
              <TabPanels>
                <TabPanel>
                  <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={4}>
                    {DEMO_COURSES.communication.map(course => (
                      <Card key={course.id} direction="row" overflow="hidden" variant="outline">
                        <CardBody>
                          <Flex justifyContent="space-between" h="100%">
                            <VStack align="start" spacing={2}>
                              <Heading size="sm">{course.title}</Heading>
                              <HStack spacing={2} fontSize="sm" color="gray.500">
                                <Icon as={TimeIcon} />
                                <Text>{course.duration}</Text>
                                <Text>•</Text>
                                <Text>{course.modules} modül</Text>
                              </HStack>
                              <Badge colorScheme={course.difficulty === 'Başlangıç' ? 'green' : course.difficulty === 'Orta' ? 'blue' : 'purple'}>
                                {course.difficulty}
                              </Badge>
                              {course.completed && (
                                <Badge colorScheme="green">Tamamlandı</Badge>
                              )}
                            </VStack>
                            <VStack justify="center">
                              {course.completed ? (
                                <Button 
                                  colorScheme="green" 
                                  variant="outline" 
                                  leftIcon={<CheckCircleIcon />} 
                                  size="sm"
                                  isDisabled
                                >
                                  Tamamlandı
                                </Button>
                              ) : (
                                <Button 
                                  colorScheme="blue" 
                                  rightIcon={<ExternalLinkIcon />}
                                  size="sm"
                                  onClick={() => handleCompleteTraining(course.id)}
                                >
                                  Kursa Git
                                </Button>
                              )}
                            </VStack>
                          </Flex>
                        </CardBody>
                      </Card>
                    ))}
                  </SimpleGrid>
                </TabPanel>
                <TabPanel>
                  <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={4}>
                    {DEMO_COURSES.time_management.map(course => (
                      <Card key={course.id} direction="row" overflow="hidden" variant="outline">
                        <CardBody>
                          <Flex justifyContent="space-between" h="100%">
                            <VStack align="start" spacing={2}>
                              <Heading size="sm">{course.title}</Heading>
                              <HStack spacing={2} fontSize="sm" color="gray.500">
                                <Icon as={TimeIcon} />
                                <Text>{course.duration}</Text>
                                <Text>•</Text>
                                <Text>{course.modules} modül</Text>
                              </HStack>
                              <Badge colorScheme={course.difficulty === 'Başlangıç' ? 'green' : course.difficulty === 'Orta' ? 'blue' : 'purple'}>
                                {course.difficulty}
                              </Badge>
                              {course.completed && (
                                <Badge colorScheme="green">Tamamlandı</Badge>
                              )}
                            </VStack>
                            <VStack justify="center">
                              {course.completed ? (
                                <Button 
                                  colorScheme="green" 
                                  variant="outline" 
                                  leftIcon={<CheckCircleIcon />} 
                                  size="sm"
                                  isDisabled
                                >
                                  Tamamlandı
                                </Button>
                              ) : (
                                <Button 
                                  colorScheme="blue" 
                                  rightIcon={<ExternalLinkIcon />}
                                  size="sm"
                                  onClick={() => handleCompleteTraining(course.id)}
                                >
                                  Kursa Git
                                </Button>
                              )}
                            </VStack>
                          </Flex>
                        </CardBody>
                      </Card>
                    ))}
                  </SimpleGrid>
                </TabPanel>
                <TabPanel>
                  <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={4}>
                    {DEMO_COURSES.collaboration.map(course => (
                      <Card key={course.id} direction="row" overflow="hidden" variant="outline">
                        <CardBody>
                          <Flex justifyContent="space-between" h="100%">
                            <VStack align="start" spacing={2}>
                              <Heading size="sm">{course.title}</Heading>
                              <HStack spacing={2} fontSize="sm" color="gray.500">
                                <Icon as={TimeIcon} />
                                <Text>{course.duration}</Text>
                                <Text>•</Text>
                                <Text>{course.modules} modül</Text>
                              </HStack>
                              <Badge colorScheme={course.difficulty === 'Başlangıç' ? 'green' : course.difficulty === 'Orta' ? 'blue' : 'purple'}>
                                {course.difficulty}
                              </Badge>
                              {course.completed && (
                                <Badge colorScheme="green">Tamamlandı</Badge>
                              )}
                            </VStack>
                            <VStack justify="center">
                              {course.completed ? (
                                <Button 
                                  colorScheme="green" 
                                  variant="outline" 
                                  leftIcon={<CheckCircleIcon />} 
                                  size="sm"
                                  isDisabled
                                >
                                  Tamamlandı
                                </Button>
                              ) : (
                                <Button 
                                  colorScheme="blue" 
                                  rightIcon={<ExternalLinkIcon />}
                                  size="sm"
                                  onClick={() => handleCompleteTraining(course.id)}
                                >
                                  Kursa Git
                                </Button>
                              )}
                            </VStack>
                          </Flex>
                        </CardBody>
                      </Card>
                    ))}
                  </SimpleGrid>
                </TabPanel>
                <TabPanel>
                  <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={4}>
                    {DEMO_COURSES.productivity.map(course => (
                      <Card key={course.id} direction="row" overflow="hidden" variant="outline">
                        <CardBody>
                          <Flex justifyContent="space-between" h="100%">
                            <VStack align="start" spacing={2}>
                              <Heading size="sm">{course.title}</Heading>
                              <HStack spacing={2} fontSize="sm" color="gray.500">
                                <Icon as={TimeIcon} />
                                <Text>{course.duration}</Text>
                                <Text>•</Text>
                                <Text>{course.modules} modül</Text>
                              </HStack>
                              <Badge colorScheme={course.difficulty === 'Başlangıç' ? 'green' : course.difficulty === 'Orta' ? 'blue' : 'purple'}>
                                {course.difficulty}
                              </Badge>
                              {course.completed && (
                                <Badge colorScheme="green">Tamamlandı</Badge>
                              )}
                            </VStack>
                            <VStack justify="center">
                              {course.completed ? (
                                <Button 
                                  colorScheme="green" 
                                  variant="outline" 
                                  leftIcon={<CheckCircleIcon />} 
                                  size="sm"
                                  isDisabled
                                >
                                  Tamamlandı
                                </Button>
                              ) : (
                                <Button 
                                  colorScheme="blue" 
                                  rightIcon={<ExternalLinkIcon />}
                                  size="sm"
                                  onClick={() => handleCompleteTraining(course.id)}
                                >
                                  Kursa Git
                                </Button>
                              )}
                            </VStack>
                          </Flex>
                        </CardBody>
                      </Card>
                    ))}
                  </SimpleGrid>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </Box>

          {/* Eğitim İstatistikleri */}
          <Box mt={8}>
            <Heading size="md" mb={4}>Eğitim İstatistikleriniz</Heading>
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={5}>
              <Stat p={5} bg={cardBg} borderRadius="lg" boxShadow="sm">
                <StatLabel>Tamamlanan Kurslar</StatLabel>
                <StatNumber>3</StatNumber>
                <StatHelpText>Son 3 ayda</StatHelpText>
                <Progress value={30} colorScheme="green" size="sm" mt={2} />
              </Stat>
              <Stat p={5} bg={cardBg} borderRadius="lg" boxShadow="sm">
                <StatLabel>Toplam Eğitim Saati</StatLabel>
                <StatNumber>8.5</StatNumber>
                <StatHelpText>Saat</StatHelpText>
                <Progress value={42.5} colorScheme="blue" size="sm" mt={2} />
              </Stat>
              <Stat p={5} bg={cardBg} borderRadius="lg" boxShadow="sm">
                <StatLabel>Tamamlanma Oranı</StatLabel>
                <StatNumber>25%</StatNumber>
                <StatHelpText>Atanan eğitimler</StatHelpText>
                <Progress value={25} colorScheme="yellow" size="sm" mt={2} />
              </Stat>
            </SimpleGrid>
          </Box>
        </VStack>
      </Box>
    );
  };

  // Admin eğitim yönetimi
  const renderAdminTraining = () => {
    if (!adminData) return null;

    // Kategorilere göre tamamlanma oranları
    const completionRates = {
      'İletişim': 45,
      'Zaman Yönetimi': 65,
      'İşbirliği': 30,
      'Üretkenlik': 55,
      'Teknik Beceriler': 70,
      'Liderlik': 25
    };

    // Çalışanların eğitim tamamlama oranları
    const employeeCompletionRates = [
      { id: '1', name: 'Ali Yılmaz', completed: 5, assigned: 8, rate: 62.5 },
      { id: '2', name: 'Ayşe Kaya', completed: 3, assigned: 10, rate: 30 },
      { id: '3', name: 'Mehmet Öz', completed: 7, assigned: 7, rate: 100 },
      { id: '4', name: 'Zeynep Demir', completed: 2, assigned: 6, rate: 33.3 },
      { id: '5', name: 'Mustafa Şahin', completed: 4, assigned: 9, rate: 44.4 },
    ];

    return (
      <Box p={5}>
        <VStack spacing={8} align="stretch">
          <Box>
            <Heading size="lg" mb={4}>Eğitim Yönetimi</Heading>
            <Text color="gray.600" mb={6}>
              Şirketteki tüm eğitim aktivitelerini ve çalışanların tamamlama oranlarını görüntüleyebilirsiniz.
            </Text>
          </Box>

          {/* Eğitim Tamamlama İstatistikleri */}
          <Box>
            <Heading size="md" mb={4}>Eğitim Tamamlama İstatistikleri</Heading>
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={5}>
              <Stat p={5} bg={cardBg} borderRadius="lg" boxShadow="sm">
                <StatLabel>Ortalama Tamamlama Oranı</StatLabel>
                <StatNumber>54%</StatNumber>
                <StatHelpText>Tüm Şirket</StatHelpText>
                <Progress value={54} colorScheme="blue" size="sm" mt={2} />
              </Stat>
              <Stat p={5} bg={cardBg} borderRadius="lg" boxShadow="sm">
                <StatLabel>Toplam Tamamlanan Kurs</StatLabel>
                <StatNumber>87</StatNumber>
                <StatHelpText>Son 6 ayda</StatHelpText>
                <Progress value={70} colorScheme="green" size="sm" mt={2} />
              </Stat>
              <Stat p={5} bg={cardBg} borderRadius="lg" boxShadow="sm">
                <StatLabel>Bekleyen Atanan Kurslar</StatLabel>
                <StatNumber>34</StatNumber>
                <StatHelpText>Tamamlanmamış</StatHelpText>
                <Progress value={40} colorScheme="orange" size="sm" mt={2} />
              </Stat>
            </SimpleGrid>
          </Box>

          {/* Kategori Bazlı Eğitim Tamamlama */}
          <Box>
            <Heading size="md" mb={4}>Kategori Bazlı Eğitim Tamamlama</Heading>
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={5}>
              {Object.entries(completionRates).map(([category, rate]) => (
                <Card key={category} bg={cardBg}>
                  <CardBody>
                    <VStack spacing={3} align="stretch">
                      <Heading size="sm">{category}</Heading>
                      <Progress 
                        value={rate} 
                        colorScheme={getProgressColor(rate)} 
                        size="sm" 
                        borderRadius="md"
                      />
                      <Flex justifyContent="space-between">
                        <Text fontSize="sm" fontWeight="bold">{rate}%</Text>
                        <Text fontSize="xs" color="gray.500">Tamamlanma Oranı</Text>
                      </Flex>
                    </VStack>
                  </CardBody>
                </Card>
              ))}
            </SimpleGrid>
          </Box>

          {/* Çalışan Eğitim Takibi */}
          <Box mt={5}>
            <Heading size="md" mb={4}>Çalışan Eğitim Takibi</Heading>
            <Card bg={cardBg}>
              <CardBody>
                <VStack spacing={5} align="stretch">
                  {employeeCompletionRates.map(employee => (
                    <Box key={employee.id}>
                      <Flex justifyContent="space-between" mb={2}>
                        <Text fontWeight="medium">{employee.name}</Text>
                        <HStack spacing={4}>
                          <Text fontSize="sm">{employee.completed}/{employee.assigned} Kurs</Text>
                          <Text fontWeight="bold" color={getProgressColor(employee.rate)}>
                            {employee.rate.toFixed(1)}%
                          </Text>
                        </HStack>
                      </Flex>
                      <Progress 
                        value={employee.rate} 
                        colorScheme={getProgressColor(employee.rate)} 
                        size="sm" 
                        borderRadius="md"
                      />
                    </Box>
                  ))}
                </VStack>
              </CardBody>
            </Card>
          </Box>

          {/* Eğitim Atama Bölümü */}
          <Box mt={5}>
            <Heading size="md" mb={4}>Eğitim Atama</Heading>
            <Card bg={cardBg}>
              <CardBody>
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={5}>
                  <VStack align="stretch" spacing={3}>
                    <Heading size="sm">Popüler Kurslar</Heading>
                    <Divider />
                    {Object.values(DEMO_COURSES)
                      .flat()
                      .slice(0, 5)
                      .map(course => (
                        <Flex key={course.id} justifyContent="space-between" alignItems="center" p={2} borderWidth="1px" borderRadius="md">
                          <VStack align="start" spacing={0}>
                            <Text fontWeight="medium" fontSize="sm">{course.title}</Text>
                            <Text fontSize="xs" color="gray.500">{course.duration} • {course.difficulty}</Text>
                          </VStack>
                          <Button 
                            size="xs" 
                            colorScheme="blue"
                            onClick={() => handleAssignTraining(course.id, selectedEmployee)}
                          >
                            Ata
                          </Button>
                        </Flex>
                      ))}
                  </VStack>

                  <VStack align="stretch" spacing={3}>
                    <Heading size="sm">Özel Kurs Atamaları</Heading>
                    <Divider />
                    <Text fontSize="sm" color="gray.600">
                      Belirli bir çalışana özel kurs atamak için çalışanı seçin ve kurslardan birini atayın.
                    </Text>
                    <Box>
                      <Text fontWeight="medium" mb={2}>Çalışan Seçin</Text>
                      <SimpleGrid columns={2} spacing={2}>
                        {allEmployees.map(emp => (
                          <Button 
                            key={emp.id} 
                            size="sm" 
                            colorScheme={selectedEmployee === emp.id ? "blue" : "gray"}
                            variant={selectedEmployee === emp.id ? "solid" : "outline"}
                            onClick={() => setSelectedEmployee(emp.id)}
                          >
                            {emp.name}
                          </Button>
                        ))}
                      </SimpleGrid>
                    </Box>
                  </VStack>
                </SimpleGrid>
              </CardBody>
            </Card>
          </Box>
        </VStack>
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
      {isAdmin() ? renderAdminTraining() : renderEmployeeTraining()}
    </Box>
  );
};

export default Training; 