import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { EquipmentItem, HomepageContent } from "../backend";
import { useActor } from "./useActor";

export function useHomepageContent() {
  const { actor, isFetching } = useActor();
  return useQuery<HomepageContent>({
    queryKey: ["homepageContent"],
    queryFn: async () => {
      if (!actor) return { storyText: "", operatorPhoto: undefined };
      return actor.getHomepageContent();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useItems() {
  const { actor, isFetching } = useActor();
  return useQuery<EquipmentItem[]>({
    queryKey: ["items"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getItems();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useIsAdmin() {
  const { actor, isFetching } = useActor();
  return useQuery<boolean>({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      try {
        return await actor.isCallerAdminSafe();
      } catch {
        return false;
      }
    },
    enabled: !!actor && !isFetching,
  });
}

export function useClaimFirstAdmin() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("No actor");
      return actor.claimFirstAdmin();
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["isAdmin"] }),
  });
}

export function useSetHomepageContent() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (content: HomepageContent) => {
      if (!actor) throw new Error("No actor");
      return actor.setHomepageContent(content);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["homepageContent"] }),
  });
}

export function useAddItem() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (item: EquipmentItem) => {
      if (!actor) throw new Error("No actor");
      return actor.addItem(item);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["items"] }),
  });
}

export function useUpdateItem() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (item: EquipmentItem) => {
      if (!actor) throw new Error("No actor");
      return actor.updateItem(item);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["items"] }),
  });
}

export function useDeleteItem() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("No actor");
      return actor.deleteItem(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["items"] }),
  });
}

export function useGetNextItemId() {
  const { actor, isFetching } = useActor();
  return useQuery<bigint>({
    queryKey: ["nextItemId"],
    queryFn: async () => {
      if (!actor) return BigInt(1);
      return actor.getNextItemId();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useVisitorCount() {
  const { actor, isFetching } = useActor();
  return useQuery<bigint>({
    queryKey: ["visitorCount"],
    queryFn: async () => {
      if (!actor) return BigInt(0);
      return actor.getVisitorCount();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useIncrementVisitorCount() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      if (!actor) return BigInt(0);
      return actor.incrementVisitorCount();
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["visitorCount"] }),
  });
}
