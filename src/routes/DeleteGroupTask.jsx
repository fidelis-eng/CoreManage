import { Box, Button, Card, Center, Flex, IconButton, Input, Menu, MenuButton, MenuItem, MenuList, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Popover, PopoverBody, PopoverContent, PopoverTrigger, Select, Skeleton, Spinner, Text, Textarea } from "@chakra-ui/react";
import {useState, useEffect} from "react"
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import { AddIcon, CloseIcon, DeleteIcon, EditIcon, PlusSquareIcon } from "@chakra-ui/icons";

const CreateTask = ({ isOpen, onClose, setStateFunc, input }) => {
    const baseUrl = process.env.REACT_APP_BACKEND_API_URL;

    const [task, setTask] = useState({})
    const [title, setTitle] = useState('');
    const [desc, setDesc] = useState('')
    const [assignedUsers, setAssignedUsers] = useState([])
    const [status, setStatus] = useState("");
    const [selectedDate, setSelectedDate] = useState(null);

    const [members, setMembers] = useState([])
    const [loadingMembers, setLoadingMembers] = useState(true)


    useEffect(() => {
        fetch(`${baseUrl}/${input.orgId}/users`,{
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem("token")}`
                }
            })
            .then(response => response.json())
            .then(data => {
                setMembers(data);
                setLoadingMembers(false);
            })
            .catch(error => console.error('Error fetching users:', error));
    }, [input.orgId]);



    const StatusButton = () => {  

        const handleStatusChange = (e) => {
            setStatus(e.target.value)
        }

        return (
            <>
            <Select
                placeholder="Select a status"
                value={status}
                onChange={handleStatusChange}
            >
                <option value="To Do">To Do</option>
                <option value="In Progress">In Progress</option>
                <option value="Done">Done</option>
            </Select>
            </>
            
        )
    };

    const ListMembers = () => {
        const colors = ["green.500", "blue.500", "yellow.500"];
        return (
            <>
            {assignedUsers.map((user, index) => (
                <Flex key={user.id} bg={colors[index % colors.length]} borderRadius="full" pl={2} alignItems="center" justifyContent="space-between">
                    <Text color="white" fontSize='md'>{user.name}</Text>
                    {/* use for admin role or higher authorization level */}
                    <DeleteMember userIdx={index}/>
                </Flex>
            ))}
            </>
        )
        
    }

    const AddMember = () => {

        const [selectedUser, setSelectedUser] = useState(null);
        const [showSelectedUser, setshowSelectedUser] = useState(null);

        const handleUserChange = (e) => {
            const userId = e.target.value;
            const user = members.find((member) => member.ID === Number(userId)); 
            setSelectedUser(user);
            setshowSelectedUser(e.target.value)
        }
    
        const handleAddUser = () => {
            if (selectedUser && !assignedUsers.find(user => Number(user.ID) === Number(selectedUser.ID))) {
                setAssignedUsers(prevUsers => [...prevUsers, selectedUser]); 
            }
        }
        return (
            <>
            {loadingMembers ? (
                <Center><Spinner/></Center>
                ): ( 
                <Flex alignItems="center">
                    <Select
                        value={showSelectedUser}
                        onChange={handleUserChange}
                        placeholder="Select a user"
                        isSearchable
                    >
                        {members.map((member) => (
                            <option key={member.ID} value={member.ID}>{member.name}</option>
                        ))}
                    </Select>
                    <IconButton 
                        ml={3}
                        icon={<AddIcon />} 
                        borderRadius='full'
                        colorScheme="blue" 
                        variant="ghost"
                        size="lg" 
                        onClick={handleAddUser}
                    />
                </Flex>
                
                )
            }
            </>
            
        )
    }
    const DeleteMember = ({userIdx}) => {
        return (
            <>
                <IconButton 
                    ml={3}
                    icon={<CloseIcon />} 
                    borderRadius='full'
                    colorScheme="red" 
                    variant="ghost"
                    size="sm" 
                    onClick={() => setAssignedUsers(prevUsers => [...prevUsers.slice(0, userIdx), ...prevUsers.slice(userIdx + 1)])}
                />
            </>
        )
    }


    const SaveTaskChanges = () => {  
        const updatedTask = {
            group_task_id: input.groupTaskId,
            status: status,
            title: title,
            deadline: selectedDate,
            assigned_users: assignedUsers,
            desc: desc
        };
        setTask((previousData) => ({ ...previousData, ...updatedTask }));
        submitData(updatedTask);
        setStateFunc(null);
        onClose();
    }

    const submitData = (taskData) => {
        fetch(`${baseUrl}/tasks`,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify(taskData),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Task created successfully:', data);
        })
        .catch(error => {
            alert('There was a problem with the fetch operation:', error);
        });
    }

    return (
      <Modal isOpen={isOpen} onClose={() => {
        setStateFunc(null)
        onClose()
        }} closeOnOverlayClick={false}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
          <Text><strong>Title</strong></Text>

            <Flex justifyContent="flex-start" gap={3} w="fit-content">
                <Input 
                    name="title"
                    type="text"
                    placeholder="Input title here"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}                
                /> 
            </Flex>
          </ModalHeader>
          <ModalBody>
                <Flex
                    direction={"column"}
                    gap={3}
                >
                    <Box>
                        <Text><strong>Description</strong></Text>
                        <Textarea 
                            h={200} 
                            value={desc}
                            onChange={(e) => setDesc(e.target.value)} />
                    </Box>
                    <Text><strong>Status:</strong> <StatusButton/></Text>
                    <Box>
                        <Text><strong>Deadline:</strong></Text>
                        <Box borderColor="grey">
                            <DatePicker 
                                placeholderText="select a date"
                                selected={selectedDate} 
                                onChange={(date) => date < new Date() ? alert("Please choose a date after today") : setSelectedDate(date)}
                                dateFormat="dd/MM/yyyy" 
                                showYearDropdown 
                                showMonthDropdown    
                                m={100}                                                    
                            />
                        </Box>

                    </Box>
                    <Box>
                        <Text><strong>Assigned member:</strong></Text>
                        <Flex mb={5}>
                            <AddMember/>
                        </Flex>
                        <Flex gap={2} wrap="wrap" alignItems="flex-start">
                            <ListMembers /> {/* Pass assigned_users sebagai prop */}
                        </Flex>
                                

                    </Box>
                </Flex>
            </ModalBody>
          <ModalFooter>
            <Button colorScheme="red" mr={3} onClick={() => {
                setStateFunc(null)
                onClose()
                }}>
              Close
            </Button>
            <Button 
                onClick={SaveTaskChanges}
                colorScheme="blue">
                Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  };

export default CreateTask