import mongoose, { Schema } from "mongoose";

const log = new mongoose.Schema({
  semaphore_id: {
    type: String,
    required: true,
  },
  log: {
    type: Schema.Types.Mixed, //pedestrian and obstruction
    required: false,
  },
});

export default mongoose.model("Log", log);
