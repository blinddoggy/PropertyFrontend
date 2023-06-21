import Layout from '@/components/Layout';
import Header from '@/components/Header';

import axios from 'axios';
import React, { useState, useCallback, useEffect } from 'react';

import fs from 'fs';

import Input from '@/components/Input';
import Button from '@/components/Button';
import {
	MdFormatListBulletedAdd,
	MdOutlineDeleteForever,
} from 'react-icons/md';
import {
	connectWallet,
	createNewProperty,
	ContractEventNames,
	subscribeToContractEvent,
	unsubscribeToContractEvent,
} from '@/utils/PropertyMaster/methods';
import Loading from '@/components/Loading';
import { useRouter } from 'next/router';
import Link from 'next/link';

interface NewProjectProps {
	contractAddress: string;
}

const NewProject: React.FC<NewProjectProps> = ({ contractAddress }) => {
	const router = useRouter();

	const [name, setName] = useState('');
	const [amount, setAmount] = useState('');
	const [acronym, setAcronym] = useState('');
	const [description, setDescription] = useState('');
	const [isLoading, setIsLoading] = useState(false);

	const [selectedFile, setSelectedFile] = useState(null);
	const [pinataHash, setPinataHash] = useState(null);

	const [loadingMessage, setLoadingMessage] = useState<string>('');

	const [logProgressSaving, setLogProgressSaving] = useState<string[]>([]);

	const [currentAccount, setCurrentAccount] = useState('');
	const [newPropertyAddress, setNewPropertyAddress] = useState();

	useEffect(() => {
		connectWallet().then((account) => setCurrentAccount(account));
	}, []);

	// useEffect(() => {
	// 	const eventHandler = (event: any) => {
	// 		router.replace('/projects');
	// 	};

	// 	subscribeToContractEvent(
	// 		contractAddress,
	// 		ContractEventNames.NewPropertyCreated,
	// 		eventHandler
	// 	);

	// 	return () => {
	// 		unsubscribeToContractEvent(
	// 			contractAddress,
	// 			ContractEventNames.NewPropertyCreated,
	// 			eventHandler
	// 		);
	// 	};
	// }, [contractAddress, router]);

	interface KeyValues {
		name: string;
		value: string;
	}
	const [metadataInputs, setMetadataInputs] = useState<KeyValues[]>([]);

	const handleAddInput = () => {
		setMetadataInputs([...metadataInputs, { name: '', value: '' }]);
	};

	const handleRemoveInput = (index: number) => {
		const newInputs = [...metadataInputs];
		newInputs.splice(index, 1);
		setMetadataInputs(newInputs);
	};

	const handleInputChange = (index: number, name: string, value: string) => {
		const newInputs = [...metadataInputs];
		newInputs[index] = { name, value };
		setMetadataInputs(newInputs);
	};

	const handleFileChange = (event: any) => {
		setSelectedFile(event.target.files[0]);
	};

	const onSubmit = useCallback(async () => {
		const generatePinataMetadata = () => {
			const keyvalues = {};
			keyvalues['description'] = description;
			metadataInputs.forEach((input) => {
				keyvalues[input.name] = input.value;
			});

			const jsonStructure = JSON.stringify({
				name,
				keyvalues,
			});

			return jsonStructure;
		};

		const addLogProgressSaving = (newLog) => {
			setLogProgressSaving((prevState) => [...prevState, newLog]);
		};

		const getApiToken = async () => {
			const getTokenResponse = await axios.get('../api/token');
			if (getTokenResponse.status === 200) {
				const { JWT } = getTokenResponse.data;
				return JWT;
			}
			throw new Error('Failed to get token');
		};

		const getMetadataJson = async (hash: string) => {
			const jsonMetadata = await axios.get(`../api/metadata/${hash}`);
			if (jsonMetadata.status === 200) {
				return JSON.stringify(jsonMetadata.data);
			}
			throw new Error('Failed to get token');
		};

		const pinFileToIPFS = async (JWT, formData) => {
			try {
				const res = await axios.post(
					'https://api.pinata.cloud/pinning/pinFileToIPFS',
					formData,
					{
						headers: {
							'Content-Type': 'multipart/form-data',
							Authorization: JWT,
						},
					}
				);
				const { IpfsHash } = res.data;

				return IpfsHash;
			} catch (error) {
				console.error(error);
			}
		};

		const validateEmptyInputs = () => {
			if (!selectedFile || !name || !acronym || !amount) {
				throw 'Todos los campos son obligatorios.';
			}
		};

		try {
			validateEmptyInputs();

			const JWT = await getApiToken();
			addLogProgressSaving('Token obtenido exitosamente.');

			const formData = new FormData();
			formData.append('file', selectedFile!);
			formData.append('pinataMetadata', generatePinataMetadata());
			formData.append('pinataOptions', JSON.stringify({ cidVersion: 0 }));

			addLogProgressSaving('Cargando imagen a IPFS...');
			const hash = await pinFileToIPFS(JWT, formData);
			addLogProgressSaving('Imagen cargada a IPFS correctamente.');
			setPinataHash(hash);

			addLogProgressSaving('Creando metadata del NFT.');
			const jsonMetadata = await getMetadataJson(hash);

			const blob = new Blob([jsonMetadata], { type: 'application/json' });
			const jsonFile = new File([blob], `${hash}.json`);
			const jsonFormData = new FormData();
			jsonFormData.append('file', jsonFile);

			addLogProgressSaving('Cargando metadata a IPFS...');
			const jsonHash = await pinFileToIPFS(JWT, jsonFormData);
			addLogProgressSaving('Metadata cargada a IPFS correctamente.');

			addLogProgressSaving('Iniciando creación del nuevo Property Token.');
			const address = await createNewProperty(
				contractAddress,
				name,
				acronym,
				jsonHash,
				amount,
				`https://ipfs.io/ipfs/${jsonHash}`
			);

			addLogProgressSaving('Property Token creado exitosamente.');
			addLogProgressSaving('Espera la validación de nodos.');
			console.log(address);
			setNewPropertyAddress(address);
			// router.replace('/projects');
		} catch (error) {
			console.error(error);
		} finally {
			setIsLoading(false);
		}
	}, [
		selectedFile,
		name,
		description,
		acronym,
		amount,
		metadataInputs,
		contractAddress,
	]);

	const bodyContent = (
		<div className="flex flex-col gap-2">
			<Input
				placeholder="Nombre"
				value={name}
				disabled={isLoading}
				onChange={(e) => {
					setName(e.target.value);
				}}
			/>
			<Input
				placeholder="Descripción"
				value={description}
				disabled={isLoading}
				onChange={(e) => {
					setDescription(e.target.value);
				}}
			/>
			<Input
				placeholder="Cantidad"
				value={amount}
				type="number"
				disabled={isLoading}
				onChange={(e) => {
					setAmount(e.target.value);
				}}
			/>
			<Input
				placeholder="Acronimo"
				value={acronym}
				disabled={isLoading}
				onChange={(e) => {
					setAcronym(e.target.value);
				}}
			/>
			<Input
				placeholder="Image File"
				type="file"
				accept="image/*"
				disabled={isLoading}
				onChange={handleFileChange}
			/>
		</div>
	);

	if (!currentAccount || isLoading || !contractAddress)
		return <Loading loadingMessage={loadingMessage} />;

	if (logProgressSaving.length > 0) {
		return (
			<Layout contractAddress={contractAddress}>
				<Header showBackArrow label="Crear Nuevo Proyecto" />

				<div className="p-4 h-auto border-0 rounded-lg shadow-lg overflow-hidden flex flex-col bg-black m-2 outline-none focus:outline-none ">
					<div className="mb-3">
						{logProgressSaving.map((log, index) => (
							<p className="text-white" key={index}>
								{log}
							</p>
						))}
						{newPropertyAddress && (
							<Link
								target="_blank"
								href={`https://bscscan.com/address/${contractAddress}`}>
								<span className="text-slate-400 hover:underline">
									Click para ir a Bscscan.
								</span>
							</Link>
						)}
					</div>
				</div>
			</Layout>
		);
	}

	return (
		<Layout contractAddress={contractAddress}>
			<Header showBackArrow label="Crear Nuevo Proyecto" />

			<div className=" h-auto border-0 rounded-lg shadow-lg overflow-hidden flex flex-col bg-black m-2 outline-none focus:outline-none ">
				<div className="">
					{/* Body */}
					<div className="p-4 flex-auto ">
						{bodyContent}
						<div className="my-2 p-2 border-2 border-neutral-800 rounded-md">
							<div className="flex flex-row justify-between mb-2">
								<h1 className="text-xl font-semibold text-white  ">Metadata</h1>
								<button
									title="Agregar metadata"
									onClick={handleAddInput}
									className=" p-1 border-0 text-white hover:opacity-70 transition ">
									<MdFormatListBulletedAdd size={22} color="white" />
									<span className="sr-only">add metadata</span>
								</button>
							</div>
							{metadataInputs.map((input, index) => (
								<div key={index} className="flex flex-row gap-2 mb-2">
									<button
										title="Remover"
										onClick={() => handleRemoveInput(index)}
										className=" p-1 ml-auto border-0 text-white hover:opacity-70 transition ">
										<MdOutlineDeleteForever size={22} color="white" />
										<span className="sr-only">add metadata</span>
									</button>
									<Input
										placeholder="Llave"
										value={input.name}
										onChange={(e) =>
											handleInputChange(index, e.target.value, input.value)
										}
									/>
									<Input
										placeholder="Valor"
										value={input.value}
										onChange={(e) =>
											handleInputChange(index, input.name, e.target.value)
										}
									/>
								</div>
							))}
						</div>
					</div>
					{/* Footer */}
					<div className="flex flex-col px-4 py-4">
						<Button
							disabled={isLoading}
							label={'Guardar'}
							fullWidth
							secondary
							onClick={onSubmit}
						/>
					</div>
					{/* {footer} */}
				</div>
			</div>
		</Layout>
	);
};

export default NewProject;
export async function getServerSideProps() {
	const contractAddress = (process.env.MASTER_PROPERTY_TOKEN as string) || '';
	return {
		props: {
			contractAddress,
		},
	};
}
