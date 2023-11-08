"use client";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { Classe, Up, User } from "@prisma/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { FormEvent, useState } from "react";

type UPS = {
  id: string;
  nom: string;
};

type Module = {
  id: string;
  nom: string;
};

type Teacher = {
  id: string;
  nom: string;
  prenom: string;
};

type AdminAssignmentsProps = {};

export default function AdminAssignments(props: AdminAssignmentsProps) {
  const [selectedUpsId, setSelectedUpsId] = useState<string | null>(null);
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);
  const [selectedClasses, setSelectedClasses] = useState<Classe[] | null>(null);
  const [selectedTeacherId, setSelectedTeacherId] = useState<string | null>(
    null
  );
  const [selectedTeacherUp, setSelectedTeacherUp] = useState<string | null>(
    null
  );
  const [selectedTeacherModule, setSelectedTeacherModule] = useState<
    string | null
  >(null);
  const [periode, setPeriode] = useState<string>("P1");
  const { data: ups, isLoading: upsLoading } = useQuery<UPS[]>({
    queryKey: ["ups"],
    queryFn: async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER}/api/ups`);
      const data = await res.json();
      return data.up;
    },
  });
  const { data: modules, isLoading: modulesLoading } = useQuery<Module[]>({
    queryKey: ["modules", periode],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER}/api/modules?periode=${periode}`
      );
      const data = await res.json();
      return data.modules;
    },
  });
  const { data: classes, isLoading: classesLoading } = useQuery<Classe[]>({
    queryKey: ["classes", selectedModuleId],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER}/api/teachers/classes?moduleId=${selectedModuleId}`
      );
      const data = await res.json();
      return data.classes;
    },
  });
  const {
    data: classesWithModuleAndTeacher,
    isLoading: classesWithModuleAndTeacherLoading,
  } = useQuery<Classe[]>({
    queryKey: [
      "classesWithModuleAndTeacher",
      selectedModuleId,
      selectedTeacherId,
    ],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER}/api/teachers/classesWithModuleAndTeacher?moduleId=${selectedModuleId}&teacherId=${selectedTeacherId}`
      );
      const data = await res.json();
      return data.classesWithModuleAndTeacher;
    },
  });

  const { data: allTeachers, isLoading: allTeachersLoadidng } = useQuery<
    User[]
  >({
    queryKey: ["allTeachers"],
    queryFn: async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER}/api/users`);
      const data = await res.json();
      return data.teachers;
    },
  });

  const { data: teachers } = useQuery<User[]>({
    queryKey: ["teachers", selectedModuleId],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER}/api/teachers?moduleId=${selectedModuleId}`
      );
      const data = await res.json();
      return data.teachers;
    },
  });
  const { data: teacherModules } = useQuery<Module[]>({
    queryKey: ["teacherModules", selectedTeacherId],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER}/api/teachers/edit/modules?userId=${selectedTeacherId}`
      );
      const data = await res.json();
      return data.modules;
    },
  });
  const { data: teacherUps } = useQuery<Up[]>({
    queryKey: ["teacherUps", selectedTeacherId],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER}/api/teachers/edit/ups?userId=${selectedTeacherId}`
      );
      const data = await res.json();
      return data.ups;
    },
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  type AssignData = {
    selectedUpsId: string | null;
    selectedModuleId: string | null;
    selectedTeacherId: string | null;
    classesTab: Classe[] | null;
  };
  type EditData = {
    selectedTeacherUp: string | null;
    selectedTeacherModule: string | null;
    selectedTeacherId: string | null;
  };
  const { mutate, isLoading } = useMutation({
    mutationKey: ["assign"],
    mutationFn: async (values: AssignData) => {
      await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER}/api/teachers`,
        values
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries([
        "teachers",
        "classesWithModuleAndTeacher",
      ]);
      toast({
        description: "Succès ✅",
      });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "Error.",
      });
    },
  });
  const { mutate: edit, isLoading: editLoading } = useMutation({
    mutationKey: ["edit"],
    mutationFn: async (values: EditData) => {
      await axios.put(`${process.env.NEXT_PUBLIC_SERVER}/api/teachers`, values);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["teacherModules"]);
      queryClient.invalidateQueries(["teacherUps"]);
      toast({
        description: "Succès ✅",
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

  const [isAssign, setIsAssign] = useState<boolean>(true);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (selectedClasses?.length! > 3) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description:
          "You can't assign more than 3 classes per module to a teacher.",
      });
      return;
    }
    isAssign
      ? await mutate({
          selectedUpsId,
          selectedModuleId,
          selectedTeacherId,
          classesTab: selectedClasses,
        })
      : await edit({
          selectedTeacherUp,
          selectedTeacherModule,
          selectedTeacherId,
        });
  };

  if (isAssign)
    return (
      <div className="flex justify-center items-center px-10 h-full w-full pt-16">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Assign classes and modules to teachers</CardTitle>
            <CardDescription>
              Assign classes and modules to teachers.
            </CardDescription>
            <div className="flex items-center space-x-2 pr-20">
              <Switch
                id="assign-mode"
                onCheckedChange={() => setIsAssign(!isAssign)}
              />
              <Label htmlFor="assign-mode">
                {isAssign ? "Assign Mode" : " Edit Mode"}
              </Label>
            </div>
            <div className="flex items-center justify-center space-x-2 pr-20">
              <Switch
                id="assign-mode"
                onCheckedChange={() => {
                  setPeriode(periode == "P1" ? "P2" : "P1");
                  queryClient.invalidateQueries(["teachers", selectedModuleId]);
                }}
              />
              <Label htmlFor="assign-mode">{periode}</Label>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmit}>
              <div className="grid grid-cols-4 gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="ups">UPS</Label>
                  <div className="h-[400px] overflow-y-auto bg-gray-100 dark:bg-gray-800 rounded-md">
                    {ups?.map((up) => (
                      <div
                        key={up.id}
                        className={`p-2 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 ${
                          selectedUpsId === up.id
                            ? "bg-gray-300 dark:bg-gray-600"
                            : ""
                        }`}
                        onClick={() => setSelectedUpsId(up.id)}
                      >
                        <div className="flex justify-between items-center">
                          <div>{up.nom}</div>
                          <div className="w-px h-4 bg-gray-400 dark:bg-gray-600 mx-2" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="module">Modules</Label>
                  <div className="h-[400px] overflow-y-auto bg-gray-100 dark:bg-gray-800 rounded-md">
                    {modules?.map((module) => (
                      <div
                        key={module.id}
                        className={`p-2 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 ${
                          selectedModuleId === module.id
                            ? "bg-gray-300 dark:bg-gray-600"
                            : ""
                        }`}
                        onClick={() => setSelectedModuleId(module.id)}
                      >
                        <div className="flex justify-between items-center">
                          <div>{module.nom}</div>
                          <div className="w-px h-4 bg-gray-400 dark:bg-gray-600 mx-2" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="module">Teachers</Label>
                  <div className="h-[400px] overflow-y-auto bg-gray-100 dark:bg-gray-800 rounded-md">
                    {teachers?.map((teacher) => (
                      <div
                        key={teacher.id}
                        className={`p-2 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 ${
                          selectedTeacherId === teacher.id
                            ? "bg-gray-300 dark:bg-gray-600"
                            : ""
                        }`}
                        onClick={() => setSelectedTeacherId(teacher.id)}
                      >
                        <div className="flex justify-between items-center">
                          <div>{teacher.name}</div>
                          <div className="w-px h-4 bg-gray-400 dark:bg-gray-600 mx-2" />
                        </div>
                        {selectedTeacherId && (
                          <div>
                            <ul className="text-sm">
                              <li>
                                {/* @ts-ignore */}
                                Nombre de classes : {teacher.classes?.length}
                              </li>
                              <li>
                                Créneaux restants :{" "}
                                {(189 - teacher.charge!) / 21}
                              </li>
                              <li>
                                Chargé déja avec{" "}
                                {modules?.map((m) => {
                                  if (m.id === selectedModuleId) {
                                    return m.nom;
                                  }
                                })}{" "}
                                :{" "}
                                {
                                  //  @ts-ignore
                                  teacher.modules?.find(
                                    (m: Module) => m.id === selectedModuleId
                                  )
                                    ? "Oui"
                                    : "Non"
                                }
                              </li>
                              <li>
                                Classes :{" "}
                                {classesWithModuleAndTeacher?.length &&
                                  classesWithModuleAndTeacher
                                    ?.map((c) => c.nom)
                                    .join(", ")}
                              </li>
                            </ul>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="module">Classes</Label>
                  <div className="h-[400px] overflow-y-auto bg-gray-100 dark:bg-gray-800 rounded-md">
                    {classes?.map((classe) => (
                      <div
                        key={classe.id}
                        className={`p-2 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 ${
                          classe.id ===
                          selectedClasses?.find((c) => c.id === classe.id)?.id
                            ? "bg-gray-300 dark:bg-gray-600"
                            : ""
                        }`}
                        onClick={() =>
                          setSelectedClasses(
                            selectedClasses?.find((c) => c.id === classe.id)
                              ? selectedClasses?.filter(
                                  (c) => c.id !== classe.id
                                )
                              : selectedClasses
                              ? [...selectedClasses, classe]
                              : [classe]
                          )
                        }
                      >
                        <div className="flex justify-between items-center">
                          <div>{classe.nom}</div>
                          <div className="w-px h-4 bg-gray-400 dark:bg-gray-600 mx-2" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col space-y-1.5 col-span-4">
                  <Button
                    type="submit"
                    disabled={
                      !selectedUpsId || !selectedModuleId || !selectedTeacherId
                    }
                  >
                    {isLoading && (
                      <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Assign
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  else
    return (
      <div className="flex justify-center items-center px-10 h-full w-full pt-16">
        <Card className="w-[800px]">
          <CardHeader>
            <CardTitle>Assign classes and modules to teachers</CardTitle>
            <CardDescription>
              Assign classes and modules to teachers.
            </CardDescription>
            <div className="flex items-center space-x-2 pr-20">
              <Switch
                id="assign-mode"
                onCheckedChange={() => setIsAssign(!isAssign)}
              />
              <Label htmlFor="assign-mode">
                {isAssign ? "Assign Mode" : " Edit Mode"}
              </Label>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmit}>
              <div className="grid grid-cols-3 gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="ups">UPS</Label>
                  <div className="h-[400px] overflow-y-auto bg-gray-100 dark:bg-gray-800 rounded-md">
                    {teacherUps?.map((up) => (
                      <div
                        key={up.id}
                        className={`p-2 cursor-pointer hover:bg-red-200 dark:hover:bg-gray-700 ${
                          selectedTeacherUp === up.id
                            ? "bg-red-300 dark:bg-gray-600"
                            : ""
                        }`}
                        onClick={() => setSelectedTeacherUp(up.id)}
                      >
                        <div className="flex justify-between items-center">
                          <div>{up.nom}</div>
                          <div className="w-px h-4 bg-gray-400 dark:bg-gray-600 mx-2" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="module">Modules</Label>
                  <div className="h-[400px] overflow-y-auto bg-gray-100 dark:bg-gray-800 rounded-md">
                    {teacherModules?.map((module) => (
                      <div
                        key={module.id}
                        className={`p-2 cursor-pointer hover:bg-red-200 dark:hover:bg-gray-700 ${
                          selectedTeacherModule === module.id
                            ? "bg-red-300 dark:bg-gray-600"
                            : ""
                        }`}
                        onClick={() => setSelectedTeacherModule(module.id)}
                      >
                        <div className="flex justify-between items-center">
                          <div>{module.nom}</div>
                          <div className="w-px h-4 bg-gray-400 dark:bg-gray-600 mx-2" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="module">Teachers</Label>
                  <div className="h-[400px] overflow-y-auto bg-gray-100 dark:bg-gray-800 rounded-md">
                    {allTeachers?.map((teacher) => (
                      <div
                        key={teacher.id}
                        className={`p-2 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 ${
                          selectedTeacherId === teacher.id
                            ? "bg-gray-300 dark:bg-gray-600"
                            : ""
                        }`}
                        onClick={() => setSelectedTeacherId(teacher.id)}
                      >
                        <div className="flex justify-between items-center">
                          <div>{teacher.name}</div>
                          <div className="w-px h-4 bg-gray-400 dark:bg-gray-600 mx-2" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col space-y-1.5 col-span-3">
                  <Button
                    type="submit"
                    disabled={!selectedTeacherUp && !selectedTeacherModule}
                  >
                    {editLoading && (
                      <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Edit
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    );
}
