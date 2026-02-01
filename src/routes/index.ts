import { Router } from "express";
import userRouter from "../modules/user/user.route";

const routes = Router();

routes.use("/user", userRouter)

export default routes;