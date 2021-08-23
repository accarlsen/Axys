import { gql, useQuery, useMutation } from '@apollo/client';

const getProjects = gql`
  query{ 
    projects {
      id
      name
      time
      winnerId
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
  getProjects,
  getTasks,
  getSubTasks,
  addTask,
  addMutationTest,
  taskDone,
  deleteTask,
  addPerson,
  addProject,
  login
};