"use client";

import { deleteJob } from "@/lib/jobs";
import { Button } from "./ui/button";

interface jobId {
  id: string;
}

export default function DeleteButton({ id }: jobId) {
  function deleteButtonHandler(e: React.MouseEvent<HTMLButtonElement>) {
    console.log(`delete ${id}`);
    deleteJob(id);
  }
  return <Button onClick={(e) => deleteButtonHandler(e)}>Delete</Button>;
}
