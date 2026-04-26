/**
 * Shared type definitions for HASS Requester frontend.
 */

export type SlotType = "text" | "select" | "number" | "boolean";
export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
export type BodyType = "none" | "json" | "form" | "text";

export interface Slot {
  _id?: string; // stable local identity for focus management
  name: string;
  type: SlotType;
  required: boolean;
  default: string | number | boolean | null;
  options?: string[];
}

export interface HassRequest {
  id: string;
  name: string;
  method: HttpMethod;
  url: string;
  query_params: Record<string, string>;
  headers: Record<string, string>;
  body_type: BodyType;
  body: Record<string, unknown> | string | null;
  slots: Slot[];
}

export type NewHassRequest = Omit<HassRequest, "id">;

/** Injected by Home Assistant into every panel element. */
export interface HomeAssistant {
  callWS<T = unknown>(msg: Record<string, unknown>): Promise<T>;
  callService(
    domain: string,
    service: string,
    serviceData?: Record<string, unknown>
  ): Promise<void>;
  user: { is_admin: boolean; name: string };
  language: string;
  themes: { theme: string };
}
