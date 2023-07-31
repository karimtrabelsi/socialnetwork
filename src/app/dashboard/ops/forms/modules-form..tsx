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
import { Module } from "@prisma/client";

import { addDays, format } from "date-fns";
import { DateRange, DayPicker } from "react-day-picker";
import { Calendar } from "@/components/ui/calendar";
import { fr } from "date-fns/locale";

const formSchema = z.object({
  nom: z.string().min(3, {
    message: "Nom doit contenir au moins 3 caractères.",
  }),
  semestre: z.coerce
    .number()
    .min(1, {
      message: "Semestre doit contenir au moins 1 caractère.",
    })
    .nullable(),
  periode: z.string().min(1, {
    message: "Période doit contenir au moins 5 caractères.",
  }),
  chargeHoraire: z.coerce
    .number()
    .min(1, {
      message: "Charge Horaire doit contenir au moins 1 caractère.",
    })
    .nullable(),
  credits: z.coerce
    .number()
    .min(1, {
      message: "Crédits doit contenir au moins 1 caractère.",
    })
    .nullable(),
  id: z.string().optional(),
});

type ModuleFormProps = {
  mod: Module | undefined;
};

const pastMonth = new Date();

export function ModuleForm(props: ModuleFormProps) {
  const defaultSelected: DateRange = {
    from: pastMonth,
    to: addDays(pastMonth, 4),
  };
  const [range, setRange] = React.useState<DateRange | undefined>(
    defaultSelected
  );
  console.log(range);

  const queryClient = useQueryClient();
  const { isUpdate, setIsUpdate } = useMyStore();
  // 1. Define your form.
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: props.mod !== undefined && isUpdate ? props.mod.id : "",
      nom: "",
      semestre: 0,
      periode:
        range?.from && range?.to
          ? `${format(range.from, "PPP", {
              locale: fr,
            })}–${format(range.to, "PPP", {
              locale: fr,
            })}`
          : "",
      chargeHoraire: 0,
      credits: 0,
    },
    values: {
      id: props.mod !== undefined && isUpdate ? props.mod.id : "",
      nom: props.mod !== undefined && isUpdate ? props.mod.nom : "",
      semestre: props.mod !== undefined && isUpdate ? props.mod.semestre : 0,
      periode:
        range?.from && range?.to
          ? `${format(range.from, "PPP", {
              locale: fr,
            })}–${format(range.to, "PPP", {
              locale: fr,
            })}`
          : "",
      chargeHoraire:
        props.mod !== undefined && isUpdate ? props.mod.chargeHoraire : 0,
      credits: props.mod !== undefined && isUpdate ? props.mod.credits : 0,
    },
  });

  type FormValues = {
    id?: string;
    nom: string;
    semestre: number | null;
    periode: string;
    chargeHoraire: number | null;
    credits: number | null;
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
                  type="number"
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
          render={() => (
            <FormItem>
              <FormLabel>Periode</FormLabel>
              <Calendar
                id="test"
                mode="range"
                defaultMonth={pastMonth}
                selected={range}
                locale={fr}
                onSelect={setRange}
                className="rounded-md border"
              />
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
                  type="number"
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
                  type="number"
                  autoComplete="off"
                  placeholder="Saisir nombre de crédits"
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
