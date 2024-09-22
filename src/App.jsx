import { Route, Routes, useNavigate } from "react-router-dom";
import NotFound from './routes/NotFound';
import Home from "./layout/Home";
import GroupTask from "./routes/GroupTask";
import CreateTask from "./routes/CreateTask";
import TaskDetail from "./routes/TaskDetail";
import Register from "./routes/Register";
import SignIn from "./routes/Signin";
import ListOrganizations from "./routes/ListOrganizations";
import ProtectedRoute from "./routes/ProtectedRoute";
import CreateGroupTask from "./routes/CreateGroupTask";

function App() {
  const navigate = useNavigate();

  // Function to close the modal
  const closeModal = () => navigate(-1);
  return (
    <>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/signin" element={<SignIn />} />
        <Route element={<Home />}>
          <Route path="organizations" element={<ProtectedRoute element={<ListOrganizations />}  />}>
            <Route path=":orgId" element={<ProtectedRoute element={<GroupTask />}/>}/>
            <Route path=":orgId/create" element={<ProtectedRoute element={<CreateGroupTask />}/>}/>

          </Route>
          {/* <Route path="organizations/:orgId" element={<ProtectedRoute element={<GroupTask />}/>}/> */}

            {}
              {/* <Route path="create" element={<CreateGroupTask/>}/>
              <Route path="update" element={<UpdateGroupTask/>}/>
              <Route path="delete" element={<DeleteGroupTask/>}/> */}
              {/* <Route path="tasks" element={}>
              <Route path= */}
            {/*  create, update, delete, list group task */}
            {/*  create, update delete, list, get task */}
        </Route>


          {/* <Route index path="/organizations/:orgId" element={<ProtectedRoute element={<GroupTask />} />} />
          <Route path="/organizations/:orgId" element={<ProtectedRoute element={<GroupTask />} />} /> */}
          {/* <Route path="api/tasks/create" element={<CreateTask/>}/>
          <Route path="api/tasks/:groupTaskId/:taskId" element={<TaskDetail/>}/> */}
          {/* <Route path="api/tasks/:id/assign" element={<AssignUser/>}/> */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  )
}

export default App
