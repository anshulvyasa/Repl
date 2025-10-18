import { changeEditPlaygroundDialogState } from "../features/editdialog";
import { useAppDispatch, useAppSelector } from "../hooks";

export const useEditPlaygroundDialogState = () => {
  const editPlaygroundDialogState = useAppSelector(
    (state) => state.dialogState.isOpen
  );
  const dispatch = useAppDispatch();

  const openEditPlaygroundDialog = () => {
    dispatch(changeEditPlaygroundDialogState(true));
  };

  const closeEditPlaygroundDialog = () => {
    dispatch(changeEditPlaygroundDialogState(false));
  };

  return {
    editPlaygroundDialogState,
    openEditPlaygroundDialog,
    closeEditPlaygroundDialog,
  };
};
