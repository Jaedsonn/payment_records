export interface Logger{
    store(key: string, value: object): void;
    get(key: string): object | null;
}