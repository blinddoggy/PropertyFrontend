import Header from '@/components/Header';
import Layout from '@/components/Layout';
import ProjectCard from '@/components/ProjectCard';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useEffect } from 'react';

interface ProjectsProps {
	projects: React.FC<ProjectFormPinata>[];
}
interface ProjectFormPinata {
	id: string;
	name: string;
	image: string;
	metadata: { [key: string]: any };
}

const Projects: React.FC<ProjectsProps> = ({ projects }) => {
	const [storedProject, setStoredProject] = useLocalStorage('projects', null);
	useEffect(() => {
		setStoredProject(projects);
	}, [projects, setStoredProject]);

	return (
		<Layout>
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

	try {
		const response = await fetch(apiUrl, { headers: { Authorization } });
		const data = await response.json();

		const projects: ProjectFormPinata[] = data.rows.map((row: any) => ({
			id: row.ipfs_pin_hash,
			name: row.metadata.name,
			image: `https://ipfs.io/ipfs/${row.ipfs_pin_hash}`,
			metadata: row.metadata.keyvalues,
		}));

		return {
			props: {
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
