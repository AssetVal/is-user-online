import {io} from "../_snowpack/pkg/socket.io-client.js";
import dayjs from "../_snowpack/pkg/dayjs.js";
import relativeTime from "../_snowpack/pkg/dayjs/plugin/relativeTime.js";
dayjs.extend(relativeTime);
const socket = io("https://veritas-socks.herokuapp.com/", {
  withCredentials: true,
  transports: ["websocket"],
  secure: true,
  rejectUnauthorized: false,
  extraHeaders: {
    "assetcat-the-wondercat": "sampleValue"
  }
});
let usersOnline = [];
const userPayload = {
  user: document.getElementById("invisibleEmail").value,
  path: document.location.pathname,
  lastRequest: new Date(Date.now())
};
socket.on("OnlineService", () => {
  socket.emit("isOnline", userPayload);
});
socket.on("Online", (data) => {
  data.forEach((userOnline) => {
    userOnline.$lastRequest = dayjs(userOnline.lastRequest).fromNow();
  });
  console.log("modified-online", data);
  usersOnline = data;
});
socket.on("offline", (data) => {
  data.forEach((userOnline) => {
    userOnline.$lastRequest = dayjs(userOnline.lastRequest).fromNow();
  });
  console.log("offline", data);
  usersOnline = data;
});
const isUserOnline = (email) => usersOnline.filter((obj) => obj.user === email);
export default isUserOnline;
