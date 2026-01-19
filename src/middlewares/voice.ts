import { createMiddleware } from "seyfert";

/**
 * Checks if the user is in a voice channel.
 */
export const InVoiceChannel = createMiddleware<void>(async ({ next, stop, context }) => {
    if (!context.inGuild()) return next();

    const memberVoiceState = await context.member?.voice().catch(() => null);
    if (!memberVoiceState) {
        return stop("❌ | You must be in a voice channel to use this command.");
    }

    return next();
});

/**
 * Checks if the user is in the same voice channel as the bot.
 */
export const InSameVoiceChannel = createMiddleware<void>(async ({ next, stop, context }) => {
    if (!context.inGuild()) return next();
    
    const botMember = await context.me();
    if (!botMember) return;

    const memberVoiceState = await context.member?.voice().catch(() => null);
    const botVoiceState = await botMember.voice().catch(() => null);

    if (botVoiceState && memberVoiceState!.channelId !== botVoiceState.channelId) {
        return stop(`❌ | I am already playing music in another voice channel. (<#${botVoiceState.channelId}>)`    );
    }

    return next();
});