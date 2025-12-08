import { getIronSession } from "iron-session";
import { sessionOptions } from "../config/session";

function getPropertyDescriptorForReqSession(session) {
  return {
    enumerable: true,
    get() {
      return session;
    },
    set(value) {
      const keys = Object.keys(value);
      const currentKeys = Object.keys(session);

      currentKeys.forEach((key) => {
        if (!keys.includes(key)) {
          // @ts-ignore See comment in IronSessionData interface
          delete session[key];
        }
      });

      keys.forEach((key) => {
        // @ts-ignore See comment in IronSessionData interface
        session[key] = value[key];
      });
    },
  };
}

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