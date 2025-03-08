import { useState } from 'react';
import { Box, Button, Text, Input, VStack, Heading, useToast, Divider, Code, SimpleGrid, Card, CardBody, Badge } from '@chakra-ui/react';
import supabase from '../services/supabase';

const Setup = () => {
  const [adminEmail, setAdminEmail] = useState('admin@example.com');
  const [adminPassword, setAdminPassword] = useState('adminpassword123');
  const [employeeEmail, setEmployeeEmail] = useState('employee@example.com');
  const [employeePassword, setEmployeePassword] = useState('employeepassword123');
  const [loading, setLoading] = useState(false);
  const [setupComplete, setSetupComplete] = useState(false);
  const [users, setUsers] = useState([]);
  const toast = useToast();

  const createUser = async (email, password, role) => {
    try {
      // Kullanıcı oluştur
      const { data: userData, error: userError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (userError) throw userError;

      // Profil bilgilerini kaydet (rol bilgisi dahil)
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([
          {
            id: userData.user.id,
            email,
            role,
            created_at: new Date(),
          },
        ]);

      if (profileError) throw profileError;

      return { success: true, user: userData.user };
    } catch (error) {
      console.error(`${role} kullanıcısı oluşturma hatası:`, error);
      return { success: false, error };
    }
  };

  const handleSetup = async () => {
    setLoading(true);
    try {
      // Admin kullanıcısı oluştur
      const adminResult = await createUser(adminEmail, adminPassword, 'admin');
      
      // Çalışan kullanıcısı oluştur
      const employeeResult = await createUser(employeeEmail, employeePassword, 'employee');

      if (adminResult.success || employeeResult.success) {
        setSetupComplete(true);
        
        // Oluşturulan kullanıcıları listele
        const newUsers = [];
        if (adminResult.success) {
          newUsers.push({ email: adminEmail, password: adminPassword, role: 'admin' });
        }
        if (employeeResult.success) {
          newUsers.push({ email: employeeEmail, password: employeePassword, role: 'employee' });
        }
        setUsers(newUsers);
        
        toast({
          title: 'Kurulum Tamamlandı',
          description: 'Test kullanıcıları başarıyla oluşturuldu!',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
      } else {
        toast({
          title: 'Kurulum Hatası',
          description: 'Kullanıcılar oluşturulurken bir hata meydana geldi.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('Kurulum hatası:', error);
      toast({
        title: 'Kurulum Hatası',
        description: `Hata: ${error.message}`,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box maxW="800px" mx="auto" p={8}>
      <Heading mb={6}>ALMS Sistem Kurulumu</Heading>
      <Text mb={4}>
        Bu sayfa, test için admin ve çalışan kullanıcıları oluşturmanızı sağlar. Bu işlem yalnızca bir kere yapılmalıdır.
      </Text>

      {setupComplete ? (
        <Box mt={6}>
          <Heading size="md" mb={4} color="green.500">
            Kurulum Tamamlandı!
          </Heading>
          <Text mb={4}>
            Aşağıdaki kullanıcı bilgileriyle giriş yapabilirsiniz:
          </Text>

          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={5}>
            {users.map((user, index) => (
              <Card key={index} variant="outline">
                <CardBody>
                  <Badge colorScheme={user.role === 'admin' ? 'purple' : 'blue'} mb={2}>
                    {user.role === 'admin' ? 'Admin' : 'Çalışan'}
                  </Badge>
                  <Text><strong>E-posta:</strong> {user.email}</Text>
                  <Text><strong>Şifre:</strong> {user.password}</Text>
                </CardBody>
              </Card>
            ))}
          </SimpleGrid>

          <Button mt={6} colorScheme="blue" onClick={() => window.location.href = '/login'}>
            Giriş Sayfasına Git
          </Button>
        </Box>
      ) : (
        <VStack spacing={4} align="stretch">
          <Box p={5} borderWidth="1px" borderRadius="lg">
            <Heading size="sm" mb={3}>Admin Kullanıcısı</Heading>
            <VStack spacing={3}>
              <Input 
                placeholder="Admin E-posta" 
                value={adminEmail} 
                onChange={(e) => setAdminEmail(e.target.value)} 
              />
              <Input 
                placeholder="Admin Şifre" 
                value={adminPassword} 
                onChange={(e) => setAdminPassword(e.target.value)}
                type="password"
              />
            </VStack>
          </Box>

          <Box p={5} borderWidth="1px" borderRadius="lg">
            <Heading size="sm" mb={3}>Çalışan Kullanıcısı</Heading>
            <VStack spacing={3}>
              <Input 
                placeholder="Çalışan E-posta" 
                value={employeeEmail} 
                onChange={(e) => setEmployeeEmail(e.target.value)} 
              />
              <Input 
                placeholder="Çalışan Şifre" 
                value={employeePassword} 
                onChange={(e) => setEmployeePassword(e.target.value)}
                type="password"
              />
            </VStack>
          </Box>

          <Box mt={4}>
            <Button 
              colorScheme="blue" 
              onClick={handleSetup} 
              isLoading={loading}
              width="full"
            >
              Kullanıcıları Oluştur
            </Button>
          </Box>
        </VStack>
      )}

      <Divider my={8} />

      <Box>
        <Heading size="md" mb={4}>
          Teknik Bilgiler
        </Heading>
        <Text mb={2}>
          Supabase'de yapılması gerekenler:
        </Text>
        <VStack align="start" spacing={2} mb={4}>
          <Text>1. Supabase'in SQL Editörü'nde aşağıdaki kodu çalıştırın:</Text>
          <Code p={4} borderRadius="md" fontSize="sm" whiteSpace="pre" display="block" mb={4}>
{`CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  role TEXT DEFAULT 'employee',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Row Level Security (RLS) ayarlarını ekle
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profilleri herkesin görebilmesi için politika oluştur
CREATE POLICY "Herkes profilleri görebilir"
  ON public.profiles FOR SELECT
  USING (true);

-- Kullanıcıların kendi profillerini güncellemelerine izin ver
CREATE POLICY "Kullanıcılar kendi profillerini düzenleyebilir"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);`}
          </Code>
        </VStack>

        <Text fontSize="sm" color="gray.600">
          Not: Kullanıcı oluşturabilmek için Supabase projenizde Authentication &gt; Settings &gt; Email Auth bölümünden "Confirm email" seçeneğini devre dışı bırakmanız gerekebilir.
        </Text>
      </Box>
    </Box>
  );
};

export default Setup; 