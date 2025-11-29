import { createEvent } from "seyfert";

export default createEvent({
    data: { name: "ready", once: true },
    async run(user, client, shardId): Promise<void> {
        client.logger.info(`API - Logged in as: ${user.username}`);
        client.logger.info(`Client - ${user.username} is now ready on shard #${shardId}.`);

        client.manager.init({ ...user, id: user.id });
        await client.uploadCommands({ cachePath: "./commands.json", applicationId: client.botId });
    },
});
