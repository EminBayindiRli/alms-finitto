import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Heading,
  Text,
  useToast,
  Container,
  InputGroup,
  InputRightElement,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Card,
  CardBody,
  Badge,
  Divider,
} from '@chakra-ui/react';

// Sabit kullanıcı bilgileri
const DEMO_USERS = {
  employee: {
    email: 'employee@alms-system.com',
    password: 'employee123',
    role: 'employee',
    id: '1', // Employee ID - API çağrısında kullanılacak
    name: 'Ali Yılmaz',
    department: 'Product Development',
    team: 'Team-2'
  },
  admin: {
    email: 'admin@alms-system.com',
    password: 'admin123',
    role: 'admin',
    id: 'admin',
    name: 'Mehmet Demir',
    department: 'Management',
    team: 'Leadership'
  }
};

const Login = () => {
  const navigate = useNavigate();
  const toast = useToast();
  
  // Login state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // Demo kullanıcıları için aktif sekme
  const [activeTab, setActiveTab] = useState(0);
  
  // Başlangıçta localStorage'ı temizle
  useEffect(() => {
    localStorage.removeItem('alms_user');
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: 'Giriş Hatası',
        description: 'Lütfen e-posta ve şifrenizi girin.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    
    setLoading(true);
    
    // Demo kullanıcıları kontrol et
    const employeeUser = DEMO_USERS.employee;
    const adminUser = DEMO_USERS.admin;
    
    if (email === employeeUser.email && password === employeeUser.password) {
      // Employee kullanıcısı için simülasyon
      setTimeout(() => {
        // Kullanıcı bilgilerini localStorage'a kaydet
        const userData = {
          id: employeeUser.id,
          email: employeeUser.email,
          role: employeeUser.role,
          name: employeeUser.name,
          department: employeeUser.department,
          team: employeeUser.team
        };
        
        localStorage.setItem('alms_user', JSON.stringify(userData));
        console.log('Saved employee user data to localStorage:', userData);
        
        toast({
          title: 'Giriş Başarılı',
          description: 'ALMS sistemine hoş geldiniz. (Çalışan olarak)',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
        
        setLoading(false);
        navigate('/dashboard');
      }, 1000); // 1 saniyelik yapay gecikme
    } 
    else if (email === adminUser.email && password === adminUser.password) {
      // Admin kullanıcısı için simülasyon
      setTimeout(() => {
        // Kullanıcı bilgilerini localStorage'a kaydet
        const userData = {
          id: adminUser.id,
          email: adminUser.email,
          role: adminUser.role,
          name: adminUser.name,
          department: adminUser.department,
          team: adminUser.team
        };
        
        localStorage.setItem('alms_user', JSON.stringify(userData));
        console.log('Saved admin user data to localStorage:', userData);
        
        toast({
          title: 'Giriş Başarılı',
          description: 'ALMS sistemine hoş geldiniz. (Yönetici olarak)',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
        
        setLoading(false);
        window.location.href = '/dashboard'; // Tam sayfa yeniden yükleme
      }, 1000); // 1 saniyelik yapay gecikme
    } 
    else {
      // Hatalı giriş
      setTimeout(() => {
        setLoading(false);
        toast({
          title: 'Giriş Hatası',
          description: 'E-posta veya şifre hatalı. Lütfen demo hesaplarını kullanın.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }, 1000);
    }
  };

  const toggleShowPassword = () => setShowPassword(!showPassword);
  
  const setDemoUser = (userType) => {
    const user = DEMO_USERS[userType];
    setEmail(user.email);
    setPassword(user.password);
  };
  
  return (
    <Container maxW="container.sm" py={10}>
      <Box w="100%" p={8} borderWidth={1} borderRadius="lg" boxShadow="lg" bg="white">
        <Tabs variant="enclosed" index={activeTab} onChange={setActiveTab}>
          <TabList mb="1em">
            <Tab>Giriş Yap</Tab>
            <Tab>Demo Hesaplar</Tab>
          </TabList>
          <TabPanels>
            {/* Giriş Paneli */}
            <TabPanel>
              <VStack spacing={4} align="flex-start">
                <Heading>ALMS'ye Giriş Yap</Heading>
                <Text color="gray.600">
                  Öğrenme Yönetim Sistemi Analizleri
                </Text>
                
                <form onSubmit={handleLogin} style={{ width: '100%' }}>
                  <VStack spacing={4} align="flex-start" w="full">
                    <FormControl isRequired>
                      <FormLabel>E-posta</FormLabel>
                      <Input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="ornek@sirket.com"
                      />
                    </FormControl>
                    
                    <FormControl isRequired>
                      <FormLabel>Şifre</FormLabel>
                      <InputGroup>
                        <Input
                          type={showPassword ? 'text' : 'password'}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="********"
                        />
                        <InputRightElement width="4.5rem">
                          <Button h="1.75rem" size="sm" onClick={toggleShowPassword}>
                            {showPassword ? 'Gizle' : 'Göster'}
                          </Button>
                        </InputRightElement>
                      </InputGroup>
                    </FormControl>
                    
                    <Button
                      type="submit"
                      colorScheme="blue"
                      width="full"
                      isLoading={loading}
                      loadingText="Giriş yapılıyor..."
                      mt={4}
                    >
                      Giriş Yap
                    </Button>
                    
                    <Box width="full" mt={2}>
                      <Divider my={4} />
                      <Text color="gray.500" fontSize="sm" textAlign="center">
                        Demo hesap bilgileri için "Demo Hesaplar" sekmesine geçin.
                      </Text>
                    </Box>
                  </VStack>
                </form>
              </VStack>
            </TabPanel>

            {/* Demo Hesaplar Paneli */}
            <TabPanel>
              <VStack spacing={6} align="flex-start">
                <Heading size="md">Demo Hesaplar</Heading>
                <Text color="gray.600">
                  Aşağıdaki demo hesaplarını kullanarak sisteme giriş yapabilirsiniz:
                </Text>
                
                <Card variant="outline" width="full">
                  <CardBody>
                    <VStack align="start" spacing={3}>
                      <Badge colorScheme="blue">Çalışan Hesabı</Badge>
                      <Text><strong>E-posta:</strong> {DEMO_USERS.employee.email}</Text>
                      <Text><strong>Şifre:</strong> {DEMO_USERS.employee.password}</Text>
                      <Text fontSize="sm" color="gray.500">Bu hesap ile yalnızca kendi verilerinizi görebilirsiniz.</Text>
                      <Button 
                        colorScheme="blue" 
                        size="sm" 
                        onClick={() => {
                          setDemoUser('employee');
                          setActiveTab(0); // Giriş sekmesine dön
                        }}
                      >
                        Bu hesabı kullan
                      </Button>
                    </VStack>
                  </CardBody>
                </Card>
                
                <Card variant="outline" width="full">
                  <CardBody>
                    <VStack align="start" spacing={3}>
                      <Badge colorScheme="purple">Yönetici Hesabı</Badge>
                      <Text><strong>E-posta:</strong> {DEMO_USERS.admin.email}</Text>
                      <Text><strong>Şifre:</strong> {DEMO_USERS.admin.password}</Text>
                      <Text fontSize="sm" color="gray.500">Bu hesap ile tüm şirket verilerini görebilirsiniz.</Text>
                      <Button 
                        colorScheme="purple" 
                        size="sm" 
                        onClick={() => {
                          setDemoUser('admin');
                          setActiveTab(0); // Giriş sekmesine dön
                        }}
                      >
                        Bu hesabı kullan
                      </Button>
                    </VStack>
                  </CardBody>
                </Card>
              </VStack>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
};

export default Login; 