import {io} from 'socket.io-client';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

export interface iOnlineStatus {
  lastRequest: Date|string,
  user: string,
  path: string
}

const socket = io('https://veritas-socks.herokuapp.com/', {
  withCredentials: true,
  transports: ['websocket'],
  secure: true,
  rejectUnauthorized: false,
  extraHeaders: {
    'assetcat-the-wondercat': 'sampleValue',
  },
});

let usersOnline: Array<iOnlineStatus> = [];

const userPayload: iOnlineStatus = { // @ts-ignore
  user: document.getElementById('invisibleEmail').value,
  path: document.location.pathname,
  lastRequest: new Date(Date.now()),
};

socket.on('OnlineService', () => {
  socket.emit('isOnline', userPayload);
});

socket.on('Online', (data: Array<iOnlineStatus>): void => {
  data.forEach((userOnline: iOnlineStatus): void => {
    if (userOnline.lastRequest instanceof Date)
    userOnline.lastRequest = dayjs(userOnline.lastRequest).fromNow();
  });
  console.log('modified-online', data);
  usersOnline = data;
});

socket.on('offline', (data: Array<iOnlineStatus>): void => {
  data.forEach((userOnline: iOnlineStatus): void => {
    if (userOnline.lastRequest instanceof Date)
    userOnline.lastRequest = dayjs(userOnline.lastRequest).fromNow();
  });
  console.log('offline', data);
  usersOnline = data;
});

const isUserOnline = (email: string): Array<iOnlineStatus> => usersOnline.filter((obj: iOnlineStatus): boolean => obj.user === email);

export default isUserOnline;
