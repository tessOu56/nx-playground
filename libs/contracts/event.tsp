import "@typespec/http";

using TypeSpec.Http;

/**
 * Event API — ported to TypeSpec from event.openapi.yaml (was protobuf/gRPC-gateway derived).
 * One module, two interfaces: ConsoleEvents (admin CRUD) + PublicEvents (public read/search).
 * Field names kept snake_case to preserve the existing wire contract.
 */
@service(#{ title: "NX Playground Event API" })
namespace event;

@error
@doc("Standard error envelope (gRPC-gateway rpcStatus equivalent)")
model RpcStatus {
  code?: int32;
  message?: string;
  details?: Record<unknown>[];
}

@doc("GeoJSON Point: coordinates are [longitude, latitude]")
model GeoJSONPoint {
  @doc("Always \"Point\"") type?: string;
  coordinates?: float64[];
}

@doc("Location with GeoJSON Point structure")
model Location {
  name?: string;
  address?: string;
  place_id?: string;
  coordinates?: GeoJSONPoint;
}

@doc("Session for time-based event scheduling")
model Session {
  id?: string;
  @doc("Session name (optional)") name?: string;
  @doc("Capacity limit; omitted means unlimited") capacity?: int32;
  @doc("RFC3339") start_time?: string;
  @doc("RFC3339") end_time?: string;
}

@doc("FAQ entry") model FAQ { question?: string; answer?: string; }
@doc("Text block data") model TextData { content?: string; }
@doc("Image block data") model ImageData { url?: string; alt?: string; caption?: string; }

@doc("Detail block for structured content")
model DetailBlock {
  type?: string;
  text_data?: TextData;
  image_data?: ImageData;
}

@doc("Core Event message")
model Event {
  id?: string;
  title?: string;
  brand_id?: string;
  summary?: string;
  @doc("draft, published, archived") status?: string;
  @doc("public, private") visibility?: string;
  cover_image_url?: string;
  location?: Location;
  sessions?: Session[];
  detail?: DetailBlock[];
  faq?: FAQ[];
  created_at?: string;
  created_by?: string;
  updated_at?: string;
  updated_by?: string;
}

model Pagination {
  next_page_token?: string;
  prev_page_token?: string;
  has_next?: boolean;
  has_prev?: boolean;
  total_count?: int32;
  current_page?: int32;
  total_pages?: int32;
}

model EventListResponse { events?: Event[]; pagination?: Pagination; }
model CreateEventRequest {
  title?: string; summary?: string; visibility?: string; cover_image_url?: string;
  location?: Location; sessions?: Session[]; detail?: DetailBlock[]; faq?: FAQ[];
}
model CreateEventResponse { id?: string; created_at?: string; }
model PatchEventBody {
  title?: string; summary?: string; visibility?: string; cover_image_url?: string;
  location?: Location; sessions?: Session[]; detail?: DetailBlock[]; faq?: FAQ[];
}
@doc("draft|published|archived") model UpdateEventStatusBody { status?: string; }

@doc("Admin event management")
@route("/console/events")
@tag("event")
interface ConsoleEvents {
  @summary("Get list of events with filtering and pagination")
  @get list(
    @query page_token?: string, @query page?: int32, @query page_size?: int32,
    @query status?: string, @query visibility?: string, @query title_search?: string,
    @query sort_by?: string, @query sort_order?: string,
    @query session_start_time_from?: string, @query session_start_time_to?: string,
  ): EventListResponse | RpcStatus;

  @summary("Create event (always created as draft)")
  @post create(@body body: CreateEventRequest): CreateEventResponse | RpcStatus;

  @summary("Get event by id")
  @get read(@path id: string): Event | RpcStatus;

  @summary("Patch event")
  @patch update(@path id: string, @body body: PatchEventBody): Event | RpcStatus;

  @summary("Delete event")
  @delete delete(@path id: string): RpcStatus;

  @summary("Delete a session of an event")
  @route("/{id}/sessions/{session_id}")
  @delete deleteSession(@path id: string, @path session_id: string): RpcStatus;

  @summary("Update event status")
  @route("/{id}/status")
  @put updateStatus(@path id: string, @body body: UpdateEventStatusBody): Event | RpcStatus;
}

@doc("Public event read/search")
@route("/events")
@tag("event")
interface PublicEvents {
  @summary("Search public events")
  @get search(
    @query page_token?: string, @query page?: int32, @query page_size?: int32,
    @query brand_id?: string, @query title_search?: string,
    @query sort_by?: string, @query sort_order?: string,
    @query session_start_time_from?: string, @query session_start_time_to?: string,
    @query location_lat?: float64, @query location_lng?: float64, @query location_radius?: float64,
  ): EventListResponse | RpcStatus;

  @summary("Get a public event by id")
  @get read(@path id: string): Event | RpcStatus;
}
