import { getIronSession } from "iron-session";
import { sessionOptions } from "../config/session";

export function withSessionRoute(handler) {
  return async (req, res) => {
    const session = await getIronSession(req, res, sessionOptions);

    Object.defineProperty(
      req,
      "session",
      getPropertyDescriptorForReqSession(session),
    );
    return handler(req, res);
  }
}

export function withSessionSsr(handler) {
  return async (context) => {
    const session = await getIronSession(context.req, context.res, sessionOptions);

    Object.defineProperty(
      context.req,
      "session",
      getPropertyDescriptorForReqSession(session),
    );
    return handler(context);
  }
}