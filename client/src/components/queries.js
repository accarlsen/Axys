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
  query {
    tasks {
      id
      name
      progress
      weight
      date
      time
      authorId
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
    query {
        task {
            id
            name
            weight
            progress
            done
            authorId
            parentId
            subtasks{
                id
                name
                time
                weight
                progress
                done
                authorId
            }
        }
    }
`;

const addTask = gql`
  mutation AddTask(
    $name: String,
    $assigneeId: String,
    $parentId: String,
  ){
    addTask(
      name: $name,
      assigneeId: $assigneeId,
      parentId: $parentId,
    ){
      id
      name
      progress
      weight
      parentId
      assigneeId
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
  sendFriendRequest,
  answerFriendRequest,
  taskDone,
  deleteTask,
  addPerson,
  addProject,
  login
};