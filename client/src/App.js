import logo from './logo.svg';
import './App.css';
import { createUser, readUser, readUsers, updateUser, deleteUser } from './firebaseOperations.js'
import { useEffect, useRef, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {

  const [operation, setOperation] = useState({
    create: false,
    update: false
  })
  const [users, setUsers] = useState([]);
  const [updatedUserID, setUpdatedUserID] = useState(undefined);

  const newUser = useRef('');
  const updatedUser = useRef('');

  useEffect(() => {
    handleReadUsers();
  }, [])

  // useEffect(() => {
  //   console.log(users);
  // }, [users]);

  const toggleOperation = (operationMode) => {
    console.log("Toggle called on: ", operation)
    switch (operationMode) {
      case 'create':
        if (!operation.create) {
          newUser.current = '';
        }
        // setOperation({ ...operation, create: !operation.create });
        setOperation({ update: false, create: !operation.create });
        break;

      case 'update':
        if (!operation.update) {
          newUser.current = '';
        }
        // setOperation({ ...operation, update: !operation.update });
        setOperation({ create: false, update: !operation.update });
        break;

      default:
        setOperation({
          update: !operation.update, create: !operation.create
        });

    }
  }

  const handleReadUsers = () => {
    readUsers(setUsers);
  }

  const handleCreateUser = () => {
    try {
      toggleOperation('create');
      console.log(newUser.current.value)
      const user = JSON.parse(`${newUser.current.value}`);
      createUser({ user });
      handleReadUsers();
      toast("Created user!")
      toggleOperation('create');
    }
    catch (err) {
      toast("Error!");
      console.log(err)
    }
  }

  const handleDeleteUser = (userId) => {
    if (!userId) {
      toast("Error! Please select a valid user.");
      return;
    }
    deleteUser({ userId });
    toast("Deleted user!");
    handleReadUsers();
  }

  const handleRestorePreviousUserInfo = (e) => {
    e.preventDefault();
    if (!updatedUserID) {
      toast("Error! Please select a user to be updated.")
      return;
    }
    const selectedUser = users.filter(user => user.id === updatedUserID)[0];
    delete selectedUser.id;
    updatedUser.current.value = JSON.stringify(selectedUser);
  }

  const handleUpdateUser = (user) => {
    // updateUser({ userId, user });
    try {
      console.log("Updated user is: ", updatedUser)
      updateUser({ userId: updatedUserID, user: JSON.parse(updatedUser.current.value) });
      toggleOperation('update');
      handleReadUsers();
      toast("User updated!")
    }
    catch (err) {
      toast("Error!");
      console.log(err)
    }
  }

  const getRecursiveSummary = (key, value) => {
    if (typeof value === 'object') {
      return (
        <details>
          <summary>{key}</summary>
          {
            Object.keys(value).map(subKey =>
              getRecursiveSummary(subKey, value[subKey]))
          }
        </details>
      )
    }

    else {
      return <div>{key}: {value}</div>
    }
  }

  return (
    <div className="App">
      {(operation.create || operation.update) &&
        <div>
          {operation.create && <input type="text" ref={newUser} placeholder="Enter stringified user data." />}
          {operation.update && <input type="text" ref={updatedUser} placeholder="Enter stringified user data." />}
          <button onClick={(e) => {
            if (operation.create) {
              toggleOperation('create');
            }
            if (operation.update) {
              toggleOperation('update');
              setUpdatedUserID(undefined);
            }
          }}>Cancel</button>
          {operation.create && <button onClick={handleCreateUser}>Add</button>}
          {operation.update &&
            <>
              <button onClick={handleRestorePreviousUserInfo}>Restore user info</button>
              <button onClick={handleUpdateUser}>Update</button>
            </>
          }
        </div>
      }
      <button onClick={(e) => toggleOperation('create')}>
        Create user
      </button>
      <button onClick={handleReadUsers}>
        Read all users
      </button>
      <ul>
        {users.length > 0 && users.map(user => {
          return (
            <li>
              {Object.keys(user).map(key => {
                if (typeof user[key] === 'object') {
                  return getRecursiveSummary(key, user[key]);
                }
                else {
                  return <div>{key} : {user[key]}</div>
                }
              })}
              <button onClick={(e) => {
                toggleOperation('update')
                setUpdatedUserID(user.id)
              }}>Update user</button>
              <button onClick={(e) => {
                handleDeleteUser(user.id)
              }}>Delete user</button>
            </li>
          )
        })}
      </ul>
      <ToastContainer />
    </div>
  );
}

export default App;
