import Sidebar from './layout/Sidebar';
import SecondSidebar from './layout/SecondSidebar';
import NewProjectModal from '@/components/modals/NewProjectModal';
import { FaExclamationCircle } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import {
	validateOwner,
	validateChainId,
	subscribeToChainChanged,
} from '@/utils/PropertyMaster/methods';
import { useRouter } from 'next/router';
import Loading from './Loading';

interface LayoutProps {
	contractAddress: string;
	children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ contractAddress, children }) => {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(true);
	const [isValidChainId, setIsValidChainId] = useState(false);

	useEffect(() => {
		const handleChainChanged = () => {
			validateChainId().then((isValid) => {
				setIsValidChainId(isValid);
			});
		};

		validateChainId().then((isValid) => {
			setIsValidChainId(isValid);
		});

		subscribeToChainChanged(true, handleChainChanged);

		return () => {
			subscribeToChainChanged(false, handleChainChanged);
		};
	}, []);

	useEffect(() => {
		validateOwner(contractAddress).then((isLoggedIn) => {
			if (!isLoggedIn) {
				router.replace('/login');
			} else {
				setIsLoading(false);
			}
		});
	}, [contractAddress, router]);

	const networkErrorDialog = (
		<div className="fixed top-0 left-0 right-0 bottom-0 bg-slate-900 bg-opacity-70 flex items-center justify-center z-50">
			<div className="bg-white text-white p-8 rounded-lg shadow-lg">
				<div className="text-center">
					<div className="text-6xl mb-4">
						<FaExclamationCircle className=" text-gray-800 mx-auto" />
					</div>
					<p className="text-xl font-bold mb-4 text-gray-800">
						¡Ups! Red incorrecta.
					</p>
					<p className="text-lg text-gray-700">
						Recuerda que
						<span className="font-semibold">{` Property Token `}</span>
						trabaja sobre la red de
						<span className="font-semibold"> BNB</span>.
					</p>
				</div>
			</div>
		</div>
	);

	if (isLoading) return <Loading loadingMessage="" />;

	return (
		<>
			<NewProjectModal />
			<div className="h-screen  bg-black">
				<div className="container mx-auto xl:px-30 max-w-6xl">
					<div className="grid grid-cols-4 h-screen ">
						<Sidebar />
						<div className=" col-span-3 pr-5 h-screen overflow-hidden">
							<div
								className="
                grid
                grid-cols-3
                bg-white
                rounded-3xl
                h-full
                max-h-[94vh]
                my-[3vh]
                nice-scrollbar
                ">
								<div
									className="
                  col-span-3
                  pb-4
                  rounded-b-3xl
                ">
									{children}
									{!isValidChainId && networkErrorDialog}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default Layout;
