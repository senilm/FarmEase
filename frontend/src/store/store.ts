import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface Farm {
  id: string;
  name: string;
  description?: string;
  role: "ADMIN" | "USER";
}

interface UserState {
  userId: string | null;
  userName: string | null;
  userEmail: string | null;
  farms: Farm[];

  setUser: (
    userId: string,
    userName: string,
    userEmail: string,
    farms: Farm[]
  ) => void;
  clearUser: () => void;
  addFarm: (farm: Farm) => void;
  removeFarm: (farmId: string) => void;
}

const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      userId: null,
      userName: null,
      userEmail: null,
      farms: [],

      setUser: (userId, userName, userEmail, farms) =>
        set({ userId, userName, userEmail, farms }),
      clearUser: () =>
        set({ userId: null, userName: null, userEmail: null, farms: [] }),
      addFarm: (farm) =>
        set((state) => ({
          farms: [...state.farms, farm],
        })),
      removeFarm: (farmId) =>
        set((state) => ({
          farms: state.farms.filter((farm) => farm.id !== farmId),
        })),
    }),
    {
      name: "user-storage", 
      storage: createJSONStorage(() => sessionStorage), 
    }
  )
);

export default useUserStore;
