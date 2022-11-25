import mongoose from "mongoose";

export function DBConnect(cb){
    mongoose.connect(
        "mongodb://localhost:27017coder",
        (err)=>{
            if (err) cb(err);
        }
    );
}

export const Users = mongoose.model('users', {
    username: String,
    password: String,
    email: String
});