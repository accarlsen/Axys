import { gql } from '@apollo/client';

const getProfile = gql`
  query ($id: ID){ 
    profile(id: $id) {
      id
      fname
      lname
      name
      email
      friends{
        id
        fname
        lname
        name
        email
      }
    }
  }
`;

const getProjects = gql`
  query{ 
    projects {
      id
      name
    }
  }
`;

const getProject = gql`
  query ($id: ID) {
    project(id: $id) {
      id
        name
        description
        createdTimeStamp
        creatorId
        adminIds
        
        simplifiedTasks
        inviteRequired
        inviteAdminExclusive

        members{
          id
          name
          email
        }
    }
  }
`

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
      assigneeId
      parentId
      accepted
      ignored
      plannedDate
      assignee{
        id
        fname
        lname
        name
      }
      author{
        id
        name
      }
      comments{
        id
      }
    }
  }
`;

const getProgress = gql`
  query{ 
    progress {
      amntDone
      amntPlanned
    }
  }
`;

const getComments = gql `
  query ($taskId: ID) {
    comments(taskId: $taskId){
      id
      text 
      authorId
      likes
      author{
        id
        fname
        lname
        name
        email
      }
      likers{
        id
        fname
        lname
        name
      }
    }
  }
`

const getCreatedAssignments = gql`
  query {
    createdAssignments {
      id
      name
      progress
      weight
      date
      time
      authorId
      assigneeId
      parentId
      accepted
      ignored
      assignee{
        id
        fname
        lname
        name
      }
      author{
        id
        name
      }
      comments{
        id
      }
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

const getFriends = gql`
  query {
    friends {
      id
      fname
      lname
    }
  }
`

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

const addComment = gql`
  mutation AddComment(
    $text: String,
    $taskId: String,
  ){
    addComment(
      text: $text,
      taskId: $taskId,
    ){
      id
    }
  }
`;

const addProject = gql`
  mutation AddProject(
    $name: String,
    $description: String,
    $simplifiedTasks: Boolean,
    $inviteRequired: Boolean,
    $inviteAdminExclusive: Boolean,
  ){
    addProject(
      name: $name,
      description: $description,
      simplifiedTasks: $simplifiedTasks,
      inviteRequired: $inviteRequired,
      inviteAdminExclusive: $inviteAdminExclusive,
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

const removeFriend = gql`
  mutation RemoveFriend($friendId: ID){
    removeFriend(friendId: $friendId){
      id
    }
  }
`

const taskDone = gql`
  mutation TaskDone($id: ID, $done: Boolean){
    completeTask(id: $id, done: $done){
      id
    }
  }
`;

const taskAccepted = gql`
  mutation TaskDone($id: ID){
    acceptTask(id: $id){
      id
    }
  }
`;

const taskIgnored = gql`
  mutation TaskDone($id: ID){
    ignoreTask(id: $id){
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

const taskPlanned = gql`
  mutation TaskPlanned($id: [String]){
    planTasks(id: $id){
      id
    }
  }
`;

const commentLiked = gql`
  mutation CommentLiked($id: ID){
    likeComment(id: $id){
      id
    }
  }
`;

const deleteComment = gql`
  mutation DeleteComment($id: ID){
    deleteComment(id: $id){
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

const editProfile = gql`
  mutation EditProfile(
    $curPassword: String, 
    $newFName: String, 
    $newLName: String, 
    $newEmail: String, 
    $newPassword: String
    ){
    editProfile(
      curPassword: $curPassword, 
      newFName: $newFName, 
      newLName: $newLName, 
      newEmail: $newEmail, 
      newPassword: $newPassword
    ){
      fname
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
  getProfile,
  getProjects,
  getProject,
  getTasks,
  getProgress,
  getComments,
  getCreatedAssignments,
  getFriendRequests,
  getFriends,
  getSubTasks,
  addTask,
  addComment,
  sendFriendRequest,
  answerFriendRequest,
  removeFriend,
  taskDone,
  taskAccepted,
  taskIgnored,
  deleteTask,
  taskPlanned,
  commentLiked,
  deleteComment,
  addPerson,
  editProfile,
  addProject,
  login
};