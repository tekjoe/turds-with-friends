export interface EnrichedLocationPin {
  id: string;
  latitude: number;
  longitude: number;
  place_name: string | null;
  created_at: string;
  bristol_type: number | null;
  logged_at: string | null;
  pre_weight: number | null;
  post_weight: number | null;
  weight_unit: string;
  xp_earned: number;
}

export interface EnrichedFriendPin extends EnrichedLocationPin {
  friendName: string;
  friendAvatar: string | null;
  friendId: string;
}

export interface MapFiltersState {
  dateRange: "all" | "7d" | "30d" | "90d" | "custom";
  dateFrom: string | null;
  dateTo: string | null;
  bristolTypes: number[];
  friendFilter: "all" | "mine" | string; // "all", "mine", or a specific friendId
}

export const DEFAULT_FILTERS: MapFiltersState = {
  dateRange: "all",
  dateFrom: null,
  dateTo: null,
  bristolTypes: [],
  friendFilter: "all",
};

export const BRISTOL_LABELS: Record<number, string> = {
  1: "Hard lumps",
  2: "Lumpy sausage",
  3: "Cracked sausage",
  4: "Smooth snake",
  5: "Soft blobs",
  6: "Mushy",
  7: "Liquid",
};

export const BRISTOL_COLORS: Record<number, string> = {
  1: "#8B4513",
  2: "#A0522D",
  3: "#6B8E23",
  4: "#228B22",
  5: "#DAA520",
  6: "#CD853F",
  7: "#B22222",
};
