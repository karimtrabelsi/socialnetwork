import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useNiveaux = () => {
  return useQuery({
    queryKey: ["niveaux"],
    queryFn: async () =>
      await fetch(`${process.env.NEXT_PUBLIC_SERVER}/api/niveaux`).then((res) =>
        res.json()
      ),
  });
};
