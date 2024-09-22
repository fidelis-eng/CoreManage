import React from 'react'
import { Box, Button, Center, FormControl, FormLabel, Input, Stack, Text, FormErrorMessage, InputGroup, InputRightElement, FormHelperText, Spinner, SimpleGrid, Card, CardBody, Flex } from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { Link, Outlet, useNavigate, useParams } from 'react-router-dom';

// TODO: answer here
const ListOrganizations = () => {
    const baseUrl = process.env.REACT_APP_BACKEND_API_URL;

    const {orgId} = useParams();
    const [organizations, setOrganizations] = useState([]) 
    const [loading, setloading] = useState(true)
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
      username: '',
      password: ''
    });
    const navigate = useNavigate()

    useEffect(() => {
      fetch(`${baseUrl}/organizations`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem("token")}`
        }
      })
      .then(response => response.json())
      .then(data => {
        if (data.error){
          throw data.error
        } 
        setOrganizations(data)
        setloading(false)
      })
      .catch(error => {
          console.error('Error fetching tasks:', error);
      })
  }, [])
    
  return (
    <Box bg="blue.50">
      {loading ? (
        <Center height="100vh">
          <Spinner />
        </Center>
      ) : orgId ? (
        <Outlet />
      ) : (
        <Flex height="100vh" flexDirection="column" justifyContent="center" alignItems="center">
          <Box mb={8}>
            <Text fontSize="2xl" fontWeight="bold" textAlign="center">
              Choose Your Organization
            </Text>
          </Box>
          <Stack spacing={6} width="80%" maxW="500px">
            {organizations.map((org) => (
              <Card key={org.organization_id} p={6} boxShadow="lg" cursor="pointer" 
              onClick={() => navigate(`/organizations/${org.organization_id}`)}>
                <CardBody>
                  <Text fontSize="lg" fontWeight="bold" >
                    {org.organization_name}
                  </Text>
                  <Text fontSize="md" color="gray.500">
                    ID: {org.organization_id}
                  </Text>
                </CardBody>
              </Card>
            ))}
          </Stack>

        </Flex>
      )}
    </Box>

  );
  
};

export default ListOrganizations;
