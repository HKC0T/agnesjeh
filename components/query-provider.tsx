"use client";
import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { FC, ReactNode } from "react";

interface QueryProvidersProps {
  children: ReactNode;
}
const queryClient = new QueryClient();
const QueryProviders: FC<QueryProvidersProps> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

export default QueryProviders;
