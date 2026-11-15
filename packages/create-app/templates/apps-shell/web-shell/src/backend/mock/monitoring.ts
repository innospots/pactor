import data from "../fixtures/monitoring.json";
export function GET() { return Response.json(data, { headers: { "cache-control": "no-store" } }); }
