import React from "react";
import { Box, Button, Divider, Flex, HStack, Image, Text } from '@chakra-ui/react';
import { useNavigate, Outlet } from 'react-router-dom';
const Home = () => {

    const navigate = useNavigate();

    const handleLogout = () => {
      localStorage.removeItem('accessToken');
      navigate('/signin');
    };

    return (
        <Flex flexDirection="column">
            <Flex color="white" bg="white" position="fixed" top="0" left="0" right="0" zIndex="1000" borderBottom="1px solid black" height="60px">
            <Flex justifyContent="space-between" w="full" alignItems="center" pl={5}>
              <Box>
                <Button
                  fontWeight="700"
                  color="black"
                  onClick={() => navigate('/organizations')}
                >
                  Home
                </Button>
              </Box>
                <Flex gap={2}>
                  <Button
                    fontWeight="700"
                    color="black"
                    onClick={() => navigate('/organizations')}>
                    Organizations
                  </Button>
                  
                  <Button 
                    alignItems="center"
                    height="full"
                    borderRadius={0}
                    borderColor="black"
                    bg="white"
                    gap={2}
                    onClick={() => navigate('/user')}>
                    <Image src={"https://www.startpage.com/av/proxy-image?piurl=https%3A%2F%2Fstatic.vecteezy.com%2Fsystem%2Fresources%2Fpreviews%2F007%2F409%2F979%2Foriginal%2Fpeople-icon-design-avatar-icon-person-icons-people-icons-are-set-in-trendy-flat-style-user-icon-set-vector.jpg&sp=1726133936T08300c0284a12643dbd393e6e56d0790da55c854d11ee1a68c81f8ca1232280c"} height={10} w={10} borderRadius="full"/>
                    <Flex flexDirection="column" alignItems="flex-start">
                      <Text fontSize="sm">Name User</Text>
                      <Text fontSize="sm">Role</Text>
                    </Flex>
                  </Button>     
                </Flex>
            </Flex>
          </Flex>
          <Box flex="1" mt="60px">
            <Outlet />
          </Box>
        </Flex>
      );
};

export default Home;
