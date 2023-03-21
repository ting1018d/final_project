import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
export default function (passport) {
    passport.use(
        new LocalStrategy ({usernameField: "email"}, function (
            email, 
            password, 
            done
        ) {
            User.findOne ({
                email : email,
            }).then (user => {
                if (!user) {
                    return done(null, false, {
                        type : "fail_passport",
                        message: "No User Found !",
                    });
                } else {
                    bcrypt.compare (password, user.password, (err, isMatch) => {
                        if(err) throw err;
                        if (isMatch) {
                            return done(null, user);
                        } else {
                            return done(null, false, {
                                type: "fail_password",
                                message: "Password Incorrect !",
                            });
                        }
                    });
                }
            })
        }
    ));


passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    });
});
}