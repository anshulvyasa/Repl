import axiosInstance from "@/axiosinstance";
import type {
  createPlaygroundSchemaType,
  editPlaygroundSchemaType,
} from "@repo/zod/playground";

export const createPlayGroundService = async (
  data: createPlaygroundSchemaType
) => {
  const response = await axiosInstance.post("/app/v1/playground/create", data);

  return response.data;
};

export const getAllPlayGroundService = async () => {
  const response = await axiosInstance.get(`/app/v1/playground/get`);

  return response.data;
};

export const deletePlaygroundService = async (id: string) => {
  const response = await axiosInstance.delete(`app/v1/playground/delete/${id}`);

  return response.data;
};

export const updatePlaygroundDataService = async (
  id: string,
  data: editPlaygroundSchemaType
) => {
  const response = await axiosInstance.patch(
    `app/v1/playground/update/${id}`,
    data
  );

  return response.data;
};

export const getPlaygroundTemplateFiles = async (id: string) => {
  const response = await axiosInstance.get(`app/v1/files/get/${id}`);

  return response.data;
};
