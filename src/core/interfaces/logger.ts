export interface Logger{
    store(key: string, value: Object): void;
    get(key: string): Object | null;
}