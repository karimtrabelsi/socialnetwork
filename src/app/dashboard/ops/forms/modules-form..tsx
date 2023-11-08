"use client";


import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { zodResolver } from "@hookform/resolvers/zod";
import { Module, Niveau } from "@prisma/client";
import { DropdownMenuCheckboxItemProps } from "@radix-ui/react-dropdown-menu";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import React from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { addDays } from "date-fns";
import { DateRange } from "react-day-picker";

const formSchema = z.object({
  nom: z.string().min(3, {
    message: "Nom doit contenir au moins 3 caractères.",
  }),
  semestre: z.coerce.number().min(1, {
    message: "Semestre doit contenir au moins 1 caractère.",
  }),
  periode: z.string().min(1, {
    message: "Période doit contenir au moins 5 caractères.",
  }),
  chargeHoraire: z.coerce.number().min(1, {
    message: "Charge Horaire doit contenir au moins 1 caractère.",
  }),
  credits: z.coerce.number().min(1, {
    message: "Crédits doit contenir au moins 1 caractère.",
  }),
  id: z.string().optional(),
  niveaux: z.string().array().optional(),
});

type ModuleFormProps = {
  mod: Module | undefined;
};

const pastMonth = new Date();

export function ModuleForm(props: ModuleFormProps) {
  console.log(props.mod);

  const queryClient = useQueryClient();
  const { isUpdate, setIsUpdate } = useMyStore();
  const [niv, setNiv] = React.useState<string[]>([]);

  console.log(niv);
  // 1. Define your form.
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: props.mod !== undefined && isUpdate ? props.mod.id : "",
      nom: "",
      semestre: undefined,
      periode: "",
      chargeHoraire: undefined,
      credits: undefined,
      niveaux: niv,
    },
    values: {
      id: props.mod !== undefined && isUpdate ? props.mod.id : "",
      nom: props.mod !== undefined && isUpdate ? props.mod.nom : "",
      semestre: props.mod !== undefined && isUpdate ? props.mod.semestre : 0,
      periode: props.mod !== undefined && isUpdate ? props.mod.periode : "",
      chargeHoraire:
        props.mod !== undefined && isUpdate ? props.mod.chargeHoraire : 0,
      credits: props.mod !== undefined && isUpdate ? props.mod.credits : 0,
      niveaux: niv,
    },
  });

  type FormValues = {
    id?: string;
    nom: string;
    semestre: number | null;
    periode: string;
    chargeHoraire: number | null;
    credits: number | null;
    niveaux: string[];
  };

  const { mutate, isLoading } = useMutation({
    mutationKey: ["createModule"],
    mutationFn: async (values: FormValues) => {
      await axios.post(`${process.env.NEXT_PUBLIC_SERVER}/api/modules`, values);
    },
    onSuccess: () => {
      form.reset();

      queryClient.invalidateQueries(["modules"]);
      toast({
        description: "Module Ajouté avec succès ✅",
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
    mutationKey: ["updateModule"],
    mutationFn: async (values: FormValues) => {
      await axios.put(`${process.env.NEXT_PUBLIC_SERVER}/api/modules`, values);
    },
    onSuccess: () => {
      console.log(form.getValues());
      form.reset();
      setIsUpdate(false);
      queryClient.invalidateQueries(["modules"]);
      toast({
        description: "Module Mis à jour avec succès ✅",
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
  type Checked = DropdownMenuCheckboxItemProps["checked"];
  const { data, isFetched } = useQuery({
    queryKey: ["niveaux"],
    queryFn: async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER}/api/niveaux`);
      const data = await res.json();
      return data.niveaux;
    },
  });

  const [showStatusBar, setShowStatusBar] = React.useState<Checked>(true);
  const [showActivityBar, setShowActivityBar] = React.useState<Checked>(false);
  const [showPanel, setShowPanel] = React.useState<Checked>(false);
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
          name="semestre"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Semestre</FormLabel>
              <FormControl>
                <Input
                  autoComplete="off"
                  placeholder="Saisir semestre"
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="periode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Période</FormLabel>
              <FormControl>
                <Input
                  autoComplete="off"
                  placeholder="Saisir période"
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="chargeHoraire"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Charge Horaire</FormLabel>
              <FormControl>
                <Input
                  autoComplete="off"
                  placeholder="Saisir charge horaire /heures"
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="credits"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Crédits</FormLabel>
              <FormControl>
                <Input
                  autoComplete="off"
                  placeholder="Saisir nombre de crédits"
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        {data.niveau ? (
          <FormField
            control={form.control}
            name="niveaux"
            render={({ field }) => (
              <FormItem>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">Niveaux</Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56">
                    {data.niveau.map((niveau: Niveau) => (
                      <DropdownMenuCheckboxItem
                        key={niveau.id}
                        checked={niv.includes(niveau.id) ? true : false}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setNiv([...niv, niveau.id]);
                          } else {
                            setNiv(niv.filter((id) => id !== niveau.id));
                          }
                        }}
                      >
                        {niveau.nom}
                      </DropdownMenuCheckboxItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                <FormMessage />
              </FormItem>
            )}
          />
        ) : null}
        <div className="flex gap-5">
          <Button type="submit" disabled={isLoading || status == "loading"}>
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            {status == "loading" && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            {props.mod == undefined || !isUpdate ? "Ajouter" : "Mettre a jour"}
          </Button>
          {props.mod !== undefined && isUpdate && (
            <Button
              type="reset"
              onClick={() => {
                // try zustand
                console.log(props.mod);
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
