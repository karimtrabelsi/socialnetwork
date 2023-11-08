import { db } from "@/lib/db";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const moduleId = searchParams.get("moduleId");

  const teachers = await db.user.findMany({
    where: {
      competences: {
        some: {
          moduleId: moduleId as string,
        },
      },
    },
    include: {
      modules: true,
      up: true,
      classes: true,
    },
  });

  return Response.json({ teachers });
}
type classes = {
  id: string;
};
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { selectedUpsId, selectedModuleId, selectedTeacherId, classesTab } =
    body;
  const modulee = await db.module.findUnique({
    where: {
      id: selectedModuleId,
    },
  });
  const user = await db.user.findUnique({
    where: {
      id: selectedTeacherId,
    },
    include: {
      classes: true,
    },
  });
  const classes = await db.classe.findMany({
    where: {
      id: {
        in: classesTab.map((classe: classes) => classe.id),
      },
    },
  });
  const classesWithModule = await db.classe.findMany({
    where: {
      modules: {
        some: {
          id: selectedModuleId,
        },
      },
      enseignants: {
        some: {
          id: selectedTeacherId,
        },
      },
    },
  });

  if (
    (user?.role == "ENSEIGNANT" &&
      user?.charge &&
      modulee?.chargeHoraire &&
      user.charge + modulee.chargeHoraire < 189 &&
      classesWithModule &&
      classesWithModule.length < 3 &&
      user?.classes &&
      user.classes.length < 9 &&
      classes.length + classesWithModule.length <= 3) ||
    (user?.role == "COORDINATEUR" &&
      user?.charge &&
      modulee?.chargeHoraire &&
      user.charge + modulee.chargeHoraire < 168 &&
      user?.classes &&
      user.classes.length < 9)
  ) {
    const teacher = await db.user.update({
      where: {
        id: selectedTeacherId,
      },
      data: {
        modules: {
          connect: {
            id: selectedModuleId,
          },
        },
        up: {
          connect: {
            id: selectedUpsId,
          },
        },
        charge: {
          set: user?.charge! + modulee?.chargeHoraire! * classes.length,
        },
        classes: {
          connect: classes.map((classe) => ({
            id: classe.id,
          })),
        },
      },
    });

    return Response.json({ teacher });
  }
  console.log(classes.length + classesWithModule.length);
  return new Response("error", {
    status: 400,
  });
}

export async function PUT(req: NextRequest) {
  const body = await req.json();
  const { selectedTeacherUp, selectedTeacherModule, selectedTeacherId } = body;

  if (!selectedTeacherUp) {
    const teacher = await db.user.update({
      where: {
        id: selectedTeacherId,
      },
      data: {
        modules: {
          disconnect: {
            id: selectedTeacherModule,
          },
        },
      },
    });
    return Response.json({ teacher });
  }

  if (!selectedTeacherModule) {
    const teacher = await db.user.update({
      where: {
        id: selectedTeacherId,
      },
      data: {
        up: {
          disconnect: {
            id: selectedTeacherUp,
          },
        },
      },
    });
    return Response.json({ teacher });
  }

  const teacher = await db.user.update({
    where: {
      id: selectedTeacherId,
    },
    data: {
      modules: {
        disconnect: {
          id: selectedTeacherModule,
        },
      },
      up: {
        disconnect: {
          id: selectedTeacherUp,
        },
      },
    },
  });

  return Response.json({ teacher });
}
