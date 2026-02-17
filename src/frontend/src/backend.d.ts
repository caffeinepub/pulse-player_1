import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Track {
    id: string;
    title: string;
    album: string;
    artist: string;
}
export interface UserProfile {
    name: string;
    email?: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addToHistory(trackId: string): Promise<void>;
    addTrackToPlaylist(playlistName: string, track: Track): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    clearHistory(): Promise<void>;
    createPlaylist(name: string): Promise<void>;
    deletePlaylist(name: string): Promise<void>;
    getAllPlaylists(): Promise<Array<string>>;
    getAllUsers(): Promise<Array<Principal>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getFavorites(): Promise<Array<string>>;
    getHistory(): Promise<Array<string>>;
    getPlaylist(name: string): Promise<Array<Track> | null>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    removeTrackFromPlaylist(playlistName: string, trackId: string): Promise<void>;
    renamePlaylist(oldName: string, newName: string): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    toggleFavorite(trackId: string): Promise<void>;
}
