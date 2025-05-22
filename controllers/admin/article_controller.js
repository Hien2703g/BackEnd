const Article = require("../../models/article.model");
const Format = require("../../Helper/format");
const Account = require("../../models/account.model");
const PagitationHelper = require("../../Helper/pagination");
module.exports.index = async (req, res) => {
  let find = {
    deleted: false,
  };
  //Pagitation
  const countPosts = await Article.countDocuments(find);
  let objectPagitation = PagitationHelper(
    req.query,
    {
      limitItem: 3,
      currentPage: 1,
    },
    countPosts
  );
  //End Patitation
  const posts = await Article.find(find)
    .sort({ position: "desc" })
    .limit(objectPagitation.limitItem)
    .skip(objectPagitation.skip);
  for (const post of posts) {
    post.createdAtStr = Format.formatDate(post.createdAt);
    if (post.account_id != "none") {
      const account = await Account.findOne({ _id: post.account_id });
      post.creator = account.fullName;
    }
  }
  res.render("admin/pages/article/index", {
    pageTitle: "Article",
    posts: posts,
    pagitation: objectPagitation,
  });
};

module.exports.create = (req, res) => {
  res.render("admin/pages/article/create", {
    pageTitle: "Create Post",
  });
};
module.exports.createPost = async (req, res) => {
  const totalPost = await Article.countDocuments({});
  const { title, content } = req.body;
  const account_id = res.locals.user.id;
  const newArticle = new Article({
    account_id: account_id,
    title: title,
    content: content,
    position: totalPost + 1,
  });
  await newArticle.save();
  res.redirect("/admin/articles");
};

module.exports.delete = async (req, res) => {
  const postId = req.params.id;
  await Article.updateOne({ _id: postId }, { deleted: true });
  res.redirect("back");
};

module.exports.edit = async (req, res) => {
  const postId = req.params.id;
  const post = await Article.findOne({ _id: postId });
  console.log(post);
  res.render("admin/pages/article/edit", {
    pageTitle: "Edit Article",
    post: post,
  });
};

module.exports.editPost = async (req, res) => {
  const postId = req.params.id;
  const { title, content } = req.body;
  await Article.updateOne({ _id: postId }, { title: title, content: content });
  res.redirect("/admin/articles");
};
