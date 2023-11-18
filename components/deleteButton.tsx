"use client";

import { deleteJob } from "@/lib/jobs";
import { Button } from "./ui/button";
import { Trash2 } from "lucide-react";

interface jobId {
  id: string;
}

export default function DeleteButton({ id }: jobId) {
  function deleteButtonHandler(e: React.MouseEvent<SVGSVGElement>) {
    console.log(`delete ${id}`);
    deleteJob(id);
  }
  return <Trash2 onClick={(e) => deleteButtonHandler(e)} />;
}
