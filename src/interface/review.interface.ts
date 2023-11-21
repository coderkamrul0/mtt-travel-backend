import { Model, Schema } from 'mongoose'

interface IReview {
  review: string
  rating: number
  createdAt: Date
  tour: Schema.Types.ObjectId
  user: Schema.Types.ObjectId
}
interface IReviewModel extends Model<IReview> {
  // eslint-disable-next-line no-unused-vars
  calculateAverageRatings(tourId: Schema.Types.ObjectId): Promise<void>
}
export { IReview, IReviewModel }
