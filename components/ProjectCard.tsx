import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';

interface ProjectFormPinata {
	id: string;
	name: string;
	image: string;
	metadata: { [key: string]: any };
}

interface ProjectCardProps {
	project: ProjectFormPinata;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
	const router = useRouter();

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
			<div className="p-2 my-auto overflow-hidden">
				<h2 className="text-xl text-center my-auto font-semibold line-clamp-1">
					{project.name}
				</h2>
			</div>
		</div>
	);
};

export default ProjectCard;
