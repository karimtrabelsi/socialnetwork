"use client";

import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
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
import { Classe, Option } from "@prisma/client";

const formSchema = z.object({
  nom: z.string().min(3, {
    message: "Nom doit contenir au moins 3 caractères.",
  }),
  description: z.string().min(3, {
    message: "Description doit contenir au moins 3 caractères.",
  }),
  id: z.string().optional(),
});

type ClasseFormProps = {
  cls: Classe | undefined;
};

export function ClasseForm(props: ClasseFormProps) {
  const queryClient = useQueryClient();
  const { isUpdate, setIsUpdate } = useMyStore();
  // 1. Define your form.
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: props.cls !== undefined && isUpdate ? props.cls.id : "",
      nom: "",
      description: "",
    },
    values: {
      id: props.cls !== undefined && isUpdate ? props.cls.id : "",
      nom: props.cls !== undefined && isUpdate ? props.cls.nom : "",
      description:
        props.cls !== undefined && isUpdate ? props.cls.description : "",
    },
  });

  type FormValues = {
    id?: string;
    nom: string;
    description: string;
  };

  const { mutate, isLoading } = useMutation({
    mutationKey: ["createClasse"],
    mutationFn: async (values: FormValues) => {
      await axios.post(`${process.env.NEXT_PUBLIC_SERVER}/api/classes`, values);
    },
    onSuccess: () => {
      form.reset();

      queryClient.invalidateQueries(["classes"]);
      toast({
        description: "Classe Ajoutée avec succès ✅",
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
    mutationKey: ["updateClasse"],
    mutationFn: async (values: FormValues) => {
      await axios.put(`${process.env.NEXT_PUBLIC_SERVER}/api/classes`, values);
    },
    onSuccess: () => {
      form.reset();
      setIsUpdate(false);
      queryClient.invalidateQueries(["classes"]);
      toast({
        description: "Classe Mise à jour avec succès ✅",
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
              <FormLabel>Nom Classe</FormLabel>
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
              <FormLabel>Description Classe</FormLabel>
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
            {props.cls == undefined || !isUpdate ? "Ajouter" : "Mettre a jour"}
          </Button>
          {props.cls !== undefined && isUpdate && (
            <Button
              type="reset"
              onClick={() => {
                // try zustand
                console.log(props.cls);
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
