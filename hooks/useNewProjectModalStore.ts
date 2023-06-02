import { create } from 'zustand';


interface NewProjectModalStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
};

const useNewProjectModal = create<NewProjectModalStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));

export default useNewProjectModal;