import { useEffect, useState } from "react";

const useDebounce = <T>(value: T, delay: number) => {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        setIsSaving(true);
        const handler = setTimeout(() => {
            setDebouncedValue(value);
            setIsSaving(false);
        }, delay);

        return () => {
            clearTimeout(handler);
            setIsSaving(false);
        };
    }, [value, delay]);

    return {
        debouncedValue,
        isSaving,
    };
};

export default useDebounce;
