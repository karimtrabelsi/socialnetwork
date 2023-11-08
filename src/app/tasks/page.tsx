"use client";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Table } from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { useMyStore } from "@/hooks/zustand";
import { zodResolver } from "@hookform/resolvers/zod";
import { Competence, Module, Up } from "@prisma/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useForm } from "react-hook-form";
import * as z from "zod";

type UpFormProps = {
  up: Up | undefined;
  params: {
    userId: string | "";
  };
};

export default function TaskPage(props: UpFormProps) {
  const formSchema = z.object({
    nom: z.string().min(3, {
      message: "Nom doit contenir au moins 3 caractères.",
    }),
    description: z.string().min(3, {
      message: "Description doit contenir au moins 3 caractères.",
    }),
    id: z.string().optional(),
    module: z.string(),
  });

  const queryClient = useQueryClient();
  const { isUpdate, setIsUpdate } = useMyStore();
  const { data } = useQuery({
    queryKey: ["deps"],
    queryFn: async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER}/api/modules`);
      const data = await res.json();
      return data.modules;
    },
  });

  const { data: comps } = useQuery({
    queryKey: ["comps"],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER}/api/competences?userId=${props.params.userId}`
      );
      const data = await res.json();
      return data.comps;
    },
  });
  // 1. Define your form.
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),

    values: {
      nom: props.up !== undefined && isUpdate ? props.up.nom : "",
      description:
        props.up !== undefined && isUpdate ? props.up.description : "",
      module: props.up !== undefined && isUpdate ? props.up.deptId : "",
    },
  });

  type FormValues = {
    id?: string;
    nom: string;
    description: string;
  };

  const { mutate, isLoading } = useMutation({
    mutationKey: ["createComp"],
    mutationFn: async (values: FormValues) => {
      await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER}/api/competences?userId=${props.params.userId}`,
        values
      );
    },
    onSuccess: () => {
      form.reset();

      toast({
        description: "Comp Ajoutée avec succès ✅",
      });
      queryClient.invalidateQueries(["comps"]);
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
      });
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    mutate(values);
  }

  return (
    <div className=" flex-col md:flex sm:grid sm:grid-cols-1 ">
      <div className="flex-1 space-y-4 p-8 pt-6 w-full">
        <div className="flex items-center justify-center space-y-2">
          <h2 className="text-3xl font-bold tracking-tight ">
            Taches et Compétences
          </h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-5  border-red-400 dark:border-cyan-600">
            <CardHeader>
              <CardTitle>Taches</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
              <CardContent>
                <Table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th>Nom</th>
                      <th>Période</th>
                      <th>Charge</th>
                    </tr>
                  </thead>
                  <tbody className=" divide-y divide-gray-200 p-5 mt-5 text-center">
                    {data &&
                      data.map((module: Module) => (
                        <tr key={module.id}>
                          <td>{module.nom}</td>
                          <td>{module.periode}</td>
                          <td>{module.chargeHoraire}</td>
                        </tr>
                      ))}
                  </tbody>
                </Table>
              </CardContent>
            </CardContent>
          </Card>
          <Card className="col-span-2 border-red-400 dark:border-cyan-600 ">
            <CardHeader>
              <CardTitle>Compétences</CardTitle>
            </CardHeader>
            <CardContent>
              <Table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th>Nom</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody className=" divide-y divide-gray-200 p-5 mt-5 text-center">
                  {comps &&
                    comps.map((coomp: Competence) => (
                      <tr key={coomp.id}>
                        <td>{coomp.nom}</td>
                        <td>{coomp.description}</td>
                      </tr>
                    ))}
                </tbody>
              </Table>
            </CardContent>
          </Card>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline">Ajouter Compétence</Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Ajouter Compétence</SheetTitle>
                <SheetDescription>
                  Saisir les informations nécessaires pour ajouter une
                  compétence
                </SheetDescription>
              </SheetHeader>
              <div className="grid gap-4 py-4">
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-8"
                  >
                    <FormField
                      control={form.control}
                      name="nom"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nom Compétence</FormLabel>
                          <FormControl>
                            <Input
                              autoComplete="off"
                              placeholder="Saisir nom"
                              {...field}
                            />
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
                          <FormLabel>Description Compétence</FormLabel>
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
                    {data ? (
                      <FormField
                        control={form.control}
                        rules={{ required: true }}
                        name="module"
                        render={({ field }) => (
                          <FormItem>
                            <Select onValueChange={field.onChange}>
                              <SelectTrigger className="w-[180px]">
                                <SelectValue
                                  defaultValue={field.value}
                                  placeholder="Module"
                                />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectGroup>
                                  <SelectLabel>Modules</SelectLabel>
                                  {data.map((dept: Module) => (
                                    <SelectItem key={dept.id} value={dept.id}>
                                      {dept.nom}

                                      {<input type="hidden" {...field} />}
                                    </SelectItem>
                                  ))}
                                </SelectGroup>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    ) : null}
                    <div className="flex gap-5">
                      {form.formState.isValid ? (
                        <SheetClose asChild>
                          <Button
                            type="submit"
                            disabled={isLoading || status == "loading"}
                          >
                            {isLoading && (
                              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            Ajouter
                          </Button>
                        </SheetClose>
                      ) : (
                        <Button
                          type="submit"
                          disabled={isLoading || status == "loading"}
                        >
                          {isLoading && (
                            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                          )}
                          Ajouter
                        </Button>
                      )}
                    </div>
                  </form>
                </Form>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </div>
  );
}
