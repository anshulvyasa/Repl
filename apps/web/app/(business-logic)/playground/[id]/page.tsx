"use client";

import { useParams } from "next/navigation";

const Playground = () => {
  const { id } = useParams<{ id: string }>();


  return <div>The Current ID is {id}</div>;
};

export default Playground;
