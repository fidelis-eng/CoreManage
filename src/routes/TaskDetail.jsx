import { Box, Button, Center, Flex, IconButton, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Popover, PopoverBody, PopoverContent, PopoverTrigger, Select, Spinner, Text, Textarea, useDisclosure } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import { AddIcon, CloseIcon, DeleteIcon, EditIcon } from "@chakra-ui/icons";

const TaskDetail = ({ isOpen, onClose, setStateFunc, input }) => {
    const baseUrl = process.env.REACT_APP_BACKEND_API_URL;

    const [task, setTask] = useState(0);
    const [title, setTitle] = useState(null);
    const [desc, setDesc] = useState("");
    const [assignedUsers, setAssignedUsers] = useState(null);
    const [status, setStatus] = useState("");
    const [selectedDate, setSelectedDate] = useState(null);
    const [loading, setLoading] = useState(true);
    const [members, setMembers] = useState(null);
    const [loadingMembers, setLoadingMembers] = useState(true);

    useEffect(() => {
        if (input && isOpen) {
            fetch(`${baseUrl}/tasks/${input.taskId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem("token")}`
                }
            })
                .then(response => response.json())
                .then(data => {
                    setTask(data);
                    setTitle(data.title);
                    setDesc(data.desc)
                    setAssignedUsers(data.assigned_users);
                    setSelectedDate(new Date(data.deadline));
                    setStatus(data.status);
                    setLoading(false);
                })
                .catch(error => console.error('Error fetching tasks:', error));
        }
    }, [input, isOpen]);

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

    const StatusButton = () => (
        <Select placeholder={status} value={status} onChange={e => setStatus(e.target.value)}>
            <option value="To Do">To Do</option>
            <option value="In Progress">In Progress</option>
            <option value="Done">Done</option>
        </Select>
    );

    const ListMembers = () => {
        const colors = ["green.500", "blue.500", "yellow.500"];
        return (
            <>
                {assignedUsers && assignedUsers.map((user, index) => (
                    <Flex key={user.id} bg={colors[index % colors.length]} borderRadius="full" pl={2} alignItems="center" justifyContent="space-between">
                        <Text color="white" fontSize='md'>{user.name}</Text>
                        <DeleteMember userIdx={index} />
                    </Flex>
                ))}
            </>
        );
    };

    const AddMember = () => {
        const [selectedUser, setSelectedUser] = useState(null);
        const [showSelectedUser, setShowSelectedUser] = useState(null);
        const handleUserChange = (e) => {
            const userId = e.target.value;
            const user = members.find(member => member.ID === Number(userId));
            setSelectedUser(user);
            setShowSelectedUser(e.target.value);
        };

        const handleAddUser = () => {
            if (selectedUser && !assignedUsers.find(user => Number(user.ID) === Number(selectedUser.ID))) {
                setAssignedUsers(prevUsers => [...prevUsers, selectedUser]);
            }
        };

        return (
            <>
                {loadingMembers ? (
                    <Center><Spinner /></Center>
                ) : (
                    <Flex alignItems="center">
                        <Select value={showSelectedUser} onChange={handleUserChange} placeholder="Select a user" isSearchable>
                            {members.map(member => (
                                <option key={member.name} value={member.ID}>{member.name}</option>
                            ))}
                        </Select>
                        <IconButton ml={3} icon={<AddIcon />} borderRadius='full' colorScheme="blue" variant="ghost" size="lg" onClick={handleAddUser} />
                    </Flex>
                )}
            </>
        );
    };

    const DeleteMember = ({ userIdx }) => (
        <IconButton
            ml={3}
            icon={<CloseIcon />}
            borderRadius='full'
            colorScheme="red"
            variant="ghost"
            size="sm"
            onClick={() => setAssignedUsers(prevUsers => [...prevUsers.slice(0, userIdx), ...prevUsers.slice(userIdx + 1)])}
        />
    );

    const EditTitle = () => {
        const [currentTitle, setCurrentTitle] = useState(title);

        const handleUpdateTitleTask = () => {
            setTitle(currentTitle);
            setTask(prevData => ({ ...prevData, title: currentTitle }));
        };

        return (
            <Popover placement="right">
                <PopoverTrigger>
                    <Button size="sm" variant="ghost" p={0} borderRadius="full">
                        <EditIcon color={"blue"} />
                    </Button>
                </PopoverTrigger>
                <PopoverContent>
                    <PopoverBody>
                        <Text fontSize="lg">Title</Text>
                        <Input type="text" name="title" value={currentTitle} onChange={e => setCurrentTitle(e.target.value)} />
                        <Button mt={4} colorScheme="teal" onClick={handleUpdateTitleTask}>Update</Button>
                    </PopoverBody>
                </PopoverContent>
            </Popover>
        );
    };

    const DeleteTask = (id) => {
        const { isOpen, onOpen, onClose } = useDisclosure();
        return (
            <>
                <Button onClick={onOpen} size="sm" variant="ghost" borderRadius="full" style={{ marginRight: 'auto' }}>
                    <DeleteIcon color={"red"} />
                </Button>
                <Modal isOpen={isOpen} onClose={onClose}>
                    <ModalOverlay />
                    <ModalContent>
                        <ModalCloseButton />
                        <ModalBody pb={6}>
                            <Text>Are you sure you want to delete this task?</Text>
                        </ModalBody>
                        <ModalFooter>
                            <Button colorScheme='blue' mr={3} onClick={onClose}>Close</Button>
                            {DeleteTaskForm(id)}
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            </>
        );
    };

    const DeleteTaskForm = (id) => {
        const api = `${baseUrl}/tasks/${id}`;
        return (
            <form onSubmit={e => HandleDeleteSubmit(e, api)} style={{ display: 'flex', justifyContent: 'center' }}>
                <Button type="submit" colorScheme="red">Delete</Button>
            </form>
        );
    };

    const HandleDeleteSubmit = async (e, api) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const formDataObj = Object.fromEntries(formData.entries());
        try {
            const response = await fetch(api, {
                method: 'DELETE',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify(formDataObj),
            });
            if (response.status === 200) {
                setStateFunc(null);
                onClose();
            } else {
                alert("there's something wrong");
            }
        } catch (error) {
            console.error('Terjadi kesalahan:', error);
        }
    };

    const SaveTaskChanges = () => {
        setTask(prevData => {
            const updatedTask = {
                ...prevData,
                status,
                title,
                deadline: selectedDate,
                assigned_users: assignedUsers,
                desc: desc 
            };
            console.log(updatedTask)
            submitData(updatedTask);
            setAssignedUsers(null)
            setStateFunc(null);
            onClose();
        });
    };

    const submitData = (taskData) => {
        fetch(`${baseUrl}/tasks/${taskData.ID}`, {
            method: 'PUT',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem("token")}`
             },
            body: JSON.stringify(taskData),
        })
            .then(response => {
                if (!response.ok) throw new Error('Network response was not ok');
                return response.json();
            })
            .then(data => console.log('Task updated successfully:', data))
            .catch(error => console.error('There was a problem with the fetch operation:', error));
    };

    return (
        <Modal isOpen={isOpen} onClose={() => { setStateFunc(null); onClose(); }} closeOnOverlayClick={false}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>
                    <Flex justifyContent="flex-start" gap={3}>
                        {title}
                        <EditTitle />
                    </Flex>
                    {selectedDate < new Date() ? 
                        (
                            <Box color="red.500">
                                <Text fontWeight="bold">Overdue</Text>
                            </Box>
                        ): null}
                </ModalHeader>
                <ModalBody>
                    {loading ? (
                        <Center><Spinner /></Center>
                    ) : (
                        <Flex key={task.ID} direction={"column"} gap={3}>
                            <Box>
                                <Text><strong>Description</strong></Text>
                                <Textarea h={200} placeholder={desc} value={desc}  onChange={e => setDesc(e.target.value)} />
                            </Box>
                            <Text><strong>Status:</strong> <StatusButton /></Text>
                            <Box>
                                <Text><strong>Deadline:</strong></Text>
                                <DatePicker
                                    selected={selectedDate}
                                    onChange={date => date < new Date() ? alert("Please choose a date after today") : setSelectedDate(date)}
                                    dateFormat="dd/MM/yyyy"
                                    showYearDropdown
                                    showMonthDropdown
                                />
                            </Box>
                            <Box>
                                <Text><strong>Assigned member:</strong></Text>
                                <Flex mb={5}><AddMember /></Flex>
                                <Flex gap={2} wrap="wrap" alignItems="flex-start"><ListMembers /></Flex>
                            </Box>
                        </Flex>
                    )}
                </ModalBody>
                <ModalFooter>
                    {DeleteTask(task.ID)}
                    <Button colorScheme="red" mr={3} onClick={() => { setStateFunc(null); onClose(); }}>Close</Button>
                    <Button onClick={SaveTaskChanges} colorScheme="blue">Save</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default TaskDetail;