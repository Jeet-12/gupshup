import mongoose from "mongoose";

const connectToMongoDB = async () => {
	try {
		await mongoose.connect("mongodb+srv://gamingfluenza1:k7U48DzEI4IIzHf1@gupshap.1peniwg.mongodb.net/?retryWrites=true&w=majority");
		console.log("Connected to MongoDB");
	} catch (error) {
		console.log("Error connecting to MongoDB", error.message);
	}
};

export default connectToMongoDB;
