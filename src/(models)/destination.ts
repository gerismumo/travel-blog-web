import { IDestination } from '@/(types)/destination';
import mongoose, {Schema} from 'mongoose';




const destinationSchema : Schema<IDestination> = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  }
});

export default mongoose.models.Destinations || mongoose.model<IDestination>('Destinations', destinationSchema);
