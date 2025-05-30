export const saveToStorage = async <T>(
    key: string,
    value: T
): Promise<void> => {
    try {
        const serializedValue = JSON.stringify(value);
        localStorage.setItem(key, serializedValue);
    } catch (error) {
        console.error(`Error saving to storage with key "${key}":`, error);
    }
};

export const loadFromStorage = async <T>(
    key: string
): Promise<T | undefined> => {
    try {
        const serializedValue = localStorage.getItem(key);
        return serializedValue ? (JSON.parse(serializedValue) as T) : undefined;
    } catch (error) {
        console.error(`Error getting from storage with key "${key}":`, error);
        return undefined;
    }
};
