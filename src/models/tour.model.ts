import { Schema, model } from 'mongoose'
import { ITour, ITourMethods, TTourModel } from '../interface/tour.interface'
import slugify from 'slugify'
const tourSchema = new Schema<ITour, TTourModel, ITourMethods>(
  {
    name: {
      type: String,
      required: [true, 'Please tell us your name'],
    },
    durationHours: {
      type: Number,
      required: [true, 'Please tell us your durationHours'],
    },
    ratingAverage: {
      type: Number,
      default: 4.5,
    },
    ratingQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'Please tell us your price'],
    },
    imageCover: {
      type: String,
      required: [true, 'Please tell us your imageCover'],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    startDates: [Date],
    startLocation: {
      type: String,
      required: [true, 'Please tell us your startLocation'],
    },
    locations: [String],
    slug: String,
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
)

tourSchema.virtual('durationDays').get(function () {
  return this.durationHours / 24
})

tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true })
  next()
})

tourSchema.methods.getNextNearestStartDateAndEndDate = function (): {
  nearestStartDate: Date | null;
  estimatedEndDate: Date | null;
} {
  const today = new Date();
  const futureDates = this.startDates.filter((startDate: Date) => {
    return startDate > today;
  });

  if (futureDates.length === 0) {
    // Handle the case when there are no future dates
    return {
      nearestStartDate: null,
      estimatedEndDate: null,
    };
  }

  futureDates.sort((a: Date, b: Date) => a.getTime() - b.getTime());

  const nearestStartDate = futureDates[0];
  const estimatedEndDate = new Date(
    nearestStartDate.getTime() + this.durationHours * 60 * 60 * 1000,
  );

  return {
    nearestStartDate,
    estimatedEndDate,
  };
};


const Tour = model<ITour, TTourModel>('Tour', tourSchema)

export default Tour
