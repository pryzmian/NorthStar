import type { AnyContext } from "seyfert";
import { EmbedColors } from "seyfert/lib/common/index.js";
import { MessageFlags } from "seyfert/lib/types/index.js";

/**
 *Handler for middleware errors.
 * @param context The context of the middleware
 * @param error The error message to be displayed
 * @returns {Promise<void> | Promise<void | WebhookMessage | Message>}
 */
export function onMiddlewaresError(context: AnyContext, error: string) {
    return context.editOrReply({
        flags: MessageFlags.Ephemeral,
        embeds: [
            {
                color: EmbedColors.Red,
                description: error
            }
        ]
    });
}
