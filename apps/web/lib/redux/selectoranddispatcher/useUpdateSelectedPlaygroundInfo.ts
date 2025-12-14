import { selectedPlaygroundSchemaType } from "@repo/zod/playground";
import { useAppDispatch, useAppSelector } from "../hooks"
import { updateSelectedPlayground } from "../features/playgroundInfo";

export const useSelectedPlaygroundInfo = () => {
    const dispatch = useAppDispatch();
    const selectedPlayground = useAppSelector(state => state.selectedPlaygroundInfo)

    function updateSelectedPlaygroundFn(playground: selectedPlaygroundSchemaType) {
        dispatch(updateSelectedPlayground(playground))
    }

    return { selectedPlayground, updateSelectedPlaygroundFn }
}