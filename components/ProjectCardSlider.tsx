import { useRef } from 'react';
import { AiFillCaretLeft, AiFillCaretRight } from 'react-icons/ai';

interface MetadataProps {
	key: string;
	value: any;
}

interface SliderProps {
	metadata: MetadataProps;
}

const ProjectCardSlider: React.FC<SliderProps> = ({ metadata }) => {
	const carouselRef = useRef<HTMLDivElement>(null);

	// const scrollToNextStep = () => {
	// 	if (carouselRef.current) {
	// 		carouselRef.current.scrollLeft += carouselRef.current.offsetWidth;
	// 	}
	// };

	// const scrollToPreviousStep = () => {
	// 	if (carouselRef.current) {
	// 		carouselRef.current.scrollLeft -= carouselRef.current.offsetWidth;
	// 	}
	// };

	return (
		<div className="bg-gray-100  p-1 rounded-md">
			{/* <button onClick={scrollToPreviousStep} className="">
				<AiFillCaretLeft />
			</button> */}

			<div className="carousel nice-scrollbar" ref={carouselRef}>
				{Object.entries(metadata).map(([key, value]) => (
					<div key={key} className="text-center carousel-item mb-1">
						<strong>{key}: </strong>
						{JSON.stringify(value)}
					</div>
				))}
			</div>

			{/* <button onClick={scrollToNextStep} className="">
				<AiFillCaretRight />
			</button> */}
		</div>
	);
};

export default ProjectCardSlider;
