import * as Ably from 'ably';

let channel;

// let clientId = "pollo" + (new Date().getTime() % 100000);
let clientId = "";
while (!clientId) {
    clientId = prompt("Write your username");
}
const client = new Ably.Realtime({ key: '9Dakxw.tSDnZA:kRUK23uiauySw7gM', clientId });
channel = client.channels.get('trollmusic');
channel.presence.enter();

export { channel, clientId as user };