import { verifyJwt } from "@/lib/helper/jwt";
import { findAllUsers } from "@/lib/prisma/user";
import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";

const middleware =
  (handler: NextApiHandler) =>
  async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const { verifiedToken, error }: any = await verifyJwt(req);
      if (error) {
        return res.status(403).json({
          authenticated: false,
          message: error,
        });
      }
      if (verifiedToken.roles === "Admin") {
        console.log(verifiedToken);
        console.log("register");

        return handler(req, res);
      } else {
        return res.status(500).json({
          Authorized: false,
          message: "Forbidden",
        });
      }
    } catch (error) {
      return res.send(error);
    }
  };

async function handler(req: NextApiRequest, res: NextApiResponse) {
  // res.setHeader("Content-Type", "text/event-stream");
  // res.setHeader("Cache-Control", "no-cache, no-transform");
  // res.setHeader("Connection", "keep-alive");
  // // res.setHeader("Access-Control-Allow-Origin", "*");

  // const sendEvent = (data: any) => {
  //   res.write(`data: ${JSON.stringify(data)}\n\n`);
  // };
  // const { users } = await findAllUsers();

  // // Send initial data
  // sendEvent({ message: "Welcome to SSE" });

  // // Simulate sending periodic updates
  // console.log("SSE connection started");
  // const interval = setInterval(() => {
  //   sendEvent(users);
  //   console.log(users);
  // }, 5000);

  // // Send a test message to indicate SSE is open
  // sendEvent({ message: "SSE connection is open" });

  // // Clean up when the client disconnects
  // req.on("close", () => {
  //   clearInterval(interval);
  //   console.log("SSE connection closed");
  //   res.end();
  // });

  res.writeHead(200, {
    Connection: "keep-alive",
    "Content-Encoding": "none",
    "Cache-Control": "no-cache, no-transform",
    "Content-Type": "text/event-stream",
  });

  let count = 1;
  const interval = setInterval(() => {
    res.write(
      `data: ${JSON.stringify({
        message: "hello",
        value: (count += 1),
      })}\n\n`
    );
  }, 1000);

  res.on("close", () => {
    console.log(`close ${count}`);
    clearInterval(interval);
    res.end();
  });

  res.socket?.on("close", () => {
    console.log(`close ${count}`);
    clearInterval(interval);
    res.end();
  });
}

export default middleware(handler);
