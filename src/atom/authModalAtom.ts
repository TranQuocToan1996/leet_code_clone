import {atom} from "recoil"


export type AuthModalState = {
    isOpen:boolean
    type: "login" | "register" | "forgotPassword"
}

const authModalStateInit :AuthModalState = {
    isOpen: false,
    type: "login"
}

export const authModalAtom = atom<AuthModalState>({
    "key": "authModalState",
    default: authModalStateInit
})