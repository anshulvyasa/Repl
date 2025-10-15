import { updateDialogState } from "../features/dialog";
import { useAppDispatch, useAppSelector } from "../hooks";

export const useDialogSelectorAndDispatcher = () => {
  const dialogState = useAppSelector((state) => state.dialogState.isOpen);

  const dispatch = useAppDispatch();

  const openDialog = () => dispatch(updateDialogState(true));
  const closeDialog = () => dispatch(updateDialogState(false));

  return { dialogState, openDialog, closeDialog };
};
