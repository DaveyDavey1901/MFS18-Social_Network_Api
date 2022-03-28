const { Schema, model, types } = require("mongoose");
const reactionSchema = require("./Reaction");
const moment = require("moment");

// thought schema
const thoughtSchema = new Schema(
  {
    thoughtText: {
      type: String,
      required: "Tell me something, anything?",
      minlength: 1,
      maxlength: 280,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      get: (createdAtValue) =>
        moment(createdAtValue).format("MMM DD, YYYY [at] hh:mm a"),
    },
    username: {
      type: String,
      required: true,
    },

    reactions: [reactionSchema],
  },
  {
    toJSON: {
      getters: true,
    },
    id: false,
  }
);

// retrieves the length of the thought's `reactions` array field on query.
thoughtSchema.virtual("reactionCount").get(function () {
  return this.reactions.length;
});

// create the User model using the UserSchema
const Thought = model("Thought", thoughtSchema);

// export the User model
module.exports = { Thought };
