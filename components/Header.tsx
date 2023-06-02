import { useRouter } from "next/router";
import { useCallback } from "react";

import { BiArrowBack } from 'react-icons/bi'

interface HeaderProps {
  label: string;
  showBackArrow?: boolean;
}

const Header: React.FC<HeaderProps> = ({ label, showBackArrow }) => {

  const router = useRouter();
  const handleBack = useCallback(
    () => {
      router.back();
    },
    [router],
  )

  return (
    <div className="p-5 rounded-t-3xl">
      <div className="flex flex-row items-center gap-2">
        {
          showBackArrow &&
          (
            <BiArrowBack
              onClick={handleBack}
              size={10}
              color="black"
              className="
                h-10 
                w-10
                p-2
                rounded-full 
                hover:bg-slate-300
                hover:bg-opacity-50
                cursor-pointer
                transition
              "
            />
          )
        }
        <h1 className="text-black text-xl font-semibold " >{label}</h1>
      </div>
    </div>
  );
}

export default Header;