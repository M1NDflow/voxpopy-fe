export const config = { runtime: "edge", maxDuration: 300 };

export default async function handler(req: Request) {
    if (req.method !== "POST") return new Response("Method Not Allowed", { status: 405 });

    const upstream = await fetch("https://voxpopy-agent.onrender.com/get-response", {
        method: "POST",
        headers: {
            "content-type": "application/json",
            authorization: req.headers.get("authorization") || "",
        },
        body: req.body,
    });

    const headers = new Headers(upstream.headers);
    headers.set("Cache-Control", "no-store");
    headers.set("Content-Type", "text/event-stream; charset=utf-8");
    headers.delete("Content-Length");

    return new Response(upstream.body, { status: upstream.status, headers });
}