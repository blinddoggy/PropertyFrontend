import Sidebar from "./layout/Sidebar";
import SecondSidebar from "./layout/SecondSidebar";
import NewProjectModal from '@/components/modals/NewProjectModal'

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <>
      <NewProjectModal />
      <div className="h-screen  bg-black">
        <div className="container mx-auto xl:px-30 max-w-6xl">
          <div className="grid grid-cols-4 h-screen ">
            <Sidebar />
            <div className=" col-span-3 pr-5 h-screen overflow-hidden">
              <div className="
                grid
                grid-cols-3
                bg-white
                rounded-3xl
                h-full
                max-h-[94vh]
                my-[3vh]
                nice-scrollbar
                ">
                <div className="
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
}

export default Layout;