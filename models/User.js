import mongoose from "mongoose";
const {Schema} = mongoose;

const UserSchema = new Schema ( {
    name : {
        type : String,
        requried : true,
    },
    email : {
        type : String,
        required : true,
    },
    password : {
        type : String,
        required : true,
    },
    admin : {
        type : Boolean,
        required : false,
    }
});
const User = mongoose.model("users", UserSchema);
export default User;