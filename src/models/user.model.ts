import { Query, Schema, model } from 'mongoose'
import { IUser } from '../interface/user.interface'

const userSchema = new Schema<IUser>({
  name: {
    type: String,
    required: [true, 'Please tell us your name'],
  },
  age: {
    type: Number,
    required: [true, 'Please tell us your age'],
  },
  email: {
    type: String,
    unique: true,
    required: [true, 'Please tell us your email'],
    lowercase: true,
    match: [/\S+@\S+\.\S+/, 'Please use a valid email address'],
  },
  photo: String,
  role: {
    type: String,
    enum: {
      values: ['user', 'admin'],
      message: 'Role must be either user or admin, but received {{VALUE}}',
    },
    default: 'user',
  },
  userStatus: {
    type: String,
    enum: {
      values: ['active', 'inactive'],
      message:
        'Status must be either active or inactive, but received {{VALUE}}',
    },
    default: 'active',
  },
})

// pre hook form query middleware
userSchema.pre(/^find/, function (this: Query<IUser, Document>, next) {
  this.find({ userStatus: { $eq: 'active' } })
  next()
})


const User = model<IUser>('User', userSchema)
export { User }
