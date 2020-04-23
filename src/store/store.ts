class Store {
    private store: Record<string, string> = {};
    constructor() {
        this.store = {};
    }

    set(id: string, value: string) {
        this.store[id] = value;
    }

    get(id: string): string {
        return this.store[id];
    }

    delete(id: string) {
        delete this.store[id];
    }
}

export const store: Store = new Store();
