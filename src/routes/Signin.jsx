import React from 'react'
import { Box, Button, Center, FormControl, FormLabel, Input, Stack, Text, FormErrorMessage, InputGroup, InputRightElement, FormHelperText } from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// TODO: answer here
const SignIn = () => {
   const baseUrl = process.env.REACT_APP_BACKEND_API_URL;

    const [error, setError] = useState(null);
    const [showPass, setShowPass] = React.useState(false)
    const [formData, setFormData] = useState({
      username: '',
      password: ''
    });

    const navigate = useNavigate()


      const handleClickPass = () => setShowPass(!showPass)

      const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
          ...formData,
          [name]: value
        });
      };
      
    const handleSubmit = (e) => {
        e.preventDefault();
        if (formData.password.length < 8){
            return
        }

        async function submitFormData() {
          const response = await fetch(`${baseUrl}/signin`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
          });
          return response 
        }

        submitFormData().then((response) => response.json())
          .then((data) => {
            if (data.error){
              setError("Invalid username or password.")
            }
            else{
              localStorage.setItem("token", data.token)
              navigate('/organizations')
            }
          })
          .catch((error) => {
            console.error('Error:', error);
          });
      };

    return (
        <Box className="signin-page" minH="100vh" display="flex" alignItems="center" justifyContent="center" bg="blue.50">
          <Box
            p={8}
            maxWidth="700px"
            width="100%"
            borderWidth={1}
            borderRadius={8}
            bg="white"
          >
            {error && (
                <Box
                  width="full"
                  height="40px"
                  color="red"
                  bg="#fed7d7"
                  alignContent="center"
                  paddingLeft="5px"
                  >
                    {error}
                </Box>
                    )}
            <Box my={4} textAlign="left">
              <form onSubmit={handleSubmit}>
                <FormControl>
                  <FormLabel>Username</FormLabel>
                  <Input 
                    type="text" 
                    name="username"
                    placeholder="username" 
                    data-testid="username" 
                    value={formData.username}
                    onChange={handleChange}
                  />
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
                <Button 
                    width="full" 
                    type="submit" 
                    data-testid="signin-button"
                    spacing = {4}
                    mt = {4}
                >
                    Sign In
                </Button>
                <Stack spacing={4} mt={4} direction="column" justify="space-between">
                  <Text align="center">You have not create account yet?</Text>
                  <Link to="/register">
                    <Button 
                        width="full" 
                        variant="outline" 
                        data-testid="register-button"
                    >
                        Register
                    </Button>
                  </Link>
                </Stack>
              </form>
            </Box>
          </Box>
        </Box>
      );
};

export default SignIn;
