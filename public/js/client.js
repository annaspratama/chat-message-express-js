const chatForm = document.getElementById("chat-form");
const chatMessages = document.querySelector(".chat-messages");
const groupName = document.getElementById('group-name');
const usersList = document.getElementById("users");
const messageTone = new Audio("/message-tone.mp3");

// get username and group from the url
const { username, group } = Qs.parse(location.search, {ignoreQueryPrefix: true});

const socket = io()

// join group
socket.emit("join-group", { username, group });

// get group and users
socket.on("group-users", ({group, users}) => {
    setGroupName(group);
    setUsers(users);
});

// message from server
socket.on("message", obj => {
    messageTone.play();

    // set owner message
    let isOwnMessage = obj.username == username ? true : false;
    writeMessage(isOwnMessage, obj);

    // scroll down
    chatMessages.scrollTop = chatMessages.scrollHeight;
});

socket.on("disconnect", message => {
    console.info(message);
});

// message submit
chatForm.addEventListener("submit", (e) => {
    e.preventDefault();

    // get message text
    var obj = {
        isOwnMsg: true,
        message: e.target.elements.msg.value
    }

    // emit msg to server
    socket.emit("chat-message", obj);

    // clear input message
    e.target.elements.msg.value = "";
    e.target.elements.msg.focus();
});

// write message to DOM
function writeMessage(isOwnMessage=false, obj) {
    const div = document.createElement("div");
    let divclass = isOwnMessage === true ? "message" : "message-reply";
    div.classList.add(divclass);
    div.innerHTML = `<p class="meta">${obj.username} <span>● ${obj.time}</span></p>
                    <p class="text">
                        ${obj.text}
                    </p>`;
    document.querySelector(".chat-messages").append(div);
}

function setGroupName(group) {
    groupName.innerText = group;
}

function setUsers(users) {
    usersList.innerHTML = "";

    users.forEach((user) => {
      const li = document.createElement("li");
      if (user.username == username) li.classList.add("text-warning");
      li.innerText = user.username;
      usersList.appendChild(li);
    });
  }