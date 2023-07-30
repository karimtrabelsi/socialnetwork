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
import { Niveau } from "@/app/tables/data-table";

const formSchema = z.object({
  nom: z.string().min(3, {
    message: "Nom doit contenir au moins 3 caractères.",
  }),
  description: z.string().min(3, {
    message: "Description doit contenir au moins 3 caractères.",
  }),
  id: z.string().optional(),
});

type NiveauFormProps = {
  niv: Niveau | undefined;
};

export function NiveauForm(props: NiveauFormProps) {
  const queryClient = useQueryClient();
  const { isUpdate, setIsUpdate } = useMyStore();
  // 1. Define your form.
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: props.niv !== undefined && isUpdate ? props.niv.id : "",
      nom: "",
      description: "",
    },
    values: {
      id: props.niv !== undefined && isUpdate ? props.niv.id : "",
      nom: props.niv !== undefined && isUpdate ? props.niv.nom : "",
      description:
        props.niv !== undefined && isUpdate ? props.niv.description : "",
    },
  });

  type FormValues = {
    id?: string;
    nom: string;
    description: string;
  };

  const { mutate, isLoading } = useMutation({
    mutationKey: ["createNiveau"],
    mutationFn: async (values: FormValues) => {
      await axios.post(`${process.env.NEXT_PUBLIC_SERVER}/api/niveaux`, values);
    },
    onSuccess: () => {
      form.reset();

      queryClient.invalidateQueries(["niveaux"]);
      // queryClient.setQueryData(["niveaux"], (old: any) => [old, data]);
      toast({
        description: "Niveau Ajouté avec succès ✅",
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

  // const vals = {
  //   id: props.niv?.id,

  //   nom: form.getValues("nom"),
  //   description: form.getValues("description"),
  // };
  // console.log(vals);

  const { mutateAsync, status } = useMutation({
    mutationKey: ["updateNiveau"],
    mutationFn: async (values: FormValues) => {
      await axios.put(`${process.env.NEXT_PUBLIC_SERVER}/api/niveaux`, values);
    },
    onSuccess: () => {
      form.reset();
      setIsUpdate(false);
      queryClient.invalidateQueries(["niveaux"]);
      toast({
        description: "Niveau Mis à jour avec succès ✅",
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
              <FormLabel>Nom Module</FormLabel>
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
              <FormLabel>Description Module</FormLabel>
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
            {props.niv == undefined || !isUpdate ? "Ajouter" : "Mettre a jour"}
          </Button>
          {props.niv !== undefined && isUpdate && (
            <Button
              type="reset"
              onClick={() => {
                // try zustand
                console.log(props.niv);
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
