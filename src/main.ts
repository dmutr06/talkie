import { Elysia } from "elysia";
import { userRouter } from "./user";
import { authRouter } from "./auth";

const app = new Elysia();

app
  .use(userRouter)
  .use(authRouter)
  .get("/", () => "Hello Elysia")
  .listen(6969);


console.log(
  `Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
