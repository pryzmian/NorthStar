import "dotenv/config";
import { YumeClient } from "./structures/Client.js";

const client = new YumeClient();
await client.init();
