import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IContact extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  name: string;
  phone?: string;
  email?: string;
  company?: string;
  address?: string;
  tags: string[];
  isFavorite: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const contactSchema = new Schema<IContact>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Contact name is required'],
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
      sparse: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      sparse: true,
    },
    company: {
      type: String,
      trim: true,
      index: true,
    },
    address: {
      type: String,
      trim: true,
    },
    tags: {
      type: [String],
      index: true,
      default: [],
      set: (tags: string[]) => tags.map((t: string) => t.trim()),
    },
    isFavorite: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Compound text index for full-text search
contactSchema.index(
  { name: 'text', email: 'text', company: 'text', phone: 'text' },
  { weights: { name: 10, email: 5, company: 3, phone: 2 } }
);

// Compound indexes for common query patterns
contactSchema.index({ userId: 1, isFavorite: 1 });
contactSchema.index({ userId: 1, createdAt: -1 });

const Contact: Model<IContact> = mongoose.model<IContact>('Contact', contactSchema);
export default Contact;
