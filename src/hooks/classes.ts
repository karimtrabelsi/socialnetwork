import { useQuery } from "@tanstack/react-query";

export const useClasses = () => {
  return useQuery({
    queryKey: ["classes"],
    queryFn: async () =>
      await fetch(`${process.env.NEXT_PUBLIC_SERVER}/api/classes`).then((res) =>
        res.json()
      ),
  });
};
