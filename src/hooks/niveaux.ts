import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useNiveaux = () => {
  return useQuery({
    queryKey: ["niveaux"],
    queryFn: async () =>
      await fetch(`http://localhost:3000/api/niveaux`).then((res) =>
        res.json()
      ),
  });
};
