export const saveToStorage = async <T>(
    key: string,
    value: T
): Promise<void> => {
    try {
        // const serializedValue = JSON.stringify(value);
        // localStorage.setItem(key, serializedValue);
        console.log(`Saving value to storage with key "${key}":`, value);
        history.replaceState(
            {
                [key]: value,
            },
            "",
            `?session=${key}`
        );
    } catch (error) {
        console.error(`Error saving to storage with key "${key}":`, error);
    }
};

export const loadFromStorage = <T>(key: string): T | undefined => {
    try {
        // const serializedValue = localStorage.getItem(key);
        // return serializedValue ? (JSON.parse(serializedValue) as T) : undefined;
        const value = history.state?.[key] as T;
        console.log(`Loaded value from storage with key "${key}":`, value);
        return value !== null ? value : undefined;
    } catch (error) {
        console.error(`Error getting from storage with key "${key}":`, error);
        return undefined;
    }
};
