import React from 'react'
import { Box, Button, Center, FormControl, FormLabel, Input, Stack, Text, FormErrorMessage, InputRightElement, InputGroup, FormHelperText } from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
    const baseUrl = process.env.REACT_APP_BACKEND_API_URL;
    // TODO: answer here
    const [error, setError] = useState('')
    const [showPass, setShowPass] = React.useState(false)

    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        name: '',
        email: '',
      });
      
      const handleClickPass = () => setShowPass(!showPass)

      const handleSubmit = (e) => {
        e.preventDefault();
        if (formData.password.length < 8){
            return
        }

        async function saveUser() {
          const response = await fetch(`${baseUrl}/users`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
          });
          return response 
        }

        saveUser().then((response) => response.json())
          .then((data) => {
             if (data.error === "username already registered") { 
                setError(data.error);
              }
              else{
                navigate('/signin')
              }
          })
          .catch((error) => {
            console.error('Error:', error);
          });
      };
    
    return (
        <Box className="register-page" minH="100vh" display="flex" alignItems="center" justifyContent="center" bg="blue.50">
          <Box
            p={8}
            maxWidth="700px"
            width="100%"
            borderWidth={1}
            borderRadius={8}
            bg="white"
          >
            <Box my={4} textAlign="left">
              <form onSubmit={handleSubmit}>
                <FormControl isInvalid={error} isRequired>
                  <FormLabel>Username</FormLabel>
                  <Input 
                    type="text" 
                    name="username"
                    placeholder="username" 
                    data-testid="username" 
                    value={formData.username}
                    onChange={(e) => setFormData((prevData) => ({
                        ...prevData,
                        username: e.target.value
                    }))}
                    />
                  {error && <FormErrorMessage>{error }</FormErrorMessage>}
                </FormControl>
                <FormControl mt={4}  isRequired>
                  <FormLabel>Password</FormLabel>
                  <InputGroup>
                  <Input 
                    type={showPass ? 'text' : 'password'}
                    name="password"
                    placeholder="password" 
                    data-testid="password" 
                    value={formData.password}
                    onChange={(e) => setFormData((prevData) => ({
                        ...prevData,
                        password: e.target.value
                    }))}
                    />
                    <InputRightElement width='4.5rem'>
                        <Button h='1.75rem' size='sm' onClick={handleClickPass}>
                        {showPass ? 'Hide' : 'Show'}
                        </Button>
                    </InputRightElement>
                  </InputGroup>
                  {formData.password.length < 8 &&
                  <FormHelperText>Password must be at least 8 characters long</FormHelperText>
                    }
                </FormControl>
                <FormControl mt={4} isRequired>
                  <FormLabel>Fullname</FormLabel>
                  <Input 
                    type="text" 
                    name="name"
                    placeholder="name" 
                    data-testid="name" 
                    value={formData.name}
                    onChange={(e) => setFormData((prevData) => ({
                        ...prevData,
                        name: e.target.value
                    }))}
                  />
                </FormControl>
                <FormControl mt={4} isRequired>
                  <FormLabel>Email</FormLabel>
                  <Input 
                    type="email" 
                    name="email"
                    placeholder="email" 
                    data-testid="email" 
                    value={formData.email}
                    onChange={(e) => setFormData((prevData) => ({
                        ...prevData,
                        email: e.target.value
                    }))}
                    />
                </FormControl>
                <Button 
                    width="full" 
                    type="submit" 
                    data-testid="register-button"
                    spacing = {4}
                    mt = {4}
                >
                    Register
                </Button>
                <Stack spacing={4} mt={4} direction="column" justify="space-between">
                  <Text align="center">Already have an account?</Text>
                  <Link to="/signin">
                    <Button 
                        width="full" 
                        variant="outline" 
                        data-testid="signin-button"
                    >
                        Sign In
                    </Button>
                  </Link>
                </Stack>
              </form>
            </Box>
          </Box>
        </Box>
      );
};
export default Register;
