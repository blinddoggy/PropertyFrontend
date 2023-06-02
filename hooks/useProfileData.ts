import { useEffect, useState } from 'react';

function useProfileData() {
	const [userData, setUserData] = useState<User | null>(null);

	interface User {
		username: string;
		name: string;
	}

	useEffect(() => {
		const fetchProfileData = async () => {
			let user = null;
			try {
				const response = await fetch('/api/profile');
				if (response.ok) {
					const data = (await response.json()) as User;
					user = data;
					setUserData(user);
				} else {
					console.error('Error al llamar a la API de perfil:', response.status);
				}
			} catch (error) {
				console.error('Error al llamar a la API de perfil:', error);
			}
		};

		fetchProfileData();
	}, []);

	return userData;
}

export default useProfileData;
