import { gql, useQuery, useMutation } from '@apollo/client';

const getPerson = gql`
  query($id: ID!){ 
    person(id: $id) {
      id
      fname
      lname
      email
    }
  }
`;

const getProjects = gql`
  query{ 
    projects {
      id
      name
      time
    }
  }
`;

const getTasks = gql`
  query($authorId: ID) {
    tasks(authorId: $authorId) {
      id
      name
      progress
      weight
      parentId
    }
  }
`;

const getFriendRequests = gql`
  query {
    friendRequests {
      id
      senderId
      recieverId
      answer
      sender{
        fname
        lname
        email 
      }
    }
  }
`;

const getSubTasks = gql`
    query($authorId: ID) {
        task(id: $authorId) {
            id
            name
            weight
            progress
            done
            parentId
            subtasks{
                id
                name
                time
                weight
                progress
                done
            }
        }
    }
`;

const addMutationTest = gql`
  mutation AddMutationTest($name: String!, $done: Boolean){
      addMutationTest(name: $name, done: $done){
        id  
        name
        done
      }
  }
`;

const addTask = gql`
  mutation AddTask(
    $name: String,
    $authorId: String,
    $parentId: String,
  ){
    addTask(
      name: $name,
      authorId: $authorId,
      parentId: $parentId,
    ){
      id
      name
      progress
      weight
      parentId
    }
  }
`;

const addProject = gql`
  mutation AddProject(
    $name: String,
    $time: String,
    $authorId: String
  ){
    addProject(
      name: $name,
      time: $time,
      authorId: $authorId
    ){
      id
    }
  }
`;

const sendFriendRequest = gql`
  mutation SendFriendRequest(
    $email: String
  ){
    sendFriendRequest(
      email: $email
    ){
      id
    }
  }
`;

const answerFriendRequest = gql`
  mutation AnswerFriendRequest($id: String, $answer: Boolean, $senderId: String){
    answerFriendRequest(id: $id, answer: $answer, senderId: $senderId){
      id
    }
  }
`

const taskDone = gql`
  mutation TaskDone($id: ID, $done: Boolean){
    taskDone(id: $id, done: $done){
      id
    }
  }
`;

const deleteTask = gql`
  mutation DeleteTask($id: ID){
    deleteTask(id: $id){
      id
    }
  }
`;


const addPerson = gql`
  mutation AddPerson($fname: String, $lname: String, $email: String, $password: String){
    addPerson(fname: $fname, lname: $lname, email: $email, password: $password){
      id
    }
  }
`;

const login = gql`
  query Login($email: String, $password: String){
    login(email: $email, password: $password){
      personId
      token
      tokenExpiration
      admin
    }
  }
`;


export {
  getPerson,
  getProjects,
  getTasks,
  getFriendRequests,
  getSubTasks,
  addTask,
  addMutationTest,
  sendFriendRequest,
  answerFriendRequest,
  taskDone,
  deleteTask,
  addPerson,
  addProject,
  login
};