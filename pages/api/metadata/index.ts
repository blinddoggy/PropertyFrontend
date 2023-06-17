import type { NextApiRequest, NextApiResponse } from 'next';

import { ProjectFormPinata } from '@/interfaces/interfaces';

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<ProjectFormPinata[]>
) {
	const apiUrl = 'https://api.pinata.cloud/data/pinList?includeCount=false';
	const Authorization = process.env.PINATA_API_BEARER_JWT || '';

	try {
		const response = await fetch(apiUrl, { headers: { Authorization } });
		const data = await response.json();

		const projects: ProjectFormPinata[] = data.rows.map((row: any) => ({
			id: row.ipfs_pin_hash,
			name: row.metadata.name,
			image: `https://ipfs.io/ipfs/${row.ipfs_pin_hash}`,
			metadata: row.metadata.keyvalues,
		}));

		// const projectsJSON = JSON.stringify(projects);
		res.status(200).json(projects);
	} catch (error) {
		console.error('Error al obtener los datos de Pinata API:', error);
	}
}
