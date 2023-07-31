"use client";
import { DataTableDemo, Niveau } from "@/app/tables/data-table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Metadata } from "next";
import { NiveauForm } from "./forms/niveaux-form";
import React from "react";
import { OptionForm } from "./forms/options-form";
import { Classe, Departement, Option, Up } from "@prisma/client";
import { OptionsTable } from "@/app/tables/options-table";
import { ClassesTable } from "@/app/tables/classes-table";
import { ClasseForm } from "./forms/classes-form";
import { DepartementsTable } from "@/app/tables/deps-table";
import { DepartementForm } from "./forms/deps-form";
import { UpsTable } from "@/app/tables/ups-table";
import { UpForm } from "./forms/ups-form";

const metadata: Metadata = {
  title: "Dashboard",
  description: "Example dashboard app using the components.",
};

export default function OpsPage() {
  const [niveaux, setNiveaux] = React.useState<Niveau>();
  const [option, setOption] = React.useState<Option>();
  const [classe, setClasse] = React.useState<Classe>();
  const [up, setUp] = React.useState<Up>();
  const [departement, setDepartement] = React.useState<Departement>();
  const getData = async (data: Niveau) => {
    setNiveaux(data);
  };
  const getOption = async (data: Option) => {
    setOption(data);
  };
  const getClasse = async (data: Classe) => {
    setClasse(data);
  };
  const getDepartement = async (data: Departement) => {
    setDepartement(data);
  };
  const getUp = async (data: Up) => {
    setUp(data);
  };

  return (
    <div className=" flex-col md:flex sm:grid sm:grid-cols-1 ">
      <div className="flex-1 space-y-4 p-8 pt-6 w-full">
        <div className="flex items-center justify-center space-y-2">
          <h2 className="text-3xl font-bold tracking-tight ">Opérations</h2>
        </div>
        <Tabs defaultValue="niveaux" className="space-y-4 ">
          <TabsList>
            <TabsTrigger value="niveaux">Niveaux</TabsTrigger>
            <TabsTrigger value="options">Options</TabsTrigger>
            <TabsTrigger value="classes">Classes</TabsTrigger>
            <TabsTrigger value="modules">Modules</TabsTrigger>
            <TabsTrigger value="departements">Départements</TabsTrigger>
            <TabsTrigger value="ups">Ups</TabsTrigger>
          </TabsList>
          <TabsContent value="niveaux" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-5  border-red-400 dark:border-cyan-600">
                <CardHeader>
                  <CardTitle>Tableau</CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                  <DataTableDemo func={getData} />
                </CardContent>
              </Card>
              <Card className="col-span-2 border-red-400 dark:border-cyan-600 ">
                <CardHeader>
                  <CardTitle>Formulaire</CardTitle>
                </CardHeader>
                <CardContent>
                  <NiveauForm niv={niveaux} />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="options" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-5  border-red-400 dark:border-cyan-600">
                <CardHeader>
                  <CardTitle>Tableau</CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                  <OptionsTable func={getOption} />
                </CardContent>
              </Card>
              <Card className="col-span-2 border-red-400 dark:border-cyan-600 ">
                <CardHeader>
                  <CardTitle>Formulaire</CardTitle>
                </CardHeader>
                <CardContent>
                  <OptionForm opt={option} />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="classes" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-5  border-red-400 dark:border-cyan-600">
                <CardHeader>
                  <CardTitle>Tableau</CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                  <ClassesTable func={getClasse} />
                </CardContent>
              </Card>
              <Card className="col-span-2 border-red-400 dark:border-cyan-600 ">
                <CardHeader>
                  <CardTitle>Formulaire</CardTitle>
                </CardHeader>
                <CardContent>
                  <ClasseForm cls={classe} />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="departements" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-5  border-red-400 dark:border-cyan-600">
                <CardHeader>
                  <CardTitle>Tableau</CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                  <DepartementsTable func={getDepartement} />
                </CardContent>
              </Card>
              <Card className="col-span-2 border-red-400 dark:border-cyan-600 ">
                <CardHeader>
                  <CardTitle>Formulaire</CardTitle>
                </CardHeader>
                <CardContent>
                  <DepartementForm dep={departement} />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="ups" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-5  border-red-400 dark:border-cyan-600">
                <CardHeader>
                  <CardTitle>Tableau</CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                  <UpsTable func={getUp} />
                </CardContent>
              </Card>
              <Card className="col-span-2 border-red-400 dark:border-cyan-600 ">
                <CardHeader>
                  <CardTitle>Formulaire</CardTitle>
                </CardHeader>
                <CardContent>
                  <UpForm up={up} />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
