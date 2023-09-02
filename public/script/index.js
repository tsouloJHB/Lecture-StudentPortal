import io from 'socket.io-client'
const socket = io("http://localhost:8080");

const button = document.getElementById('myButton');


const chatElement = document.getElementById('chat');
const user = JSON.parse(chatElement.getAttribute('data-user'));

let localActiveUsers = []
// Add a click event listener
socket.emit("new-user-add",user);
button.addEventListener('click', function() {
    // Your code to run when the button is clicked
    alert(user._id);

    // Create an array of receiver IDs from localActiveUsers
    const receiverIds = localActiveUsers.map(activeUser => activeUser.userId);

    // Broadcast message data
    const data = {
        receiverIds: receiverIds,
        data: "New message"
    };
   socket.emit("broadcast message",data);
    
});
socket.on("get-users", activeUsers => {
    // Filter out user.id from activeUsers and save the result in localActiveUsers
    localActiveUsers = activeUsers.filter(activeUser => activeUser.userId !== user._id);

    // Now, localActiveUsers contains active users without the current user
    console.log(localActiveUsers);
});

socket.on("receive-message",message =>{
    console.log(message);
});
socket.on("remove-user", userToRemove => {
    // Filter localActiveUsers to exclude the user with a matching socketId
    localActiveUsers = localActiveUsers.filter(user => user.socketId !== userToRemove);
    console.log(localActiveUsers);
});