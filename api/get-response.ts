export const maxDuration = 300;

export default async function handler(req: Request) {
    if (req.method !== "POST") return new Response("Method Not Allowed", { status: 405 });
    const ac = new AbortController();
    const upstream = await fetch(process.env.VITE_API_BASE_URL + "/get-response", {
        method: "POST",
        headers: {
            "content-type": "application/json",
            "accept": "text/event-stream",
            authorization: req.headers.get("authorization") || "",
        },
        body: req.body,
        signal: ac.signal,
    });

    (req as any).signal?.addEventListener("abort", () => ac.abort(), { once: true });

    const headers = new Headers(upstream.headers);
    headers.set("Cache-Control", "no-store, no-transform");
    headers.set("Content-Type", "text/event-stream; charset=utf-8");
    headers.delete("Content-Length");

    return new Response(upstream.body, { status: upstream.status, headers });
}