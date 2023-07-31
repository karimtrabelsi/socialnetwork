import { useQuery } from "@tanstack/react-query";

export const useOptions = () => {
  return useQuery({
    queryKey: ["options"],
    queryFn: async () =>
      await fetch(`${process.env.NEXT_PUBLIC_SERVER}/api/options`).then((res) =>
        res.json()
      ),
  });
};
