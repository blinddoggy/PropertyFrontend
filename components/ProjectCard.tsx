import React from 'react';
import Image from 'next/image';
import ProjectCardSlider from './ProjectCardSlider';
import { useRouter } from 'next/router';

interface ProjectFormPinata {
	id: string;
	name: string;
	image: string;
	metadata: { [key: string]: any };
}

interface MetadataProps {
	key: string;
	value: any;
}

interface ProjectCardProps {
	project: ProjectFormPinata;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
	const router = useRouter();
	const hasMetadata =
		project.metadata && Object.keys(project.metadata).length > 0;

	return (
		<div
			onClick={() => router.push(`/projects/${project.id}`)}
			className="flex flex-col mx-auto h-[340px] w-60 bg-slate-100 rounded-2xl  group shadow-md">
			<div className="h-60 w-60 overflow-hidden rounded-t-2xl aspect-w-1 aspect-h-1 ">
				<Image
					width={500}
					height={500}
					className=" object-cover h-full w-full group-hover:scale-110 transition cursor-pointer"
					src={project.image}
					alt={project.name}
				/>
			</div>
			<div className="p-2 my-auto">
				{hasMetadata ? (
					<div>
						<h2 className="text-xl font-semibold mb-2">{project.name}</h2>
						<ProjectCardSlider metadata={project.metadata as MetadataProps} />
					</div>
				) : (
					<h2 className="text-xl text-center my-auto font-semibold text-ellipsis">
						{project.name}
					</h2>
				)}
			</div>
		</div>
	);
};

export default ProjectCard;
