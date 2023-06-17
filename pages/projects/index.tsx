import Header from '@/components/Header';
import Layout from '@/components/Layout';
import ProjectCard from '@/components/ProjectCard';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useEffect } from 'react';

interface ProjectsProps {
	contractAddress;
	projects: React.FC<MarketplaceMetadataFormat>[];
}

const Projects: React.FC<ProjectsProps> = ({ contractAddress, projects }) => {
	const [storedProject, setStoredProject] = useLocalStorage('projects', null);
	useEffect(() => {
		setStoredProject(projects);
	}, [projects, setStoredProject]);

	return (
		<Layout contractAddress={contractAddress}>
			<Header label="Proyectos" />
			<div className="grid md:grid-cols-2 lg:grid-cols-3 px-4 gap-4">
				{projects.map((project: any) => (
					<ProjectCard key={project.id} project={project} />
				))}
			</div>
		</Layout>
	);
};

export default Projects;

export async function getServerSideProps() {
	const apiUrl = 'https://api.pinata.cloud/data/pinList?includeCount=false';
	const Authorization = process.env.PINATA_API_BEARER_JWT || '';
	const contractAddress = (process.env.MASTER_PROPERTY_TOKEN as string) || '';

	try {
		const response = await fetch(apiUrl, { headers: { Authorization } });
		const data = await response.json();

		const jsonHashes = data.rows
			.filter((row) => row.metadata.name.endsWith('.json'))
			.map((row: any) => ({
				jsonHash: row.ipfs_pin_hash,
			}));

		const baseUrl = 'https://ipfs.io/ipfs';

		const fetchPromises = jsonHashes.map(async (hash) => {
			const url = `${baseUrl}/${hash.jsonHash}`;
			const response = await fetch(url);
			const data = await response.json();
			return {
				id: hash.jsonHash,
				...data,
			};
		});

		const projects = await Promise.all(fetchPromises);

		return {
			props: {
				contractAddress,
				projects,
			},
		};
	} catch (error) {
		console.error('Error al obtener los datos de Pinata API:', error);
		return {
			props: {
				projects: [],
			},
		};
	}
}

interface MarketplaceMetadataFormat {
	id?: string;
	name: string;
	description: string;
	image: string;
	attributes: {
		trait_type: string;
		value: string;
	}[];
}
