import { Box, Text, Button, Flex } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
    const navigate = useNavigate();

    const handleGoHome = () => {
        navigate(-1);
    };

    return (
        <Flex align="center" justify="center" height="100vh" textAlign="center">
            <Box>
                <Text fontSize="6xl" fontWeight="bold">404</Text>
                <Text fontSize="2xl">Page Not Found</Text>
                <Button mt={4} colorScheme="teal" onClick={handleGoHome}>
                    Back
                </Button>
            </Box>
        </Flex>
    );
};

export default NotFound;
