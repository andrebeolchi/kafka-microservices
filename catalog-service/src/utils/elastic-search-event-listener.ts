import { EventEmitter } from "events"
import { ElasticSearchService } from "~/services/elastic-search"

export type EventType = 'create-product' | 'update-product' | 'delete-product'

export interface EventPayload {
  event: EventType
  data: Record<string, unknown>
}

export class ElasticSearchEventListener extends EventEmitter {
  private static _instance: ElasticSearchEventListener

  private eventName: string = "ELASTIC_SEARCH_EVENT"

  private constructor() {
    super()
  }

  static get instance() {
    return this._instance || (this._instance = new ElasticSearchEventListener())
  }

  notify(payload: EventPayload) {
    this.emit(this.eventName, payload)
  }

  listen(instance: ElasticSearchService) {
    this.on(this.eventName, async (payload: EventPayload) => {
      console.log("Event received: ", payload)
      instance.handleEvents(payload)
    })
  }
}