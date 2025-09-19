function splitBy(delim: string) {
    let buf = '';
    return new TransformStream<string, string>({
        transform(chunk, controller) {
            buf += chunk;
            for (let i = buf.indexOf(delim); i !== -1; i = buf.indexOf(delim)) {
                controller.enqueue(buf.slice(0, i));
                buf = buf.slice(i + delim.length);
            }
        },
        flush(controller) { if (buf) controller.enqueue(buf); }
    });
}

export async function streamSSE(url: string, body: any, onUpdate: (p: any, done?: boolean) => void) {
    const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'text/event-stream' },
        body: JSON.stringify(body),
    });
    if (!res.body) throw new Error('No body');

    const reader = res.body
        .pipeThrough(new TextDecoderStream())      // bytes -> text
        .pipeThrough(splitBy('\n\n'))              // split SSE frames
        .getReader();                              // simple reader

    while (true) {
        const { value, done } = await reader.read();
        if (value == undefined) {
            if (done) {
                onUpdate(null, true);
                break;
            }
            continue;
        }
        if (value) {
            const lines = value.split('\n').map(l => l.trim()).filter(Boolean);
            const data = lines.filter(l => l.startsWith('data:')).map(l => l.slice(5).trim()).join('\n');
            onUpdate(data, done);
        }
        if (done) {
            onUpdate(null, true);
            break;
        }
    }
}