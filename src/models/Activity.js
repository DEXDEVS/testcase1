const { mongoose } = require('mongoose');

const activitySchema = new mongoose.Schema(
  {
    userID: { type: mongoose.Types.ObjectId, required: true },
    cardNumbers: { type: String, required: true },
    action: { type: String, required: true },
    desc: { type: String },
  },
  { timestamps: true, versionKey: false }
);

const Activity = mongoose.model('Activity', activitySchema);

module.exports = Activity;
