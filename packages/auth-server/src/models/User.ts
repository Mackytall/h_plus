import { Schema, model, Document, Model, Types } from 'mongoose';

export enum UserRole {
  admin = 'admin',
  user = 'user',
  adherent = 'adherent',
  student = 'student',
}

export interface UserAttrs {
  lastName: string;
  firstName: string;
  email: string;
  password: string;
  photo?: string;
  role?: UserRole;
  address?: string;
  zipCode?: string;
  city?: string;
  phone?: string;
}

export interface UserModel extends Model<UserDocument> {
  add(doc: UserAttrs): UserDocument;
  getById(id: string): Promise<UserDocument>;
  getByEmail(email: string, withPassword?: boolean): Promise<UserDocument>;
  getAll(): Promise<UserDocument[]>;
  updateUser(id: string, doc: Partial<UserAttrs>): Promise<UserDocument>;
  deleteUser(id: string): Promise<UserDocument>;
  likeEvent(id: string, eventId: string): Promise<UserDocument>;
  dislikeEvent(id: string, eventId: string): Promise<UserDocument>;
}

export interface UserDocument extends Document {
  lastName: string;
  firstName: string;
  email: string;
  password: string;
  role: UserRole;
  likedEvents: string[];
  createdAt: string;
  updatedAt: string;
  photo?: string;
  address?: string;
  zipCode?: string;
  city?: string;
  phone?: string;
}

const UserSchema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
    photo: { type: String, required: false },
    address: { type: String, required: false },
    zipCode: { type: String, required: false },
    city: { type: String, required: false },
    phone: { type: String, required: false },
    role: { type: String, required: true, default: UserRole.user, enum: UserRole },
    likedEvents: { type: [{ type: Types.ObjectId, ref: 'Event' }], required: false, default: [] },
  },
  { timestamps: true }
);

UserSchema.statics.add = (doc: UserAttrs) => {
  return new User(doc);
};

UserSchema.statics.getById = (id: string) => {
  return User.findById(id).lean();
};

UserSchema.statics.getByEmail = (email: string, withPassword?: boolean) => {
  return User.findOne({ email })
    .select(withPassword ? '+password' : '-password')
    .lean();
};

UserSchema.statics.getAll = () => {
  return User.find().lean();
};

UserSchema.statics.updateUser = (id: string, doc: Partial<UserAttrs>) => {
  return User.findByIdAndUpdate(id, doc, { new: true }).lean();
};

UserSchema.statics.deleteUser = (id: string) => {
  return User.findByIdAndDelete(id);
};

UserSchema.statics.likeEvent = (id: string, eventId: string) => {
  return User.findByIdAndUpdate(id, { $push: { likedEvents: eventId } });
};

UserSchema.statics.dislikeEvent = (id: string, eventId: string) => {
  return User.findByIdAndUpdate(id, { $pull: { likedEvents: eventId } });
};

export const User = model<UserDocument, UserModel>('User', UserSchema);
