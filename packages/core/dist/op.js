export function opId(actor, ts) {
    // Stable op id format
    return `${actor}:${ts.t}:${ts.c}`;
}
//# sourceMappingURL=op.js.map