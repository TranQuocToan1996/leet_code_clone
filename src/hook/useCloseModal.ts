import { authModalAtom } from "@/atom/authModalAtom";
import { useEffect } from "react";
import { useSetRecoilState } from "recoil";

function useCloseModal(): (any) {
    const setAuthModal = useSetRecoilState(authModalAtom);

    const closeModal = () => {
        setAuthModal((prev) => ({ ...prev, isOpen: false, type: "login" }));
    };

    const handleEsc = (e: KeyboardEvent) => {
        if (e.key === "Escape") closeModal();
    };

    useEffect(() => {
        window.addEventListener("keydown", handleEsc);
        return () => window.removeEventListener("keydown", handleEsc);
    });

    return closeModal;
}

export default useCloseModal