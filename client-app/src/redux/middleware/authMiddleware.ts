import { Middleware } from "@reduxjs/toolkit";
import { router } from "../../app/router/Routes";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const authMiddleware: Middleware = () => (next) => (action: any) => {
  const result = next(action);
  if (action.type === "user/loginSuccess") {
    console.log("Login success detected, navigating to /activities");
    router.navigate("/activities");
  }

  return result;
};
