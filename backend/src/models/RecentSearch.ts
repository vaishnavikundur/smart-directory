import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IRecentSearch extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  contactId: mongoose.Types.ObjectId;
  createdAt: Date;
}

const recentSearchSchema = new Schema<IRecentSearch>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
    index: true,
  },
  contactId: {
    type: Schema.Types.ObjectId,
    ref: 'Contact',
    required: [true, 'Contact ID is required'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 604800, // TTL: 7 days in seconds
  },
});

recentSearchSchema.index({ userId: 1, createdAt: -1 });

const RecentSearch: Model<IRecentSearch> = mongoose.model<IRecentSearch>(
  'RecentSearch',
  recentSearchSchema
);
export default RecentSearch;
