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
