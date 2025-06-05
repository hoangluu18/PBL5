export interface Category {
    id: number;
    name: string;
}


export interface CategoryDto {
    id: number;
    name: string;
    alias: string;
    enabled: boolean;
    image: string;
    parent_id: number | null;
    all_parent_ids: string; // Comma-separated IDs of all parent categories
}