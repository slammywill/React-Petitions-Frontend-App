import { create } from "zustand";

interface AuthUserState {
    authUser: AuthUser | null;
    setAuthUser: (user: AuthUser) => void;
    removeAuthUser: () => void;
}

const getLocalStorage = (key: string): AuthUser => JSON.parse(window.localStorage.getItem(key) as string);
const setLocalStorage = (key: string, value: AuthUser | null) => window.localStorage.setItem(key, JSON.stringify(value));

const useStore = create<AuthUserState>((set) => ({
    authUser: getLocalStorage('authUser'),

    setAuthUser: (authUser: AuthUser) => set(() => {
        setLocalStorage('authUser', authUser)
        return {authUser: authUser}
    }),

    removeAuthUser: () => set(() => {
        setLocalStorage('authUser', null)
        return { authUser: null }
    })
}))

export const useAuthUserStore = useStore;
