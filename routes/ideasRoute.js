import express from "express";

import {
    getIdeas, 
    getAddIdeas, 
    postAddIdeas,
    deleteIdeas,
    getEditIdeas, 
    putEditIdeas,
} from "../controllers/IdeasController.js";
import ensureAuthenticated from "../helpers/auth.js";

const router = express.Router();

//router.get("/ideas", getIdeas);
//router.get ("/ideas/add", getAddIdeas);
//router.post("/ideas/add", postAddIdeas);
//router.delete ("/ideas/:id", deleteIdeas);
//router.get("/ideas/edit/:id", getEditIdeas);
//router.put("/ideas/edit/:id", putEditIdeas);

router.get("/", getIdeas);
//router.get ("/add", getAddIdeas);
//router.post("/add", postAddIdeas);
router.route("/add")
    .get(getAddIdeas)
    .post(postAddIdeas);

router.delete ("/:id", deleteIdeas);
//router.get("/edit/:id", getEditIdeas);
//router.put("/edit/:id", putEditIdeas);
router.route("/edit/:id").get(getEditIdeas).put(putEditIdeas);

export default router;