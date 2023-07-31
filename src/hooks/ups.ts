import { useQuery } from "@tanstack/react-query";

export const useUps = () => {
  return useQuery({
    queryKey: ["ups"],
    queryFn: async () =>
      await fetch(`${process.env.NEXT_PUBLIC_SERVER}/api/ups`).then((res) =>
        res.json()
      ),
  });
};
