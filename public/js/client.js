const chatForm = document.getElementById("chat-form");
const chatMessages = document.querySelector(".chat-messages");
const groupName = document.getElementById('group-name');
const usersList = document.getElementById("users");
const msgInput = document.getElementById("msg");
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
    clearFeedback();
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

// add typing message on input focus
msgInput.addEventListener("focus", e => {
    socket.emit("feedback", {
        feedback: `${username} is typing a message...`
    });
});

// add typing message on input focus out
msgInput.addEventListener("focusout", e => {
    socket.emit("feedback-disappear", {
        feedback_disappear: true
    });
});

// add typing message on input keypress
msgInput.addEventListener("keypress", e => {
    socket.emit("feedback", {
        feedback: `${username} is typing a message...`
    });
});

// listen feedback from server
socket.on("feedback", (data) => {
    clearFeedback();
    const element = `
        <div class="message-feedback">
            <p class="feedback" id="feedback">${data.feedback}</p>
        </div>`
    chatMessages.innerHTML += element
});

// listen feedback disappear from server
socket.on("feedback-disappear", (data) => {
    if (data.feedback_disappear) clearFeedback();
});

function clearFeedback(){
    document.querySelectorAll(".message-feedback").forEach(el => {
        el.parentNode.removeChild(el);
    });
}