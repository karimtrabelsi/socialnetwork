"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Icons } from "@/components/icons";
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
import { useToast } from "@/components/ui/use-toast";
import { useMyStore } from "@/hooks/zustand";
import { Niveau } from "@prisma/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useForm } from "react-hook-form";

const formSchema = z.object({
  nom: z.string().min(2, {
    message: "Nom doit contenir au moins 2 caractères.",
  }),
  anneeScolaire: z.string().min(3, {
    message: "anneeScolaire doit contenir au moins 3 caractères.",
  }),
  nbrClasses: z.coerce.number().min(1, {
    message: "anneeScolaire doit contenir au moins 3 caractères.",
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
      anneeScolaire: "",
      nbrClasses: undefined,
    },
    values: {
      id: props.niv !== undefined && isUpdate ? props.niv.id : "",
      nom: props.niv !== undefined && isUpdate ? props.niv.nom : "",
      anneeScolaire:
        props.niv !== undefined && isUpdate ? props.niv.anneeScolaire : "",
      nbrClasses:
        props.niv !== undefined && isUpdate ? props.niv.nbrClasses : 0,
    },
  });

  type FormValues = {
    id?: string;
    nom: string;
    anneeScolaire: string;
    nbrClasses: number | null;
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
          name="anneeScolaire"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Année Scolaire</FormLabel>
              <FormControl>
                <Input
                  autoComplete="off"
                  placeholder="Saisir année scolaire"
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="nbrClasses"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre de Classes</FormLabel>
              <FormControl>
                <Input
                  autoComplete="off"
                  placeholder="Saisir nombre de classes"
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex gap-5">
          <Button type="submit" disabled={isLoading || status == "loading"}>
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            {status == "loading" && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
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
