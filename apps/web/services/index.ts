import axiosInstance from "@/axiosinstance";
import type { createPlaygroundSchemaType } from "@repo/zod/playground";

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
