import { useQuery } from "@tanstack/react-query";

export const useModules = () => {
  return useQuery({
    queryKey: ["modules"],
    queryFn: async () =>
      await fetch(`${process.env.NEXT_PUBLIC_SERVER}/api/modules`).then((res) =>
        res.json()
      ),
  });
};
