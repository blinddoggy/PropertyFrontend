import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<any>
) {
	const { hash } = req.query;
	const { name } = req.query;

	const apiUrl = 'https://api.pinata.cloud/data/pinList?includeCount=false';
	const Authorization = process.env.PINATA_API_BEARER_JWT || '';

	try {
		const response = await fetch(apiUrl, { headers: { Authorization } });
		const data = await response.json();

		const project: ApiData = data.rows.filter(
			(thisProject: ApiData) => thisProject.ipfs_pin_hash === hash
		)[0];

		const marketplaceFormat: MarketplaceMetadataFormat =
			mapApiDataToMarketplaceMetadataFormat(project);

		res.status(200).json(marketplaceFormat);
	} catch (error) {
		console.error('Error al obtener los datos de Pinata API:', error);
	}
}

interface ApiData {
	id: string;
	ipfs_pin_hash: string;
	size: number;
	user_id: string;
	date_pinned: string;
	date_unpinned: string | null;
	metadata: {
		name: string;
		keyvalues: { [key: string]: string };
	};
	regions: {
		regionId: string;
		currentReplicationCount: number;
		desiredReplicationCount: number;
	}[];
}

interface MarketplaceMetadataFormat {
	name: string;
	description: string;
	image: string;
	attributes: {
		trait_type: string;
		value: string;
	}[];
}

function mapApiDataToMarketplaceMetadataFormat(
	apiData: ApiData
): MarketplaceMetadataFormat {
	const marketplaceFormat: MarketplaceMetadataFormat = {
		name: apiData.metadata.name,
		description: apiData.metadata.keyvalues.description,
		image: `https://ipfs.io/ipfs/${apiData.ipfs_pin_hash}`,
		attributes: [],
	};

	for (const key in apiData.metadata.keyvalues) {
		if (key !== 'description') {
			marketplaceFormat.attributes.push({
				trait_type: key,
				value: apiData.metadata.keyvalues[key],
			});
		}
	}

	return marketplaceFormat;
}
