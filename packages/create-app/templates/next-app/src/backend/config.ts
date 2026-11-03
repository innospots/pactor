/** Server-side backend address and prototype mode. */
export const serverBaseUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  process.env.PACTOR_SERVER_BASE_URL ??
  "http://localhost:8106";

export const isPrototype =
  (process.env.NEXT_PUBLIC_APP_ENV ?? process.env.APP_ENV ?? "prototype") ===
  "prototype";
