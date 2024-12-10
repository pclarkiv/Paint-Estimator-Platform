import mongoose from 'mongoose';

export interface IDocument {
  userId: string;
  filename: string;
  key: string;
  createdAt: Date;
  updatedAt: Date;
}

const documentSchema = new mongoose.Schema<IDocument>(
  {
    userId: { type: String, required: true, index: true },
    filename: { type: String, required: true },
    key: { type: String, required: true, unique: true },
  },
  {
    timestamps: true,
  }
);

export const Document = mongoose.models.Document || mongoose.model<IDocument>('Document', documentSchema);
