export type ActorId = string;
export type HLC = {
    t: number;
    c: number;
    a: ActorId;
};
export declare function hlcNow(actorId: ActorId, last?: HLC): HLC;
export declare function hlcCompare(x: HLC, y: HLC): number;
export type LWW<T> = {
    v: T;
    ts: HLC;
};
export declare function lwwSet<T>(cur: LWW<T> | undefined, next: LWW<T>): LWW<T>;
export type Task = {
    id: string;
    title: LWW<string>;
};
export declare class InMemoryStore {
    private tasks;
    upsertTask(id: string, title: LWW<string>): void;
    getTask(id: string): Task | undefined;
}
export * from "./op.js";
export * from "./oplog.js";
//# sourceMappingURL=index.d.ts.map