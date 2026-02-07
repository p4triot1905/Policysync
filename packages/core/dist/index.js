export function hlcNow(actorId, last) {
    // Create a monotonic timestamp even if the system clock moves backward
    const now = Date.now();
    if (!last)
        return { t: now, c: 0, a: actorId };
    if (now > last.t)
        return { t: now, c: 0, a: actorId };
    return { t: last.t, c: last.c + 1, a: actorId };
}
export function hlcCompare(x, y) {
    // Deterministic ordering: time, counter, actor id
    if (x.t !== y.t)
        return x.t < y.t ? -1 : 1;
    if (x.c !== y.c)
        return x.c < y.c ? -1 : 1;
    if (x.a !== y.a)
        return x.a < y.a ? -1 : 1;
    return 0;
}
export function lwwSet(cur, next) {
    // Apply LWW rule deterministically
    if (!cur)
        return next;
    return hlcCompare(cur.ts, next.ts) >= 0 ? cur : next;
}
export class InMemoryStore {
    tasks = new Map();
    upsertTask(id, title) {
        const cur = this.tasks.get(id);
        const mergedTitle = lwwSet(cur?.title, title);
        this.tasks.set(id, { id, title: mergedTitle });
    }
    getTask(id) {
        return this.tasks.get(id);
    }
}
export * from "./op.js";
export * from "./oplog.js";
//# sourceMappingURL=index.js.map