import "@typespec/http";

using TypeSpec.Http;

/**
 * Media (Image) API — ported to TypeSpec from media.openapi.yaml (protobuf/gRPC-gateway derived).
 */
@service(#{ title: "NX Playground Media API" })
namespace media;

@error
@doc("Standard error envelope (gRPC-gateway rpcStatus equivalent)")
model RpcStatus {
  code?: int32;
  message?: string;
  details?: Record<unknown>[];
}

@doc("Supported image formats")
enum ImageFormat { NOT_SUPPORT, PNG, GIF, JPEG, WEBP, SVG, HEIC }

@doc("Image metadata")
model ImageMetadata {
  @doc("width > 0 and < 10000") width?: int64;
  @doc("height > 0 and < 10000") height?: int64;
  format?: ImageFormat;
  @doc("size > 0 and < 10MB (uint64 as string)") size?: string;
  @doc("RFC3339") uploadTime?: string;
}

model ImageStatus {
  @doc("non-empty; letters, digits, hyphen only") imageId?: string;
  metadata?: ImageMetadata;
  @doc("at least one element") variants?: Record<string>;
}

model SignedUrl {
  @doc("non-empty; letters, digits, hyphen only") imageId?: string;
  @doc("non-empty; HTTP or HTTPS URL") signedUrl?: string;
}

@doc("One image to upload")
model UploadImage {
  contentType?: ImageFormat;
  @doc("size > 0 and < 10MB") size?: string;
  width?: int64;
  height?: int64;
  latitude?: float64;
  longitude?: float64;
}

model BatchDeleteRequest { imageIds?: string[]; }
model BatchDeleteResponse { message?: string; }
model ClearResponse { message?: string; }
model DeleteResponse { message?: string; }
model ImageResponse { uri?: string; }
model StatusRequest { imageIds?: string[]; }
model StatusResponse { images?: ImageStatus[]; }
model UploadRequest { images?: UploadImage[]; }
model UploadResponse { images?: SignedUrl[]; }

@doc("Image service")
@route("/media/image")
@tag("media")
interface Images {
  @summary("Batch delete images")
  @route("/_batch_delete")
  @post batchDelete(@body body: BatchDeleteRequest): BatchDeleteResponse | RpcStatus;

  @summary("Complete upload / report image status")
  @route("/_complete")
  @post complete(@body body: StatusRequest): StatusResponse | RpcStatus;

  @summary("Get image URI by id")
  @route("/{id}")
  @get getImageUri(@path id: string, @query variant?: string): ImageResponse | RpcStatus;

  @summary("Delete image by id")
  @route("/{imageId}")
  @delete delete(@path imageId: string): DeleteResponse | RpcStatus;

  @summary("Clear staged signed-url uploads")
  @route("/signed-url")
  @delete clear(): ClearResponse | RpcStatus;

  @summary("Batch create signed upload URLs")
  @route("/signed-url/_batch")
  @post batchUpload(@body body: UploadRequest): UploadResponse | RpcStatus;
}
