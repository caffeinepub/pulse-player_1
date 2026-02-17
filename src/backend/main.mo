import Array "mo:core/Array";
import Map "mo:core/Map";
import Text "mo:core/Text";
import Runtime "mo:core/Runtime";
import Iter "mo:core/Iter";
import Principal "mo:core/Principal";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  public type Track = {
    id : Text;
    title : Text;
    artist : Text;
    album : Text;
  };

  public type UserProfile = {
    name : Text;
    email : ?Text;
  };

  public type PlaylistData = {
    name : Text;
    tracks : [Track];
    owner : Principal;
  };

  let userPlaylists = Map.empty<Principal, Map.Map<Text, PlaylistData>>();
  let favoritesStorage = Map.empty<Principal, [Text]>();
  let playbackHistory = Map.empty<Principal, [Text]>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  public shared ({ caller }) func createPlaylist(name : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create playlists");
    };

    let userPlaylistMap = switch (userPlaylists.get(caller)) {
      case (?playlists) { playlists };
      case (null) {
        let newMap = Map.empty<Text, PlaylistData>();
        userPlaylists.add(caller, newMap);
        newMap;
      };
    };

    if (userPlaylistMap.containsKey(name)) {
      Runtime.trap("Playlist already exists");
    };

    let playlistData : PlaylistData = {
      name = name;
      tracks = [];
      owner = caller;
    };
    userPlaylistMap.add(name, playlistData);
  };

  public shared ({ caller }) func renamePlaylist(oldName : Text, newName : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can rename playlists");
    };

    let userPlaylistMap = switch (userPlaylists.get(caller)) {
      case (?playlists) { playlists };
      case (null) { Runtime.trap("No playlists found") };
    };

    switch (userPlaylistMap.get(oldName)) {
      case (?playlistData) {
        if (playlistData.owner != caller) {
          Runtime.trap("Unauthorized: Can only rename your own playlists");
        };
        if (userPlaylistMap.containsKey(newName)) {
          Runtime.trap("Playlist with new name already exists");
        };
        let updatedData : PlaylistData = {
          name = newName;
          tracks = playlistData.tracks;
          owner = playlistData.owner;
        };
        userPlaylistMap.remove(oldName);
        userPlaylistMap.add(newName, updatedData);
      };
      case (null) { Runtime.trap("Playlist not found") };
    };
  };

  public shared ({ caller }) func deletePlaylist(name : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can delete playlists");
    };

    let userPlaylistMap = switch (userPlaylists.get(caller)) {
      case (?playlists) { playlists };
      case (null) { Runtime.trap("No playlists found") };
    };

    switch (userPlaylistMap.get(name)) {
      case (?playlistData) {
        if (playlistData.owner != caller) {
          Runtime.trap("Unauthorized: Can only delete your own playlists");
        };
        userPlaylistMap.remove(name);
      };
      case (null) { Runtime.trap("Playlist not found") };
    };
  };

  public shared ({ caller }) func addTrackToPlaylist(playlistName : Text, track : Track) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can modify playlists");
    };

    let userPlaylistMap = switch (userPlaylists.get(caller)) {
      case (?playlists) { playlists };
      case (null) { Runtime.trap("No playlists found") };
    };

    switch (userPlaylistMap.get(playlistName)) {
      case (?playlistData) {
        if (playlistData.owner != caller) {
          Runtime.trap("Unauthorized: Can only modify your own playlists");
        };
        let newPlaylistData : PlaylistData = {
          name = playlistData.name;
          tracks = playlistData.tracks.concat([track]);
          owner = playlistData.owner;
        };
        userPlaylistMap.add(playlistName, newPlaylistData);
      };
      case (null) { Runtime.trap("Playlist not found") };
    };
  };

  public shared ({ caller }) func removeTrackFromPlaylist(playlistName : Text, trackId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can modify playlists");
    };

    let userPlaylistMap = switch (userPlaylists.get(caller)) {
      case (?playlists) { playlists };
      case (null) { Runtime.trap("No playlists found") };
    };

    switch (userPlaylistMap.get(playlistName)) {
      case (?playlistData) {
        if (playlistData.owner != caller) {
          Runtime.trap("Unauthorized: Can only modify your own playlists");
        };
        let updatedTracks = playlistData.tracks.filter(func(track) { track.id != trackId });
        let newPlaylistData : PlaylistData = {
          name = playlistData.name;
          tracks = updatedTracks;
          owner = playlistData.owner;
        };
        userPlaylistMap.add(playlistName, newPlaylistData);
      };
      case (null) { Runtime.trap("Playlist not found") };
    };
  };

  public query ({ caller }) func getPlaylist(name : Text) : async ?[Track] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view playlists");
    };

    switch (userPlaylists.get(caller)) {
      case (?userPlaylistMap) {
        switch (userPlaylistMap.get(name)) {
          case (?playlistData) {
            if (playlistData.owner != caller) {
              Runtime.trap("Unauthorized: Can only view your own playlists");
            };
            ?playlistData.tracks;
          };
          case (null) { null };
        };
      };
      case (null) { null };
    };
  };

  public query ({ caller }) func getAllPlaylists() : async [Text] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view playlists");
    };

    switch (userPlaylists.get(caller)) {
      case (?userPlaylistMap) {
        let names = userPlaylistMap.keys();
        names.toArray();
      };
      case (null) { [] };
    };
  };

  public shared ({ caller }) func toggleFavorite(trackId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can manage favorites");
    };

    let currentFavorites = switch (favoritesStorage.get(caller)) {
      case (?favorites) { favorites };
      case (null) {
        let newArray : [Text] = [];
        favoritesStorage.add(caller, newArray);
        newArray;
      };
    };

    let isFavorite = currentFavorites.any(func(id) { id == trackId });

    if (isFavorite) {
      let updatedFavorites = currentFavorites.filter(func(id) { id != trackId });
      favoritesStorage.add(caller, updatedFavorites);
    } else {
      let updatedFavorites = currentFavorites.concat([trackId]);
      favoritesStorage.add(caller, updatedFavorites);
    };
  };

  public query ({ caller }) func getFavorites() : async [Text] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view favorites");
    };

    switch (favoritesStorage.get(caller)) {
      case (?favorites) { favorites };
      case (null) { [] };
    };
  };

  public shared ({ caller }) func addToHistory(trackId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can track history");
    };

    let currentHistory = switch (playbackHistory.get(caller)) {
      case (?history) { history };
      case (null) {
        let newArray : [Text] = [];
        playbackHistory.add(caller, newArray);
        newArray;
      };
    };

    // Add to front of history, limit to 100 items
    let updatedHistory = [trackId].concat(currentHistory);
    let limitedHistory = if (updatedHistory.size() > 100) {
      updatedHistory.sliceToArray(0, 100);
    } else { updatedHistory };
    playbackHistory.add(caller, limitedHistory);
  };

  public query ({ caller }) func getHistory() : async [Text] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view history");
    };

    switch (playbackHistory.get(caller)) {
      case (?history) { history };
      case (null) { [] };
    };
  };

  public shared ({ caller }) func clearHistory() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can clear history");
    };

    playbackHistory.add(caller, []);
  };

  public shared ({ caller }) func getAllUsers() : async [Principal] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can view all users");
    };

    let users = userProfiles.keys();
    users.toArray();
  };
};
