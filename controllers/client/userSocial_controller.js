const User = require("../../models/user.model");

const socialSocket = require("../../sockets/client/social.socket");

// [GET]/userSocial/not-friend
module.exports.notFriend = async (req, res) => {
  //Socket IO
  socialSocket(res);
  // End Socket IO
  const userId = res.locals.user.id;
  const myUser = await User.findOne({
    _id: userId,
  });
  const requestFriends = myUser.requestFriends;
  const acceptFiends = myUser.acceptFriends;
  const users = await User.find({
    // _id: { $ne: userId },
    // _id: { $nin: requestFriends },
    $and: [
      {
        _id: { $ne: userId },
      },
      {
        _id: { $nin: requestFriends },
      },
      {
        _id: { $nin: acceptFiends },
      },
    ],
    status: "active",
    deleted: false,
  }).select("id avatar fullName");
  // console.log(users);
  res.render("client/pages/userSocial/not-friend", {
    pageTitle: "Danh sách người dùng",
    users: users,
  });
};
//[GET]/userSocial/request
module.exports.request = async (req, res) => {
  //Socket IO
  socialSocket(res);
  // End Socket IO
  const userId = res.locals.user.id;
  const myUser = await User.findOne({
    _id: userId,
  });
  const requestFriends = myUser.requestFriends;
  // const acceptFiends = myUser.acceptFriends;
  const users = await User.find({
    // _id: { $ne: userId },
    _id: { $in: requestFriends },
    status: "active",
    deleted: false,
  }).select("id avatar fullName");
  res.render("client/pages/userSocial/request", {
    pageTitle: "Danh sách lời mời đã gửi",
    users: users,
  });
};

//[GET]/userSocial/accept
module.exports.accept = async (req, res) => {
  //Socket IO
  socialSocket(res);
  // End Socket IO
  const userId = res.locals.user.id;
  const myUser = await User.findOne({
    _id: userId,
  });
  const acceptFiends = myUser.acceptFriends;
  const users = await User.find({
    // _id: { $ne: userId },
    _id: { $in: acceptFiends },
    status: "active",
    deleted: false,
  }).select("id avatar fullName");
  res.render("client/pages/userSocial/accept", {
    pageTitle: "Danh sách lời mời đã nhận",
    users: users,
  });
};

//[GET]/userSocial/friends
module.exports.friends = async (req, res) => {
  //Socket IO
  socialSocket(res);
  // End Socket IO
  const userId = res.locals.user.id; // nguoi A

  const myUser = await User.findOne({
    _id: userId,
  });

  const friendList = myUser.friendList;
  const friendListId = friendList.map((item) => item.user_id);
  // console.log(friendListId);

  const users = await User.find({
    _id: { $in: friendListId },
    status: "active",
    deleted: false,
  }).select("id avatar fullName statusOnline");

  // console.log(users);
  // res.send("OK");

  res.render("client/pages/userSocial/friends", {
    pageTitle: "Danh sách bạn bè",
    users: users,
  });
};
