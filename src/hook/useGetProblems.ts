import { useEffect, useState, Dispatch, SetStateAction } from "react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { firestore } from "@/firebase/firebase";
import { DBProblem } from "@/utils/types/problem";
import mockProblems from "@/mockProblems/problems"

const useGetProblems = (setIsloading: Dispatch<SetStateAction<boolean>>) => {
    const [problems, setProblems] = useState<DBProblem[]>([]);

    useEffect(() => {
        const getProblems = async () => {
            const tmp: DBProblem[] = [];
            try {
                setIsloading(true);
                const q = query(collection(firestore, "problems"), orderBy("order", "asc"));
                const querySnapshot = await getDocs(q);
                querySnapshot.forEach((doc) => {
                    tmp.push({ id: doc.id, ...doc.data() } as DBProblem);
                });
            } catch (error) {
                console.log(error)
                for (let i = 0; i < mockProblems.length; i++) {
                    tmp.push(mockProblems[i])
                }
            } finally {
                setProblems(tmp);
                setIsloading(false);
            }

        };
        getProblems();
    }, [setIsloading]);

    return problems;
}

export default useGetProblems