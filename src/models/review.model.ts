import { Schema, model } from 'mongoose'
import { IReview, IReviewModel } from '../interface/review.interface'
import Tour from './tour.model'

const reviewSchema = new Schema<IReview, IReviewModel>({
  review: {
    type: String,
    required: [true, 'Please tell us your review'],
  },
  rating: {
    type: Number,
    required: [true, 'Please tell us your rating'],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  tour: {
    type: Schema.Types.ObjectId,
    ref: 'Tour',
    required: [true, 'Please tell us your tour'],
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Please tell us your user'],
  },
})

reviewSchema.index({ tour: 1, user: 1 }, { unique: true })

reviewSchema.statics.calculateAverageRatings = async function (
  tourId: Schema.Types.ObjectId,
) {
  const stats = await this.aggregate([
    {
      $match: { tour: tourId },
    },
    {
      $group: {
        _id: '$tour',
        numberOfRatings: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ])

  if (stats.length > 0) {
    await Tour.findByIdAndUpdate(tourId, {
      ratingAverage: stats[0].avgRating,
      ratingQuantity: stats[0].numberOfRatings,
    })
  } else {
    await Tour.findByIdAndUpdate(tourId, {
      ratingAverage: 0,
      ratingQuantity: 0,
    })
  }
}

const Review = model<IReview, IReviewModel>('Review', reviewSchema)

export default Review
