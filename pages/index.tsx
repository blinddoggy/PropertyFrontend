import Header from '@/components/Header';
import Layout from '@/components/Layout';

import useProfileData from '@/hooks/useProfileData';
import {
	getEventHistory,
	ContractEventNames,
} from '@/utils/PropertyMaster/methods';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import DistributedBalanceHistoryEvent from '@/components/DistributedBalanceHistoryEvent';

interface HomeProps {
	contractAddress: string;
}

const Home: React.FC<HomeProps> = ({ contractAddress }) => {
	const user = useProfileData();

	interface NewPropertyEvent {
		ipfsHash: { _isIndexed: boolean; hash: string };
		nftAddress: string;
		name: string;
		timestamp: { _isBigNumber: boolean; _hex: string };
		srcImage: string;
	}

	const [newProperties, setNewProperties] = useState<NewPropertyEvent[]>([]);

	const parseHexToDecimal = (hex: string, decimals: number = 3): string => {
		const decimal = parseInt(hex, 16);
		return decimal.toFixed(decimals);
	};

	useEffect(() => {
		setNewProperties([]);
		getEventHistory(
			contractAddress,
			ContractEventNames.NewPropertyCreated
		).then((events) => {
			events?.forEach((event) => {
				const { ipfsHash, nftAddress, name, timestamp, srcImage } = event.args!;
				setNewProperties((prevState) => [
					...prevState,
					{ ipfsHash, nftAddress, name, timestamp, srcImage },
				]);
			});
		});
	}, [contractAddress]);

	return (
		<Layout>
			<Header label="Home" />

			<div className="container mx-auto px-4">
				<h1 className="text-2xl font-bold">Historial de Nuevas Propiedades</h1>
				{newProperties.length > 0 ? (
					<ul className="mt-4 space-y-2">
						{newProperties.map((property) => (
							<div
								key={property.ipfsHash.hash}
								className="bg-slate-200 rounded-lg shadow-md px-4 py-2 max-w-md mb-4">
								<div className="flex items-center ">
									<div className="bg-gray-400 rounded-full w-12 h-12 overflow-hidden shadow-md">
										<Image
											src={property.srcImage.substring(
												0,
												property.srcImage.length / 2
											)}
											alt={property.ipfsHash.hash}
											className="w-12 h-12 object-cover"
											width={50}
											height={50}
										/>
									</div>
									<div className="ml-2">
										<p className="text-gray-800 font-semibold">
											{property.name}
										</p>
										{/* <p className="text-gray-600 text-md line-clamp-1">
											{property.nftAddress}
										</p> */}
										{/* <p className="text-gray-600 text-md line-clamp-1">
											{property.ipfsHash.hash}
										</p> */}
										<p className="text-gray-500 text-sm">
											{new Date(
												parseInt(
													parseHexToDecimal(property.timestamp._hex, 0)
												) * 1000
											).toLocaleString()}
										</p>
									</div>
								</div>
							</div>
						))}
					</ul>
				) : (
					<p className="mt-4">No se encontró ninguna propiedad.</p>
				)}
			</div>

			<div className="container mt-4">
				<DistributedBalanceHistoryEvent contractAddress={contractAddress} />
			</div>
		</Layout>
	);
};

export default Home;

export async function getServerSideProps() {
	const contractAddress = (process.env.MASTER_PROPERTY_TOKEN as string) || '';
	return {
		props: {
			contractAddress,
		},
	};
}
