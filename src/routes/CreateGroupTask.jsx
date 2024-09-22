import { AddIcon } from "@chakra-ui/icons";
import { Box, Button, FormControl, FormLabel, Input, Popover, PopoverBody, PopoverContent, PopoverTrigger, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const CreateGroupTask = () => {     
    const { orgId } = useParams()
    const baseUrl = process.env.REACT_APP_BACKEND_API_URL;

    const navigate = useNavigate()

    const PopoverComponent = ({ content, children }) => {
        return (
            <Popover
                placement="bottom"
            >
                <PopoverTrigger>
                    {children}
                </PopoverTrigger>
                <PopoverContent>
                    <PopoverBody>
                        {content}
                    </PopoverBody>
                </PopoverContent>
            </Popover>
        );
    };    
        const CreateGroupTaskForm = (orgId) => {
            const api = `${baseUrl}/${orgId}/grouptasks` 
            return (
                <form onSubmit={(e) => HandleSubmit(e, api, "POST")}>
                    <FormControl>
                        <FormLabel>Title</FormLabel>
                        <Input type="text" name="title"/>
                    </FormControl>
                    <Input type="hidden" name="organization_id" value={Number(orgId)}/>
                    <Button type="submit" mt={4} colorScheme="teal">
                        Submit
                    </Button>
                </form>
            )
        }

    const HandleSubmit = async (e, api, method) => {
        e.preventDefault();
        // Create a FormData object from the form
        const formData = new FormData(e.target);
        const formDataObj = Object.fromEntries(formData.entries());
        try {
            const response = await fetch(api, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify(formDataObj),
            });
            if (response.status === 200 || response.status === 201){
                navigate(-1)
            } else {
                alert("there's something wrong");
            }
        } catch (error) {
            console.error('Terjadi kesalahan:', error);
        }
    };

    return (
        <PopoverComponent content={CreateGroupTaskForm(orgId)}>
            <Box w="fit-content" pb={4}>
                <Button
                    width="full"
                    fontWeight="700"
                    bg="grey"
                >
                    <AddIcon />
                    <Text ml={2}>Create Task Group</Text>
                </Button>                    
            </Box>
        </PopoverComponent>
       
    )
}

export default CreateGroupTask