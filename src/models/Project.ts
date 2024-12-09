import mongoose from 'mongoose';

export interface IRoom {
  name: string;
  width: number;
  length: number;
  height: number;
  windows: number;
  doors: number;
}

export interface IProject {
  userId: string;
  name: string;
  rooms: IRoom[];
  createdAt: Date;
  updatedAt: Date;
}

const roomSchema = new mongoose.Schema<IRoom>({
  name: { type: String, required: true },
  width: { type: Number, required: true },
  length: { type: Number, required: true },
  height: { type: Number, required: true },
  windows: { type: Number, default: 0 },
  doors: { type: Number, default: 0 },
});

const projectSchema = new mongoose.Schema<IProject>({
  userId: { type: String, required: true, index: true },
  name: { type: String, required: true },
  rooms: [roomSchema],
}, {
  timestamps: true,
});

// Prevent duplicate model initialization
export const Project = mongoose.models.Project || mongoose.model<IProject>('Project', projectSchema);
