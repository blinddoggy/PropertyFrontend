import { useState } from "react";

export function useLocalStorage(key: string, initialValue: any) {
	const [storedValue, setStroredValue] = useState(() => {
		try {
			const item = window.localStorage.getItem(key);
			return item ? JSON.parse(item) : initialValue;
		} catch (error) {
			return initialValue;
		}
	});

	const setValue = (value: any) => {
		try {
			setStroredValue(value);
			window.localStorage.setItem(key, JSON.stringify(value));
		} catch (error) {
			console.error(error);
		}
	};

	return [storedValue, setValue];
}
