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
      // Nhan duoc id cua B, them id cua B vao requestFriend cua A
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
    });
    //End Hủy yêu cầu
  });
  //End SocketIO
};
