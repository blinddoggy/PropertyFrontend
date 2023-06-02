import { BsFillBuildingFill, BsBuildingFillAdd } from 'react-icons/bs';
import { BiLogOut } from 'react-icons/bi';
import SidebarLogo from './SidebarLogo';
import SidebarItem from './SidebarItem';

import { useRouter } from 'next/router';
import useProfileData from '@/hooks/useProfileData';

const Sidebar = () => {
	const router = useRouter();

	const user = useProfileData();

	const logout = async () => {
		try {
			await fetch('/api/auth/logout');
		} catch (error) {
			console.error(error);
		} finally {
			router.replace('/login');
		}
	};

	const items = [
		{
			label: 'Proyectos',
			href: '/projects',
			icon: BsFillBuildingFill,
		},
		{
			label: 'Crear Proyecto',
			href: '/projects/new',
			icon: BsBuildingFillAdd,
		},
	];

	return (
		<div
			className="
      col-span-1
      h-full
      pr-4
      md:pr-6
    ">
			<div
				className="
        flex
        flex-col
        items-center 
        md:items-end
        h-full
        max-h-screen
      ">
				<div
					className="
          flex
          flex-col
          items-center
          sm:items-start
          text-center
          sm:text-left
          pl-2
          md:pl-1
          mb-2
        ">
					<SidebarLogo />
					{user ? (
						<div>
							<p className=" hidden md:block text-2xl lg:text-3xl font-bold text-white ">
								{user.name}
							</p>
							<p className=" hidden md:block text-md lg:text-xl text-ellipsis font-extralight text-slate-100 ">
								{user.username}
							</p>
						</div>
					) : (
						<p>Loading...</p>
					)}
				</div>
				<div className="space-y-2 ">
					{items.map((item) => (
						<SidebarItem
							key={item.href}
							href={item.href}
							label={item.label}
							icon={item.icon}
						/>
					))}
				</div>
				<div className="mb-14 mt-auto">
					<SidebarItem
						onClick={() => logout()}
						icon={BiLogOut}
						label="LogOut"
					/>
				</div>
			</div>
		</div>
	);
};

export default Sidebar;
