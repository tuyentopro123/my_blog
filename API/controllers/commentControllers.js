const Comment = require("../models/Comment");
const Post = require("../models/Post");
const Notification = require("../models/Notification");
const User = require("../models/User");

const createNotification = async (
  img,
  senderUser,
  receiverUser,
  senderComment,
  action,
  actionIcon,
  reaction
) => {
  const user = await User.findById(receiverUser);
  const notification = new Notification({
    sender_img: img,
    sender_user: senderUser,
    user_receiver: receiverUser,
    sender_comment:senderComment,
    action: action,
    action_icon: actionIcon,
    reaction: reaction,
  });
  await notification.save();
  user.notification_count++;
  await user.save();
};

const commentControllers = {
  // COMMENT POST
  createComment: async (req, res) => {
    try {
      const comment = new Comment({
        ...req.body,
      });
      await comment.save();
      if (req.body.reaction) {
        const currentComment = await Comment.findById(req.body.reaction);
        currentComment.reaction_count += 1;
        await currentComment.save();
        if (req.body.user_receiver !== req.body.user) {
          await createNotification(
            req.body.user_img,
            req.body.user_name,
            req.body.user_receiver,
            comment._id,
            "replyComment",
            "comment",
            req.body.reaction
          );
        }
      } else {
        if (req.body.user_receiver !== req.body.user) {
          await createNotification(
            req.body.user_img,
            req.body.user_name,
            req.body.user_receiver,
            comment._id,
            "comment",
            "comment",
            req.body.post
          );
        }
      }
      const postRequest = await Post.findById(req.body.post)
        .populate("user")
        .populate("like_user");
      postRequest.commentCount += 1;
      await postRequest.save();
      const commentRequest = await Comment.find({
        post: req.body.post,
        reaction: "",
      }).sort({ createdAt: -1 });
      return res.status(200).json(commentRequest);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },

  // GET COMMENT OF POST
  getComment: async (req, res) => {
    try {
      const comment = await Comment.find({
        post: req.params.id,
        reaction: "",
      }).populate("user").sort({ createdAt: -1 });
      return res.status(200).json(comment);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },

  // DELETE COMMENT
  deleteComment: async (req, res) => {
    try {
      const comment = await Comment.findById(req.body.comment);
      const postRequest = await Post.findById(req.body.post)
        .populate("user")
        .populate("like_user");
      postRequest.commentCount -= 1;
      await postRequest.save();
      if (comment.reaction) {
        const commentParent = await Comment.findById(comment.reaction);
        commentParent.reaction_count = commentParent.reaction_count - 1;
        await commentParent.save();
        await Comment.deleteOne(comment);
      } else {
        await Comment.findByIdAndDelete(req.body.comment);
        await Comment.deleteMany({ reaction: req.body.comment });
      }
      const commentRequest = await Comment.find({
        post: req.body.post,
        reaction: "",
      }).sort({ createdAt: -1 });
      return res.status(200).json(commentRequest);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },

  // INTERACTIVE OF COMMENT
  interComment: async (req, res) => {
    try {
      const comment = await Comment.findById(req.params.id);
      const inter = await comment.inter_user.find((e) => e.id === req.body.id);
      if (inter) {
        await comment.inter_user.pull(inter);
        if (inter.inter !== req.body.inter) {
          await comment.inter_user.push(req.body);
          if (req.body.id !== req.body.user_receiver) {
            await createNotification(
              req.body.avatar,
              req.body.username,
              req.body.user_receiver,
              "",
              "interComment",
              req.body.inter,
              req.body.reaction
            );
          }
        }
      } else {
        await comment.inter_user.push(req.body);
        if (req.body.id !== req.body.user_receiver) {
          await createNotification(
            req.body.avatar,
            req.body.username,
            req.body.user_receiver,
            "",
            "interComment",
            req.body.inter,
            req.body.reaction
          );
        }
      }

      await comment.save();
      const commentRequest = await Comment.find({
        post: comment.post,
        reaction: "",
      }).populate("user").sort({ createdAt: -1 });
      return res.status(200).json(commentRequest);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },

  // REPLY OF COMMENT
  replyComment: async (req, res) => {
    try {
      const id = req.params.id
      const comment = await Comment.find({ reaction: id }).populate("user").sort({
        createdAt: -1,
      });
      return res.status(200).json({
        comment,
        id
      });
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },
};

module.exports = commentControllers;
