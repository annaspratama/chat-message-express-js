const chatForm = document.getElementById("chat-form");
const chatMessages = document.querySelector(".chat-messages");

const socket = io()

// message from server
socket.on("message", message => {
    console.info(message);
    writeMessage(message);

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
    var msg = e.target.elements.msg.value;

    // emit msg to server
    socket.emit("chatMsg", msg);

    // clear input message
    e.target.elements.msg.value = "";
    e.target.elements.msg.focus();
});

// write message to DOM
function writeMessage(message) {
    const div = document.createElement("div");
    div.classList.add("message");
    div.innerHTML = `<p class="meta">Brad <span>9:12pm</span></p>
                    <p class="text">
                        ${message}
                    </p>`;
    document.querySelector(".chat-messages").append(div);
}