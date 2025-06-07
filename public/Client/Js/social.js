// console.log("social");

// Chức năng gửi yêu cầu
const listBtnAddFriend = document.querySelectorAll("[btn-add-friend]");
if (listBtnAddFriend.length > 0) {
  listBtnAddFriend.forEach((button) => {
    button.addEventListener("click", () => {
      //   console.log(button.closest(".box-user"));
      button.closest(".box-user").classList.add("add");
      const userId = button.getAttribute("btn-add-friend");
      //   console.log(userId);
      socket.emit("CLIENT_ADD_FRIEND", userId);
    });
  });
}
// End Gửi yêu cầu
// Chức năng hủy yêu cầu
const listBtnCancelFriend = document.querySelectorAll("[btn-cancel-friend]");
if (listBtnCancelFriend.length > 0) {
  listBtnCancelFriend.forEach((button) => {
    button.addEventListener("click", () => {
      //   console.log(button.closest(".box-user"));
      button.closest(".box-user").classList.remove("add");
      const userId = button.getAttribute("btn-cancel-friend");
      //   console.log(userId);
      socket.emit("CLIENT_CANCEL_FRIEND", userId);
    });
  });
}
// End hủy yêu cầu
