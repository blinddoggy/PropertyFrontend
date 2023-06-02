import { useCallback } from 'react';
import { useRouter } from 'next/router';
import { IconType } from 'react-icons';

interface SidebarItemProps {
	label: string;
	icon: IconType;
	onClick?: () => void | Promise<void>;
	href?: string;
}

const SidebarItem: React.FC<SidebarItemProps> = ({
	label,
	href,
	icon: Icon,
	onClick,
}) => {
	const router = useRouter();

	const handleClick = useCallback(() => {
		if (onClick) {
			return onClick();
		}
		if (href) {
			router.push(href);
		}
	}, [router, href, onClick]);

	return (
		<div onClick={handleClick} className="flex flex-row items-center">
			<div
				className="
          relative 
          rounded-full 
          h-14 
          w-14
          flex
          items-center
          justify-center
          p-4
          hover:bg-slate-300
          hover:bg-opacity-10
          cursor-pointer
          transition
          lg:hidden
        ">
				<Icon size={30} color="white"></Icon>
			</div>
			<div
				className="
        relative
        hidden
        lg:flex
        items-center
        gap-4
        p-4
        rounded-full
        hover:bg-slate-300
        hover:bg-opacity-10
        transition
        cursor-pointer
        ">
				<Icon size={24} color="white" />
				<p className="hidden lg:block text-white text-xl ">{label}</p>
			</div>
		</div>
	);
};

export default SidebarItem;
