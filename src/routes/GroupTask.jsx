import {useState, useEffect, useRef} from "react"
import { Image, Box, Text, Skeleton, VStack, Flex, Avatar, HStack, CardHeader, Heading, Card, CardBody, Center, IconButton, Button, Icon, forwardRef, FormControl, FormLabel, Input, Stack, ButtonGroup, Popover, PopoverTrigger, PopoverContent, PopoverBody, PopoverHeader, useDisclosure, Modal, ModalOverlay, ModalContent, ModalCloseButton, ModalBody, ModalFooter, ModalHeader } from '@chakra-ui/react';
import { useNavigate, useParams } from "react-router-dom";
import { AddIcon, DeleteIcon, EditIcon } from "@chakra-ui/icons";
import TaskDetail from "./TaskDetail";
import CreateTask from "./CreateTask";

const GroupTask = () => {
    const { orgId } = useParams();

    const baseUrl = process.env.REACT_APP_BACKEND_API_URL;
    // const orgId = 1; // will be taken from user

    const [user, setUser] = useState('')
    const [error, setError] = useState('');
    const [groupTasks, setGroupTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedTask, setSelectedTask] = useState(null);
    const [selectedAddTask,  setSelectedAddTask] = useState(null)
    const { isOpen, onOpen, onClose } = useDisclosure();
    const navigate = useNavigate();

    useEffect(() => {
        fetchGroupTasks()
        }, [selectedAddTask, selectedTask, orgId]);


        const fetchGroupTasks = () => {
            fetch(`${baseUrl}/${orgId}/grouptasks`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem("token")}`
                }
            })
            .then((response) => response.json())
            .then((data) => {
                console.log(data)
                setGroupTasks(data);
                setLoading(false);
            })
            .catch((error) => {
                setError(error);
            })
        } 
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const options = { month: 'short', day: 'numeric' };
        return date.toLocaleString('en-US', options);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'To Do':
                return 'green.200';
            case 'In Progress':
                return 'yellow.200';
            case 'Done':
                return 'blue.200';
            default:
                return 'gray.200';
        }
    };
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
                if (method === "PUT"){
                    const { id } = await response.json();
                    setGroupTasks((prevData) =>
                        prevData.map(item =>
                            item.ID === id ? { ...item, ...formDataObj } : item
                        )
                    );
                } 
                else if (method === "DELETE" || method === "POST") {
                    fetchGroupTasks();
                }

            } else {
                alert("there's something wrong");
            }
        } catch (error) {
            console.error('Terjadi kesalahan:', error);
        }
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

    // parameter user with role admin
    const CreateGroupTask = (orgId) => {
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

    const CreateGroupTaskButton = () => {
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

    const EditGroupTaskForm = (id) => {
        const api = `${baseUrl}/${orgId}/grouptasks/${id}` 
        return (
            // put api backend here
            <form onSubmit={(e) => HandleSubmit(e, api, "PUT")}>
                <FormControl>
                    <FormLabel>Title</FormLabel>
                    <Input type="text" name="title"/>
                </FormControl>
                <Button type="submit" mt={4} colorScheme="teal">
                    Submit
                </Button>
            </form>
        )
    }
    // parameter user with role admin
    const EditGroupTask = (id) => {
        return (    
            <PopoverComponent content={EditGroupTaskForm(id.id)}> 
                <Button
                    size="sm" 
                    variant="ghost" 
                    p={0}
                    borderRadius="full"
                >
                    <EditIcon color={"blue"}/>
                </Button>
            </PopoverComponent>
        )    
    }

    const DeleteGroupTaskForm = (id) => {
        const api = `${baseUrl}/${orgId}/grouptasks/${id}` 
        return (
                <form onSubmit={(e) => HandleSubmit(e, api, "DELETE")} style={{ display: 'flex', justifyContent: 'center' }}>
                    <Button type="submit" colorScheme="red">
                        Delete
                    </Button>
                </form>
        )
    }
    // parameter user with role admin
    const DeleteGroupTask = (id) => {
        const { isOpen, onOpen, onClose } = useDisclosure()
        const initialRef = useRef(null)
        const finalRef = useRef(null)
        const groupTaskId = id.id
        return (
            <>
                <Button 
                onClick={onOpen}
                size="sm" 
                variant="ghost" 
                p={0}
                borderRadius="full"
                >
                    <DeleteIcon color={"red"}/>
                </Button>

                <Modal 
                    isOpen={isOpen} 
                    onClose={onClose}
                    initialFocusRef={initialRef}
                    finalFocusRef={finalRef}
                >
                    <ModalOverlay/>
                    <ModalContent>
                        <ModalCloseButton/>     
                        <ModalHeader/>
                        <ModalBody pb={6}>
                            <Text>Are you sure you want to delete the group task?</Text>
                        </ModalBody>
                        <ModalFooter>
                            <Button colorScheme='blue' mr={3} onClick={onClose}>
                            Close
                            </Button>
                            {DeleteGroupTaskForm(groupTaskId)}
                        </ModalFooter>
                    </ModalContent>
                </Modal>    
            </>
            
        )
    }



    const handleTaskClick = (taskId, orgId) => {
        setSelectedTask({ taskId, orgId });
        onOpen();
    };


    const handleAddTaskClick = (groupTaskId, orgId) => {
        setSelectedAddTask({groupTaskId, orgId});
        onOpen();
    }

    return (
        <Box className="GroupTask-page" overflowX="auto" minH="100vh" p={4} bg="blue.50">
            
            {CreateGroupTask(orgId)}
            {loading ? (
                <Skeleton className="GroupTask-page-loading" height="250px" />
            ) : groupTasks.length === 0 ? 
                <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                height="100vh"
                textAlign="center"
            >
                <Text fontSize="xl" fontWeight="bold" color="gray.600">
                No Group Tasks Created Yet
                </Text>
                <Text fontSize="md" color="gray.500">
                Please create a new group task to get started.
                </Text>
            </Box>
          
            : (
                <>
                <HStack spacing={4} alignItems="flex-start">
                    {groupTasks.map(gt => (
                        <Card
                            flexShrink="0"
                            key={gt.ID}
                            keyorg={gt.organization_id}
                            backgroundColor={"#ebecf0"}
                            width="300px"
                            height="100%"
                        >

                            <CardHeader>
                                <Flex justifyContent="space-between" align="center">
                                    <Heading size='md'>
                                        {gt.title}
                                    </Heading>
                                    {/* will be used by admin role */}
                                    {/* {admin?.role === "role" && (
                                        <> */}
                                    <HStack spacing={1}>
                                        <EditGroupTask id={gt.ID}/>
                                        <DeleteGroupTask id={gt.ID}/>
                                    </HStack>
                                    {/* </>
                                    )} */}
                                </Flex>
                            </CardHeader>

                            <CardBody>
                                <VStack align="stretch">
                                    {gt.tasks.map(t => (
                                        <Card 
                                            key={t.ID} 
                                            cursor="pointer"
                                            onClick={() => handleTaskClick(t.ID, gt.organization_id)}
                                            mb={1}
                                            width="100%"
                                        >
                                            <Text>{gt.organizationid}</Text>
                                            <CardHeader>
                                                <Heading size="xs">{t.title}</Heading>
                                            </CardHeader>
                                            <CardBody pt="0px">
                                                <Flex direction="row" gap="10px" align="center">
                                                    <Box
                                                        backgroundColor={getStatusColor(t.status)}
                                                        borderRadius="md"
                                                        p={2}
                                                    >
                                                        <Text fontSize="12px">{t.status}</Text>
                                                    </Box>
                                                    <Text fontSize="sm">{formatDate(t.deadline)}</Text>
                                                    {new Date(t.deadline) < new Date() ? 
                                                    (
                                                        <Box color="red.500">
                                                            <Text fontWeight="bold">Overdue</Text>
                                                        </Box>
                                                    ): null}
                                                </Flex>
                                            </CardBody> 
                                        </Card>
                                    ))}
                                    <Button
                                        width="full"
                                        fontWeight="700"
                                        backgroundColor={"#ebecf0"}
                                        onClick={() => handleAddTaskClick(gt.ID, gt.organization_id)}
                                        justifyContent="flex-start"
                                        variant="ghost"
                                        p={0}
                                    >
                                        <AddIcon />
                                        <Text ml={2}>Add Task</Text>
                                    </Button>
                                </VStack>
                            </CardBody>
                        </Card>  
                    ))}
                </HStack>
                {selectedTask && (
                    <TaskDetail
                    isOpen={isOpen}
                    onClose={onClose}
                    setStateFunc={setSelectedTask}
                    input={selectedTask}
                    />
                )}
                {selectedAddTask && (
                    <CreateTask 
                    isOpen={isOpen}
                    onClose={onClose}
                    setStateFunc={setSelectedAddTask}
                    input={selectedAddTask}
                    />
                )}
                </>
            )}
        </Box>
        
    )
}

export default GroupTask