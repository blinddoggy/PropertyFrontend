import Button from '@/components/Button';
import { useState } from 'react';

interface ProjectDetailProps {
	initialButtonLabel: string;
	toCopy?: string;
	hoverLabel?: string;
	infoLabel?: string;
}

const ProjectCopyButton: React.FC<ProjectDetailProps> = ({
	initialButtonLabel,
	toCopy,
	hoverLabel = 'Copiar',
	infoLabel = 'Copiado!',
}) => {
	const [buttonLabel, setButtonLabel] = useState(initialButtonLabel);

	const handleClick = () => {
		navigator.clipboard.writeText(toCopy || initialButtonLabel);
		setButtonLabel(infoLabel);

		setTimeout(() => {
			setButtonLabel(initialButtonLabel);
		}, 2000);
	};
	const handleMouseEnter = () => {
		if (buttonLabel == infoLabel) return;
		setButtonLabel(hoverLabel);
	};
	const handleMouseLeave = () => {
		if (buttonLabel == infoLabel) return;
		setButtonLabel(initialButtonLabel);
	};

	return (
		<div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
			<Button fullWidth label={buttonLabel} onClick={handleClick} />
		</div>
	);
};

export default ProjectCopyButton;
