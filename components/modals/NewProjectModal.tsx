import useNewProjectModal from '@/hooks/useNewProjectModalStore';
import axios from 'axios';
import { useCallback, useState } from 'react';
import Input from '../Input';
import Modal from '../Modal';

const JWT =
	'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiIxNzU2ZDVjYi1jOTQ1LTQ3NmYtYmY5OS02MGVhOTk2MGNjMjYiLCJlbWFpbCI6ImN1Y2FyYWNoYXRyYWljaW9uZXJhQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaW5fcG9saWN5Ijp7InJlZ2lvbnMiOlt7ImlkIjoiRlJBMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxfSx7ImlkIjoiTllDMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxfV0sInZlcnNpb24iOjF9LCJtZmFfZW5hYmxlZCI6ZmFsc2UsInN0YXR1cyI6IkFDVElWRSJ9LCJhdXRoZW50aWNhdGlvblR5cGUiOiJzY29wZWRLZXkiLCJzY29wZWRLZXlLZXkiOiJhMGZhZmY5YTg4ZmE2NzZlODFiYSIsInNjb3BlZEtleVNlY3JldCI6IjJmZmJjYWNmOWMzNzdkOWNhNDFmMjY2MGM3ZWI0MmViZjBhMWE4ZTEyM2U0NDUwYWMxYzkxMzQ2Y2VlMWRmNjAiLCJpYXQiOjE2ODQxNjc0Njd9.BAPiv3hdaNhSFwQRVHX7LmDjyeh9WxdiNEq973aCS4o';

const NewProjectModal = () => {
	const newProjectModal = useNewProjectModal();

	const [name, setName] = useState('');
	const [amount, setAmount] = useState('');
	const [acronym, setAcronym] = useState('');
	const [isLoading, setIsLoading] = useState(false);

	const [selectedFile, setSelectedFile] = useState(null);
	const [pinataHash, setPinataHash] = useState(null);

	const handleFileChange = (event: any) => {
		setSelectedFile(event.target.files[0]);
	};

	const onSubmit = useCallback(async () => {
		if (!selectedFile) {
			console.log('No se ha seleccionado ningún archivo.');
			return;
		}

		const pinFileToIPFS = async () => {
			let metadata = JSON.stringify({ name });

			const formData = new FormData();
			formData.append('file', selectedFile);
			formData.append('pinataMetadata', metadata);
			formData.append('pinataOptions', JSON.stringify({ cidVersion: 0 }));

			try {
				const res = await axios.post(
					'https://api.pinata.cloud/pinning/pinFileToIPFS',
					formData,
					{
						headers: {
							'Content-Type': `multipart/form-data`,
							Authorization: JWT,
						},
					}
				);
				const { IpfsHash } = res.data;
				return IpfsHash;
			} catch (error) {
				console.log(error);
			}
		};

		try {
			setIsLoading(true);
			setPinataHash(await pinFileToIPFS());
			// TODO: store the new project

			newProjectModal.onClose();
		} catch (error) {
			console.log(error);
		} finally {
			setIsLoading(false);
		}
	}, [newProjectModal, selectedFile, name]);

	const bodyContent = (
		<div className="flex flex-col gap-4">
			<Input
				placeholder="Nombre"
				value={name}
				disabled={isLoading}
				onChange={(e) => {
					setName(e.target.value);
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

	return (
		<Modal
			disabled={isLoading}
			isOpen={newProjectModal.isOpen}
			title="Crear Nuevo Proyecto"
			actionLabel={isLoading ? 'Cargando...' : 'Crear Proyecto'}
			onClose={newProjectModal.onClose}
			onSubmit={onSubmit}
			body={bodyContent}
		/>
	);
};
export default NewProjectModal;
