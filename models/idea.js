import mongoose from "mongoose";
const {Schema} = mongoose;

const IdeaSchema = new Schema ({
    title : {
        type : String,
        required: true,

    },
    details : {
        type : String,
        required: false,
    },
    userID : {
        type : mongoose.Types.ObjectId,
        /* required : true,  */
    },
    date : {
        type : Date,
        default : Date.now,
    }
});

const Idea = mongoose.model("Ideas",IdeaSchema);
// based on IdeaSchema, create a mold Idea 
export default Idea;