import express from "express";
import { getRegister, postRegister,getLogin, postLogin, getLogout}
from "../controllers/usersController.js";
const router = express.Router();

//router.get("/register", getRegister);
//router.post ("/register", postRegister);
//router.get("/login", getLogin);
//router.post ("/login", postLogin);  
//router.get("/logout", getLogout);
// refactor to
router.route("/register").get(getRegister).post(postRegister);
router.route("/login").get(getLogin).post(postLogin);
router.route("/logout").get(getLogout);
export default router;