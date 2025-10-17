import { addAllProjects, PlayGround } from "../features/projects";
import { useAppDispatch, useAppSelector } from "../hooks";

export const useProject = () => {
  const playgrounds = useAppSelector((state) => state.playgrounds);
  const dispatch = useAppDispatch();

  const addPlaygrounds = (projects: PlayGround[]) => {
    dispatch(addAllProjects(projects));
  };

  return { playgrounds, addPlaygrounds };
};
