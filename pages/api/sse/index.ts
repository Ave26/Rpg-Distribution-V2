// // pages/api/sse.js
// export default async (
//   req: any,
//   res: {
//     setHeader: (arg0: string, arg1: string) => void;
//     flushHeaders: () => void;
//     write: (arg0: string) => void;
//   }
// ) => {
//   res.setHeader("Content-Type", "text/event-stream");
//   res.setHeader("Cache-Control", "no-cache");
//   res.flushHeaders();

//   // Simulate stateful updates (e.g., chat messages, notifications)
//   setInterval(() => {
//     const data = { message: "New event from server" };
//     res.write(`data: ${JSON.stringify(data)}\n\n`);
//   }, 5000); // Send updates every 5 seconds
// };
