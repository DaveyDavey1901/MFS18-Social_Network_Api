const { User, Thought } = require("../models");

const userController = {
  // get all users
  getUsers(req, res) {
    User.find()
      .select("-__v")
      .then((userData) => {
        res.json(userData);
      })
      .catch((err) => {
             res.status(500).json(err);
      });
  },
  // get single user by id
  getUser(req, res) {
    User.findOne({ _id: req.params.userId })
      .select("-__v")
      .populate("friends")
      .populate("thoughts")
      .then((userData) => {
        if (!userData) {
          return res.status(404).json({ message: "Sorry no user found with this id!" });
        }
        res.json(userData);
      })
      .catch((err) => {
               res.status(500).json(err);
      });
  },
  // create a new user
  createUser(req, res) {
    User.create(req.body)
      .then((userData) => {
        res.json(userData);
      })
      .catch((err) => {
        res.status(500).json(err);
      });
  },
  // update a user
  updateUser(req, res) {
    User.findOneAndUpdate(
      { _id: req.params.userId },
      {
        $set: req.body,
      },
      {
        runValidators: true,
        new: true,
      }
    )
      .then((userData) => {
        if (!userData) {
          return res
            .status(404)
            .json({ message: "Sorry no user found with this id!" });
        }
        res.json(userData);
      })
      .catch((err) => {
           res.status(500).json(err);
      });
  },

  deleteUser(req, res) {
    User.findOneAndDelete({ _id: req.params.userId })
      .then((userData) => {
        if (!userData) {
          return res
            .status(404)
            .json({ message: "Sorry no user found with this id!" });
        }

             return Thought.deleteMany({ _id: { $in: userData.thoughts } });
      })
      .then(() => {
        res.json({ message: "User and their thoughts deleted!" });
      })
      .catch((err) => {
             res.status(500).json(err);
      });
  },

  // add friend to friend list
  addFriend(req, res) {
    User.findOneAndUpdate(
      { _id: req.params.userId },
      { $addToSet: { friends: req.params.friendId } },
      { new: true }
    )
      .then((userData) => {
        if (!userData) {
          return res
            .status(404)
            .json({ message: "Sorry no user found with this id!" });
        }
        res.json(userData);
      })
      .catch((err) => {
            res.status(500).json(err);
      });
  },
  // remove friend from friend list
  removeFriend(req, res) {
    User.findOneAndUpdate(
      { _id: req.params.userId },
      { $pull: { friends: req.params.friendId } },
      { new: true }
    )
      .then((userData) => {
        if (!userData) {
          return res
            .status(404)
            .json({ message: "Sorry no user found with this id!" });
        }
        res.json(userData);
      })
      .catch((err) => {
            res.status(500).json(err);
      });
  },
};

module.exports = userController;
