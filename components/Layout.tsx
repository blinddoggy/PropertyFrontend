import Sidebar from './layout/Sidebar';
import SecondSidebar from './layout/SecondSidebar';
import NewProjectModal from '@/components/modals/NewProjectModal';

import { useEffect, useState } from 'react';
import { validateOwner } from '@/utils/PropertyMaster/methods';
import { useRouter } from 'next/router';
import Loading from './Loading';

interface LayoutProps {
	contractAddress: string;
	children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ contractAddress, children }) => {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		validateOwner(contractAddress).then((isLoggedIn) => {
			console.log('is fucking loggin... ', isLoggedIn);
			if (!isLoggedIn) {
				router.replace('/login');
			} else {
				setIsLoading(false);
			}
		});
	}, [contractAddress, router]);

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
