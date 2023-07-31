"use client";

import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { useToast } from "@/components/ui/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Icons } from "@/components/icons";
import React from "react";
import { useMyStore } from "@/hooks/zustand";
import { Option } from "@prisma/client";

const formSchema = z.object({
  nom: z.string().min(3, {
    message: "Nom doit contenir au moins 3 caractères.",
  }),
  description: z.string().min(3, {
    message: "Description doit contenir au moins 3 caractères.",
  }),
  id: z.string().optional(),
});

type OptionFormProps = {
  opt: Option | undefined;
};

export function OptionForm(props: OptionFormProps) {
  const queryClient = useQueryClient();
  const { isUpdate, setIsUpdate } = useMyStore();
  // 1. Define your form.
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: props.opt !== undefined && isUpdate ? props.opt.id : "",
      nom: "",
      description: "",
    },
    values: {
      id: props.opt !== undefined && isUpdate ? props.opt.id : "",
      nom: props.opt !== undefined && isUpdate ? props.opt.nom : "",
      description:
        props.opt !== undefined && isUpdate ? props.opt.description : "",
    },
  });

  type FormValues = {
    id?: string;
    nom: string;
    description: string;
  };

  const { mutate, isLoading } = useMutation({
    mutationKey: ["createOption"],
    mutationFn: async (values: FormValues) => {
      await axios.post(`${process.env.NEXT_PUBLIC_SERVER}/api/options`, values);
    },
    onSuccess: () => {
      form.reset();

      queryClient.invalidateQueries(["options"]);
      toast({
        description: "Option Ajoutée avec succès ✅",
      });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
      });
    },
  });
  const { mutateAsync, status } = useMutation({
    mutationKey: ["updateOption"],
    mutationFn: async (values: FormValues) => {
      await axios.put(`${process.env.NEXT_PUBLIC_SERVER}/api/options`, values);
    },
    onSuccess: () => {
      form.reset();
      setIsUpdate(false);
      queryClient.invalidateQueries(["options"]);
      toast({
        description: "Option Mise à jour avec succès ✅",
      });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
      });
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    isUpdate ? mutateAsync(values) : mutate(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="nom"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom Option</FormLabel>
              <FormControl>
                <Input autoComplete="off" placeholder="Saisir nom" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description Option</FormLabel>
              <FormControl>
                <Input
                  autoComplete="off"
                  placeholder="Saisir description"
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex gap-5">
          <Button type="submit" disabled={isLoading || status == "loading"}>
            {isLoading ||
              (status == "loading" && (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              ))}
            {props.opt == undefined || !isUpdate ? "Ajouter" : "Mettre a jour"}
          </Button>
          {props.opt !== undefined && isUpdate && (
            <Button
              type="reset"
              onClick={() => {
                // try zustand
                console.log(props.opt);
                setIsUpdate(false);
                form.reset();
              }}
              variant="destructive"
            >
              Annuler
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}
