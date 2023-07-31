import { useQuery } from "@tanstack/react-query";

export const useDepartements = () => {
  return useQuery({
    queryKey: ["departements"],
    queryFn: async () =>
      await fetch(`${process.env.NEXT_PUBLIC_SERVER}/api/departements`).then(
        (res) => res.json()
      ),
  });
};
