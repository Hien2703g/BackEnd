import * as Popper from "https://cdn.jsdelivr.net/npm/@popperjs/core@^2/dist/esm/index.js";
//CLIENT_SEND_MESSAGE
const formSendData = document.querySelector(".chat .inner-form");
if (formSendData) {
  //   console.log(formSenData);
  formSendData.addEventListener("submit", (e) => {
    e.preventDefault(); //Ngăn load lại trang
    // console.log(e);
    const content = e.target.elements.content.value;
    // console.log(content);
    if (content) {
      socket.emit("CLIENT_SEND_MESSAGE", content);
      e.target.elements.content.value = "";
    }
  });
}
//END CLIENT_SEND_MESSAGE

//SERVER_RETURN_MESSAGE
socket.on("SERVER_RETURN_MESSAGE", (data) => {
  const myId = document.querySelector("[my-id]").getAttribute("my-id");
  const body = document.querySelector(".chat .inner-body");
  // console.log(data);

  const div = document.createElement("div");
  let htmlFullName = "";

  if (myId == data.userId) {
    div.classList.add("inner-outgoing");
  } else {
    htmlFullName = `<div class="inner-name">${data.fullName}</div>`;
    div.classList.add("inner-incoming");
  }

  div.innerHTML = `
    ${htmlFullName}
    <div class="inner-content">${data.content}</div>
  `;
  body.appendChild(div);
  bodyChat.scrollTop = bodyChat.scrollHeight;
});
//END SERVER_RETURN_MESSAGE

//Scroll Chat To Bottom
const bodyChat = document.querySelector(".chat .inner-body");
if (bodyChat) {
  bodyChat.scrollTop = bodyChat.scrollHeight;
}
// End Scroll Chat To Bottom

// Show icon Chat
//Show Popup
const buttonIcon = document.querySelector(".button-icon");
if (buttonIcon) {
  const tooltip = document.querySelector(".tooltip");
  Popper.createPopper(buttonIcon, tooltip);

  buttonIcon.onclick = () => {
    tooltip.classList.toggle("shown");
  };
}
//End Show Popup
// Insert Icon to Input
const emojiPicker = document.querySelector("emoji-picker");
if (emojiPicker) {
  const inputChat = document.querySelector(
    ".chat .inner-form input[name='content'] "
  );
  emojiPicker.addEventListener("emoji-click", (e) => {
    // console.log(e.detail.unicode);
    const icon = e.detail.unicode;
    inputChat.value = inputChat.value + icon;
  });
}
//End  Insert Icon to Input

// End Show icon Chat
