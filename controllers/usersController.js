 
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import passport from "passport";

export const getRegister = (req,res) => {
    res.render("users/register");
};

export const postRegister = (req, res) => {
    let errors = [];
    if (!req.body.name) {
        errors.push({text: "Name is missing !"});
    }
    if (!req.body.email){
        errors.push({text: "email is missing"});
    }
    if (req.body.password !== req.body.password2) {
        errors.push({text: "password do not match !"});
    }
    if (req.body.password.length < 4){
        errors.push({text: "password must be at least 4 characters !"});
    }
    if(errors.length > 0) {
        res.render("users/register", {
            errors : errors,
            name : req.body.name,
            email : req.body.email,
            password : req.body.password,
            password2 : req.body.password2           
        })
    } else {
        User.findOne({ email: req.body.email }).then
        ((user) => {
            if (user) {
            req.flash ("error_msg", "Email already register !");
            res.redirect("/users/register");
            }
            else {
                const newUser = new User({
                    name : req.body.name,
                    email : req.body.email,
                    password : req.body.password,
                });
                // hash = salt + hash (pw)
                bcrypt.genSalt(10, (err,salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if (err) throw err;
                        newUser.password = hash;
                        newUser
                        .save()
                        .then(() => {
                            req.flash("success_msg", "Register Done !");
                            res.redirect("/users/login");
                        })
                        .catch((err) => {
                            console.log(err);
                            req.flash ("error_msg", "Server went wrong !");
                            res.redirect("/users/register");
                    });
                });
            })
        
            }
        });
    }
};

export const getLogin = (req, res) => {
    res.render("users/login");
};

export const postLogin = (req, res, next) => {
    passport.authenticate("local", {
        successRedirect : "/ideas",
        failureRedirect : "/users/login",
        failureFlash : true,        
    }) (req, res, next);
};

export const getLogout = (req, res) => {
    req.logout(err => {
        if(err) throw err;
    });
    req.flash("success_msg","You are logged out !");
    console.log("you are logged out");
    res.redirect("/users/login");
};
