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
    displayMessage(message,false);
});



socket.on("remove-user", userToRemove => {
    // Filter localActiveUsers to exclude the user with a matching socketId
    localActiveUsers = localActiveUsers.filter(user => user.socketId !== userToRemove);
    console.log(localActiveUsers);
});

 async function socketSendMessage(message){
    
    // Create an array of receiver IDs from localActiveUsers
    const receiverIds = localActiveUsers.map(activeUser => activeUser.userId);

    // Broadcast message data
    const data = {
        receiverIds: receiverIds,
        data: message
    };
   socket.emit("broadcast message",data);
    
}

function formatTime(timestamp) {
    const date = new Date(timestamp);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    return `${hours}:${minutes}`;
}

function displayMessage(message,sender){
    // Get the current time
    const currentTime = new Date();

    // Format the current time as a string (e.g., "HH:mm")
    const formattedTime = `${currentTime.getHours()}:${currentTime.getMinutes()}`;

    // Create a new <li> element for the received message with the formatted time
    const messageListItem = document.createElement("li");

    // Check if the message is from the current user or sender
   
    if (sender) {
        messageListItem.classList.add("repaly");
    } else {
        messageListItem.classList.add("sender");
    }
  

    // Set the message content and formatted time
    messageListItem.innerHTML = `
        <p>${message}</p>
        <span class="time">${formattedTime}</span>
    `;

    // Append the message element to the message list
    const messageList = document.querySelector(".msg-body ul");
    messageList.appendChild(messageListItem);

    // Optionally, scroll to the bottom of the message list to show the latest message
    messageList.scrollTop = messageList.scrollHeight;
}


// const messageButton = document.getElementById('sendButton');
// messageButton.addEventListener('click', async function() {
//       var messageText = $("#messageInput").val();
//     await socketSendMessage(messageText);
// });

window.displayMessage = displayMessage;
window.socketSendMessage = socketSendMessage;