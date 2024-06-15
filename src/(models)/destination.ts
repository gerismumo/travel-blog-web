import mongoose, {Schema, Document} from 'mongoose';


export interface IDestination extends Document {
    name: string;
  }

const destinationSchema : Schema<IDestination> = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  }
});

export default mongoose.models.Destinations || mongoose.model<IDestination>('Destinations', destinationSchema);
