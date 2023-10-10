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
import { useForm } from "react-hook-form"
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

const FormSchema = z.object({
  type: z.enum(["new", "existing"], {
    required_error: "You need to select a client type.",
  }),
})
 

export default function NewJobDialog({
  children,
}: {
  children: React.ReactNode;
}) {

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  })

  const [clientType, setClientType] = useState<String>();
  // const radioHandler = (event: React.ChangeEvent<HTMLInputElement) => {
  //   setClientType(event.target.value)
  // }
  return (
    // <DialogContent className="sm:max-w-[425px]">
    //   <DialogHeader>
    //     <DialogTitle>New job</DialogTitle>
    //     <DialogDescription>
    //       <RadioGroup
    //         defaultValue="card"
    //         className="grid grid-cols-2 gap-4 mt-4"
    //         onValueChange={radioHandler}
    //       >
    //         <div>
    //           <RadioGroupItem
    //             value="existing"
    //             id="existing"
    //             className="peer sr-only"
                
    //           />
    //           <Label
    //             htmlFor="existing"
    //             className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
    //           >
    //             Existing client
    //           </Label>
    //         </div>
    //         <div>
    //           <RadioGroupItem
    //             value="new"
    //             id="new"
    //             className="peer sr-only"

    //           />
    //           <Label
    //             htmlFor="new"
    //             className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
    //           >
    //             New client
    //           </Label>
    //         </div>
    //       </RadioGroup>
    //     </DialogDescription>
    //     <DialogDescription></DialogDescription>
    //   </DialogHeader>
    //   <div></div>
    // </DialogContent>
  );
}
