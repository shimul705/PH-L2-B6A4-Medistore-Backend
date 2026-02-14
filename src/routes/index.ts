import { Router } from "express";
import authRouter from "../modules/auth/auth.route";
import categoryRouter from "../modules/categories/category.route";
import medicineRouter from "../modules/medicines/medicine.route";
import orderRouter from "../modules/orders/order.route";
import reviewRouter from "../modules/reviews/review.route";
import sellerRouter from "../modules/seller/seller.route";
import adminRouter from "../modules/admin/admin.route";
import userRouter from "../modules/users/user.route";
import addressRouter from "../modules/addresses/address.route";

const routes = Router();

routes.use("/auth", authRouter);
routes.use("/categories", categoryRouter);
routes.use("/medicines", medicineRouter);
routes.use("/orders", orderRouter);
routes.use("/reviews", reviewRouter);
routes.use("/seller", sellerRouter);
routes.use("/admin", adminRouter);
routes.use("/users", userRouter);
routes.use("/addresses", addressRouter);

export default routes;