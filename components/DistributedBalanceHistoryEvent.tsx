import React, { useEffect, useState } from 'react';
import Image from 'next/image';
// import ProjectCardSlider from './ProjectCardSlider';
// import { useRouter } from 'next/router';

import { ethers } from 'ethers';

import {
	getEventHistory,
	ContractEventNames,
	parseHexToDecimal,
	parseWeiHexToEthers,
} from '@/utils/PropertyMaster/methods';

interface ProjectHistoryEventProps {
	contractAddress: string;
	filterByIpfsHash?: string;
	// project: ProjectFormPinata;
}

interface DistributedBalanceEvent {
	success: boolean;
	name: string;
	balance: { _isBigNumber: boolean; _hex: string };
	totalSupply: { _isBigNumber: boolean; _hex: string };
	ipfsHash: { _isIndexed: boolean; hash: string };
	srcImage: string;
}

interface DTO_DistributedBalanceEvent {
	success: boolean;
	name: string;
	balance: string;
	totalSupply: number;
	ipfsHash: string;
	srcImage: string;
}

const distributedBalanceToDTO = (
	distributedBalanceEvent: DistributedBalanceEvent
): DTO_DistributedBalanceEvent => {
	const DTO: DTO_DistributedBalanceEvent = {
		success: distributedBalanceEvent.success,
		balance: parseWeiHexToEthers(distributedBalanceEvent.balance._hex),
		totalSupply: parseHexToDecimal(
			distributedBalanceEvent.totalSupply._hex,
			0
		) as number,
		ipfsHash: distributedBalanceEvent.ipfsHash.hash,
		name: distributedBalanceEvent.name,
		srcImage: distributedBalanceEvent.srcImage,
	};
	console.log(DTO);
	return DTO;
};

const DistributedBalanceHistoryEvent: React.FC<ProjectHistoryEventProps> = ({
	contractAddress,
	filterByIpfsHash = '',
}) => {
	const [distributedBalance, setDistributedBalance] = useState<
		DTO_DistributedBalanceEvent[]
	>([]);

	useEffect(() => {
		setDistributedBalance([]);
		getEventHistory(
			contractAddress,
			ContractEventNames.DistributedBalance,
			filterByIpfsHash
		).then((events) => {
			events?.forEach((event) => {
				if (event.args) {
					const balanceEventResponse =
						event.args as unknown as DistributedBalanceEvent;
					setDistributedBalance((prevState) => [
						...prevState,
						distributedBalanceToDTO(balanceEventResponse),
					]);
				}
			});
		});
	}, [contractAddress, filterByIpfsHash]);

	return (
		<div className="container mx-auto px-4">
			<h1 className="text-2xl font-bold">Historial de Distribuciones</h1>
			{distributedBalance.length > 0 ? (
				<ul className="mt-4 space-y-2">
					{distributedBalance.map((property, index) => (
						<div
							key={index}
							className="bg-slate-200 rounded-lg shadow-md px-4 py-2 max-w-md mb-4">
							{/* <div className="flex items-center "> */}
							<div className="flex gap-2">
								<div className="bg-gray-400 rounded-full w-12 h-12 overflow-hidden shadow-md">
									<Image
										src={property.srcImage.substring(
											0,
											property.srcImage.length / 2
										)}
										alt={property.ipfsHash}
										className="w-12 h-12 object-fill"
										width={500}
										height={500}
									/>
								</div>

								<div className="h-full">
									<p className="text-gray-800 font-semibold">{property.name}</p>
									<p className="text-gray-600 text-md my-auto line-clamp-1">
										{property.balance} distribuiodo a {property.totalSupply}{' '}
										cuentas.
									</p>
								</div>
								<div
									className={`rounded-full ml-auto ${
										property.success ? 'bg-green-500' : 'bg-red-500'
									} py-1 px-2 flex items-center justify-center`}>
									<p
										className={`text-white text-sm ${
											property.success ? 'font-bold' : 'font-medium'
										}`}>
										{property.success ? 'Success' : 'Fail'}
									</p>
								</div>
							</div>
							{/* </div> */}
						</div>
					))}
				</ul>
			) : (
				<p className="mt-4">No se encontró ninguna distribución.</p>
			)}
		</div>
	);
};

export default DistributedBalanceHistoryEvent;

export async function getServerSideProps() {
	const contractAddress = (process.env.MASTER_PROPERTY_TOKEN as string) || '';
	return {
		props: {
			contractAddress,
		},
	};
}
