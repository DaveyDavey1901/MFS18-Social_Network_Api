const { Schema, model } = require("mongoose");

// user schema regex comes from mongoose matching validation
const UserSchema = new Schema(
  {
    username: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please fill a valid email address",
      ],
    },
    
    thoughts: [
      {
        type: Schema.Types.ObjectId,
        ref: "Thought",
      },
    ],
    friends: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    toJSON: {
      virtuals: true,
        },
    id: false,
  }
);

// create the User model using the UserSchema
const User = model("User", UserSchema);

// get total count of friends array on query
UserSchema.virtual("friendCount").get(function () {
  return this.friends.length;
});

// export the User model
module.exports = User;
