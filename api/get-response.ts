export const config = { runtime: "edge" };

export default async function handler(req: Request) {
    if (req.method !== "POST") return new Response("Method Not Allowed", { status: 405 });

    const upstream = await fetch("https://voxpopy-agent.onrender.com/get-response", {
        method: "POST",
        headers: {
            "content-type": "application/json",
            // forward auth if you use it
            authorization: req.headers.get("authorization") || "",
        },
        // important: stream the body through; do NOT JSON.stringify again
        body: req.body,
    });

    // Pass the stream straight through to the browser
    const headers = new Headers(upstream.headers);
    headers.set("Cache-Control", "no-store");
    headers.set("Content-Type", "text/event-stream; charset=utf-8");
    headers.delete("Content-Length"); // streaming

    return new Response(upstream.body, { status: upstream.status, headers });
}