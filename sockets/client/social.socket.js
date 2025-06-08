const User = require("../../models/user.model");

module.exports = (res) => {
  //SocketIO
  _io.once("connection", (socket) => {
    //Gửi yêu cầu
    socket.on("CLIENT_ADD_FRIEND", async (userId) => {
      const myUserId = res.locals.user.id;
      //   console.log(myUserId); //Id cua A
      //   console.log(userId); // Id cua B

      // Nhan duoc id cua A, them id cuar A vao acceptFiends cuar B
      const existIdAinB = await User.findOne({
        _id: userId,
        acceptFriends: myUserId,
      });
      if (!existIdAinB) {
        await User.updateOne(
          {
            _id: userId,
          },
          {
            $push: { acceptFriends: myUserId },
          }
        );
      }
      // Nhan duoc id cua B, them id cua B vao requestFriend cua A
      const existIdBinA = await User.findOne({
        _id: myUserId,
        requestFriends: userId,
      });
      if (!existIdBinA) {
        await User.updateOne(
          {
            _id: myUserId,
          },
          {
            $push: { requestFriends: userId },
          }
        );
      }
      //Lấy ra độ dài của acceptFriend của B và trả về B
      const infoUserB = await User.findOne({
        _id: userId,
      });
      const lengthAcceptFriends = infoUserB.acceptFriends.length;
      socket.broadcast.emit("SEVER_RETURN_LENGTH_ACCEPT_FRIEND", {
        userId: userId,
        lengthAcceptFriends: lengthAcceptFriends,
      });
      //Lấy info cua A tra ve cho B
      const infoUserA = await User.findOne({
        _id: myUserId,
      }).select("id avatar fullName");
      socket.broadcast.emit("SEVER_RETURN_INFO_ACCEPT_FRIEND", {
        userId: userId,
        infoUserA: infoUserA,
      });
    });
    //End gửi yêu cầu

    //Hủy yêu cầu
    socket.on("CLIENT_CANCEL_FRIEND", async (userId) => {
      const myUserId = res.locals.user.id;
      //   console.log(myUserId); //Id cua A
      //   console.log(userId); // Id cua B

      // Nhan duoc id cua A, Xóa id cuar A vao acceptFiends cuar B
      const existIdAinB = await User.findOne({
        _id: userId,
        acceptFriends: myUserId,
      });
      if (existIdAinB) {
        await User.updateOne(
          {
            _id: userId,
          },
          {
            //Xóa đi
            $pull: { acceptFriends: myUserId },
          }
        );
      }
      // Nhan duoc id cua B, xóa id cua B vao requestFriend cua A
      const existIdBinA = await User.findOne({
        _id: myUserId,
        requestFriends: userId,
      });
      if (existIdBinA) {
        await User.updateOne(
          {
            _id: myUserId,
          },
          {
            $pull: { requestFriends: userId },
          }
        );
      }
      //Lấy ra độ dài của acceptFriend của B và trả về B
      const infoUserB = await User.findOne({
        _id: userId,
      });
      const lengthAcceptFriends = infoUserB.acceptFriends.length;
      socket.broadcast.emit("SEVER_RETURN_LENGTH_ACCEPT_FRIEND", {
        userId: userId,
        lengthAcceptFriends: lengthAcceptFriends,
      });
      //Lấy id của A tra về B
      socket.broadcast.emit("SEVER_RETURN_USER_ID_CANCEL_FRIEND", {
        userIdB: userId,
        userIdA: myUserId,
      });
    });
    //End Hủy yêu cầu

    //Từ chối yêu cầu
    socket.on("CLIENT_REFUSE_FRIEND", async (userId) => {
      const myUserId = res.locals.user.id;
      //   console.log(myUserId); //Id cua A
      //   console.log(userId); // Id cua B

      //Xóa id cuar A vao acceptFiends cuar B
      const existIdAinB = await User.findOne({
        _id: myUserId,
        acceptFriends: userId,
      });
      if (existIdAinB) {
        await User.updateOne(
          {
            _id: myUserId,
          },
          {
            //Xóa đi
            $pull: { acceptFriends: userId },
          }
        );
      }
      // Nhan duoc id cua B, xóa id cua B vao requestFriend cua A
      const existIdBinA = await User.findOne({
        _id: userId,
        requestFriends: myUserId,
      });
      if (existIdBinA) {
        await User.updateOne(
          {
            _id: userId,
          },
          {
            $pull: { requestFriends: myUserId },
          }
        );
      }
    });
    //End Từ chối yêu cầu

    //Chức năng chấp nhận kết bạn
    socket.on("CLIENT_ACCEPT_FRIEND", async (userId) => {
      const myUserId = res.locals.user.id;
      //   console.log(myUserId); //Id cua B
      //   console.log(userId); // Id cua A

      // Thêm{user_id, room_chat_id} của A vào friendsList của B
      // Xóa id của A trong acceptFriends của B
      const existIdAinB = await User.findOne({
        _id: myUserId,
        acceptFriends: userId,
      });
      if (existIdAinB) {
        await User.updateOne(
          {
            _id: myUserId,
          },
          {
            $push: {
              friendList: {
                user_id: userId,
                room_chat_id: "",
              },
            },
            //Xóa đi
            $pull: { acceptFriends: userId },
          }
        );
      }
      // Thêm{user_id, room_chat_id} của B vào friendsList của A
      // Nhan duoc id cua B, xóa id cua B vao requestFriend cua A
      const existIdBinA = await User.findOne({
        _id: userId,
        requestFriends: myUserId,
      });
      if (existIdBinA) {
        await User.updateOne(
          {
            _id: userId,
          },
          {
            $push: {
              friendList: {
                user_id: myUserId,
                room_chat_id: "",
              },
            },
            $pull: { requestFriends: myUserId },
          }
        );
      }
    });
    //End Chức năng chấp nhận kết bạn
  });
  //End SocketIO
};
