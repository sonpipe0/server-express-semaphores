import mongoose from "mongoose";

export interface Obstruction {
  name: string;
  time: Date;
}

const obstructionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  time: {
    type: Date,
    required: true,
  }
});

export default mongoose.model("Obstruction", obstructionSchema);
