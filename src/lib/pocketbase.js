import PocketBase from "pocketbase";

const url = "https://member-poor.pockethost.io/";
export const client = new PocketBase(url);
client.autoCancellation(false);
