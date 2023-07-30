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
import { Niveau } from "@prisma/client";
import React from "react";

const formSchema = z.object({
  nom: z.string().min(3, {
    message: "Nom doit contenir au moins 3 caractères.",
  }),
  description: z.string().min(3, {
    message: "Description doit contenir au moins 3 caractères.",
  }),
});

type NiveauFormProps = {
  niv: Niveau | undefined;
};

export function NiveauForm(props: NiveauFormProps) {
  const queryClient = useQueryClient();
  // 1. Define your form.
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nom: "",
      description: "",
    },
    values: {
      nom: props.niv !== undefined ? props.niv.nom : "",
      description: props.niv !== undefined ? props.niv.description : "",
    },
  });

  type FormValues = {
    nom: string;
    description: string;
  };

  const { mutate, isLoading } = useMutation({
    mutationKey: ["createNiveau"],
    mutationFn: async (values: FormValues) => {
      await axios.post("http://localhost:3000/api/niveaux", values);
    },
    onSuccess: (data) => {
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

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
    mutate(values);
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
          <Button type="submit" disabled={isLoading}>
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            {props.niv == undefined ? "Ajouter" : "Mettre a jour"}
          </Button>
          {props.niv !== undefined && (
            <Button
              type="reset"
              onClick={() => {
                // try zustand
                console.log(props.niv);
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
