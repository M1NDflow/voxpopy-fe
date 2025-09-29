function sseEventSplitter() {
    let buf = '';               // current partial line buffer
    let eventLines: string[] = []; // lines of the current SSE event

    return new TransformStream<string, string>({
        transform(chunk, controller) {
            buf += chunk;

            // split into lines handling CRLF and LF; keep last partial line in buf
            const parts = buf.split(/\r?\n/);
            buf = parts.pop() ?? '';

            for (const lineRaw of parts) {
                const line = lineRaw;

                if (line === '') {
                    if (eventLines.length) {
                        controller.enqueue(eventLines.join('\n'));
                        eventLines = [];
                    } else {
                    }
                } else {
                    eventLines.push(line);
                }
            }
        },
        flush(controller) {
            if (eventLines.length) controller.enqueue(eventLines.join('\n'));
        }
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
        .pipeThrough(sseEventSplitter())              // split SSE frames
        .getReader();                              // simple reader

    while (true) {
        const { value, done } = await reader.read();

        if (value !== undefined) {
            const lines = value.split(/\r?\n/);

            const isCommentOnly = lines.every(l => l.trimStart().startsWith(':'));
            if (!isCommentOnly) {
                const data = lines
                    .filter(l => l.startsWith('data:'))
                    .map(l => l.slice(5).replace(/^\s/, ''))
                    .join('\n');

                if (data) {
                    onUpdate(data, done);
                }
            }
        }
        if (done) {
            onUpdate(null, true);
            break;
        }
    }
}