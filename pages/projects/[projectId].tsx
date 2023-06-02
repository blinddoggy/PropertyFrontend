import { ChangeEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';

import Header from '@/components/Header';
import Layout from '@/components/Layout';
import Button from '@/components/Button';
import Input from '@/components/Input';
import { useLocalStorage } from '@/hooks/useLocalStorage';

import ProjectCopyButton from '@/components/ProjectCopyButton';

import {
	ProjectFromPropertyMaster,
	ProjectFormPinata,
} from '@/interfaces/interfaces';

import * as Contract from '@/utils/PropertyMaster/methods';
import DistributedBalanceHistoryEvent from '@/components/DistributedBalanceHistoryEvent';

interface ProjectDetailProps {
	contractAddress: string;
}

const ProjectDetail: React.FC<ProjectDetailProps> = ({ contractAddress }) => {
	const router = useRouter();
	const [storedProject] = useLocalStorage('projects', {});
	const [metadata, setMetadata] = useState<ProjectFormPinata>();
	const [project, setProject] = useState<ProjectFromPropertyMaster>();
	const [currentAccount, setCurrentAccount] = useState('');
	const [sendToAddress, setSendToAddress] = useState('');

	const [statusDistribute, setStatusDistribute] = useState<boolean | null>(
		null
	);

	useEffect(() => {
		const { projectId } = router.query;
		const loadMetadata = async () => {
			try {
				const currentMetadata: ProjectFormPinata = await storedProject.filter(
					(project: ProjectFormPinata) => project.id === projectId
				)[0];

				setMetadata(currentMetadata);
			} catch (error) {
				console.error(error);
			}
		};
		loadMetadata();
	}, [router.query, storedProject]);

	useEffect(() => {
		Contract.connectWallet().then((account) => setCurrentAccount(account));
	}, []);

	useEffect(() => {
		if (!contractAddress || !metadata?.id) return;
		Contract.getPropertyProject(contractAddress, metadata.id).then((project) =>
			setProject(project)
		);
	}, [metadata, currentAccount, contractAddress]);

	const handleDistributeBalance = async () => {
		if (metadata?.id) {
			const ok = await Contract.distributeBalance(contractAddress, metadata.id);
			setStatusDistribute(ok);
		}
	};

	const handleTransferNFT = async () => {
		if (!metadata?.id || !currentAccount || !sendToAddress) return;
		const ok = await Contract.transferNFT(
			contractAddress,
			metadata.id,
			currentAccount,
			sendToAddress
		);
		// setStatusDistribute(ok);
	};

	const Loading = () => {
		const [loadingError, setLoadingError] = useState('');
		setTimeout(() => {
			if (!currentAccount) {
				setLoadingError('Revisa tu sesión de metamask');
			} else if (!metadata) {
				setLoadingError('No encontramos tu proyecto en el IPFS');
			} else if (!project) {
				setLoadingError('No encontramos tu proyecto en el contrato');
			}
		}, 2000);

		return (
			<div className="flex items-center justify-center h-screen ">
				<div className="bg-white w-80 h-60 p-8 rounded-lg shadow-lg">
					<div className="animate-spin rounded-full mx-auto mb-4 h-16 w-16 border-t-2 border-b-2 border-slate-300"></div>
					<h2 className="text-3xl text-center font-bold mb-2">Cargando...</h2>
					<p
						className={`text-sm text-center transition-opacity duration-1000 ${
							loadingError ? '' : ' opacity-0'
						}`}>
						{loadingError}
					</p>
				</div>
			</div>
		);
	};

	if (!project || !metadata || !currentAccount) {
		return <Loading />;
	}

	return (
		<Layout>
			<Header showBackArrow label={project.name || 'No name'} />
			<div className="px-4">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div className="mb-4 relative overflow-hidden border-2 rounded-2xl">
						<div className="absolute right-3 top-2 shadow-md w-10 h-10 rounded-full bg-white flex items-center justify-center">
							<p className="text-lg font-bold">
								{project &&
									Contract.parseHexToDecimal(project.balanceERC721._hex, 0)}
							</p>
						</div>
						<div className=" aspect-square">
							<Image
								width={500}
								height={500}
								className="object-cover h-full"
								src={metadata.image}
								alt={metadata.name}
							/>
						</div>
					</div>
					<div>
						<div className="flex flex-row justify-between">
							<div>
								<h1 className="text-3xl sm:text-4xl font-bold mb-2 line-clamp-2">
									{project?.name || "Property doesn't exist"}
								</h1>
							</div>
						</div>

						{/* Metadata */}
						<div className="my-2">
							<ul className="mt-2 bg-slate-200 rounded-md px-2 py-1">
								<p className="text-sm text-gray-600 font-semibold">Metadata</p>
								<div className="flex flex-wrap wrap">
									{metadata.metadata &&
										Object.entries(metadata.metadata).map(([key, value]) => (
											<li key={key} className="mr-2 w-auto ">
												<p className="text-sm font-semibold text-gray-600">
													<strong>{key}: </strong>
													<span className="text-sm">{value}</span>
												</p>
											</li>
										))}
								</div>
							</ul>
						</div>

						{/* Balance */}
						<div className="flex flex-row justify-between bg-slate-200 rounded-md my-1 px-2 py-1">
							<div className="flex-col mr-2">
								<p className="text-sm text-gray-600 font-semibold">Balance</p>
								<p className="text-lg font-bold">
									{project &&
										Contract.parseWeiHexToEthers(
											project.balanceERC20._hex,
											4
										)}{' '}
									{project?.symbol || "Property doesn't exist"}
									{/* {statusRepartir === null && <p> está null </p>} */}
									{/* {statusRepartir ? <p>sizas...</p> : <p>nonas...</p>} */}
								</p>
							</div>
							<div className="flex items-center ">
								<Button label="Distribute" onClick={handleDistributeBalance} />
							</div>
						</div>

						{/* send token */}
						{/* <div className="flex flex-row justify-between bg-slate-200 rounded-md my-2 px-2 py-2">
							<div className="flex-col mr-2">
								<p className="text-sm text-gray-600 mb-1 font-semibold">
									Enviar a:
								</p>
								<Input
									value={sendToAddress}
									placeholder="Address Account 0x..."
									onChange={(e: any) => setSendToAddress(e.target.value)}
								/>
							</div>
							<div className="flex items-center ">
								<Button label="Send" onClick={handleTransferNFT} />
							</div>
						</div> */}

						{/* token address */}
						<div className="my-2">
							<div className="bg-slate-200 rounded-md p-2">
								<p className="text-sm text-gray-600 font-semibold mb-1">
									Dirección de Contrato
								</p>
								<div className="">
									<ProjectCopyButton
										initialButtonLabel={Contract.abbreviateNftAddress(
											project?.nftAddress
										)}
										toCopy={project?.nftAddress}
										hoverLabel="Copiar Dirección"
									/>
								</div>
							</div>
						</div>
					</div>

					<div className="md:col-span-2 w-full">
						<DistributedBalanceHistoryEvent
							contractAddress={contractAddress}
							filterByIpfsHash={metadata.id}
						/>
					</div>
				</div>
			</div>
		</Layout>
	);
};
export default ProjectDetail;

export async function getServerSideProps() {
	const contractAddress = (process.env.MASTER_PROPERTY_TOKEN as string) || '';
	return {
		props: {
			contractAddress,
		},
	};
}
