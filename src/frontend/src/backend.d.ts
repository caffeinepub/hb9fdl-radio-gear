import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface EquipmentItem {
    id: bigint;
    description: string;
    itemNumber: string;
    price: string;
    mainPhoto?: ExternalBlob;
    subPhotos: Array<ExternalBlob>;
}
export interface HomepageContent {
    storyText: string;
    operatorPhoto?: ExternalBlob;
}
export interface UserProfile {
    name: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addItem(item: EquipmentItem): Promise<bigint>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    claimFirstAdmin(): Promise<boolean>;
    deleteItem(id: bigint): Promise<boolean>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getHomepageContent(): Promise<HomepageContent>;
    getItems(): Promise<Array<EquipmentItem>>;
    getNextItemId(): Promise<bigint>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    incrementVisitorCount(): Promise<bigint>;
    getVisitorCount(): Promise<bigint>;
    isCallerAdmin(): Promise<boolean>;
    isCallerAdminSafe(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    setHomepageContent(content: HomepageContent): Promise<boolean>;
    updateItem(item: EquipmentItem): Promise<boolean>;
}
