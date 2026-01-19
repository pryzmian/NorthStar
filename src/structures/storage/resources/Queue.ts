import type { QueueJson } from "hoshimi";
import { BaseResource } from "seyfert";

export class QueueResource extends BaseResource<QueueJson, QueueJson>  {
    override namespace = "queues";
}