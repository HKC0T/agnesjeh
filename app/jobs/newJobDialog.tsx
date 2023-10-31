"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Divide } from "lucide-react";
import React, { useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// const FormSchema = z.object({
//   type: z.enum(["new", "existing"], {
//     required_error: "You need to select a client type.",
//   }),
// })

export default function NewJobDialog() {
  // const form = useForm<z.infer<typeof FormSchema>>({
  //   resolver: zodResolver(FormSchema),
  // })

  // const [clientType, setClientType] = useState<String>();
  // const radioHandler = (event: React.ChangeEvent<HTMLInputElement) => {
  //   setClientType(event.target.value)
  // }
  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>New job</DialogTitle>
        <DialogDescription></DialogDescription>
        <DialogDescription></DialogDescription>
      </DialogHeader>
      <div></div>
    </DialogContent>
  );
}
