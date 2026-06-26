import "@typespec/http";
import "./common.tsp";

using TypeSpec.Http;

/** Catalog API — aligned with ai-search-portal CatalogApiRow & py-able-labs Ex02. 回應以共用信封包裝。 */
@service(#{ title: "NX Playground Catalog API" })
namespace catalog;

@doc("Type of a catalog item")
enum ItemType { App: "app", Dataset: "dataset", Model: "model", Service: "service" }

@doc("Lifecycle status of a catalog item")
enum ItemStatus { Draft: "draft", Published: "published", Archived: "archived" }

@doc("A catalog item")
model CatalogItem {
  id: string;
  name: string;
  itemType: ItemType;
  description?: string;
  status: ItemStatus;
  createdAt: utcDateTime;
  updatedAt: utcDateTime;
}

@doc("Payload to create a catalog item")
model CreateCatalogItem {
  name: string;
  itemType: ItemType;
  description?: string;
}

@doc("Paginated list of catalog items")
model CatalogItemPage {
  items: CatalogItem[];
  page: int32;
  pageSize: int32;
  total: int32;
}

@route("/catalog/items")
@tag("catalog")
interface Items {
  @summary("List catalog items with type filter and pagination")
  @get list(@query type?: ItemType, @query page?: int32 = 1, @query pageSize?: int32 = 20):
    SuccessMessage<CatalogItemPage> | ErrorMessage;

  @summary("Get a catalog item by id")
  @get read(@path id: string): SuccessMessage<CatalogItem> | ErrorMessage;

  @summary("Create a catalog item")
  @post create(@body body: CreateCatalogItem):
    { @statusCode statusCode: 201; @body body: SuccessMessage<CatalogItem> } | ErrorMessage;
}
