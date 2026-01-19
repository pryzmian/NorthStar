import type { Omit } from "hoshimi";
import type { ParseClient, ParseMiddlewares, User } from "seyfert";
import type { NorthStarMiddlewares } from "./middlewares/index.js";
import type { YumeClient } from "./structures/Client.js";
import type { QueueResource } from "./structures/storage/resources/Queue.js";

declare module "seyfert" {
    interface InternalOptions {
        asyncCache: false;
        withPrefix: false;
    }

    interface Cache {
        queues: QueueResource;
    }

    interface ExtendedRCLocations {
        lavalink: string;
    }

    interface UsingClient extends ParseClient<YumeClient> {}
    interface RegisteredMiddlewares extends ParseMiddlewares<typeof NorthStarMiddlewares> {}
}

declare module "hoshimi" {
    interface CustomizableTrack {
        requester: Omit<User, "client">;
    }

    interface CustomizablePlayerStorage {
        messageId?: string;
    }
}

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            // Client Variables
            BOT_TOKEN: string;
            CLIENT_ID: string;
            CLIENT_USERNAME: string;

            // Storage Variables
            REDIS_URL: string;
            REDIS_HOST: string;
            REDIS_PORT: string;
            REDIS_USERNAME: string;
            REDIS_PASSWORD: string;
            DATABASE_URL: string;

            // Lavalink Variables
            LAVALINK_ID: string;
            LAVALINK_HOST: string;
            LAVALINK_PORT: string;
            LAVALINK_PASSWORD: string;
            LAVALINK_SECURE: string;
        }
    }
}
