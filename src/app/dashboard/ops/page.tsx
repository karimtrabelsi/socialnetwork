"use client";
import { DataTableDemo } from "@/app/tables/data-table";
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
import { Niveau } from "@prisma/client";
import React from "react";

const metadata: Metadata = {
  title: "Dashboard",
  description: "Example dashboard app using the components.",
};

export default function OpsPage() {
  const [niveaux, setNiveaux] = React.useState<Niveau>();
  const getData = async (data: Niveau) => {
    setNiveaux(data);
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
        </Tabs>
      </div>
    </div>
  );
}
