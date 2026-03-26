import Nat "mo:core/Nat";
import Map "mo:core/Map";
import Iter "mo:core/Iter";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";
import Storage "blob-storage/Storage";
import MixinStorage "blob-storage/Mixin";
import Migration "migration";

(with migration = Migration.run)
actor {
  include MixinStorage();

  type EquipmentItem = {
    id : Nat;
    itemNumber : Text;
    description : Text;
    mainPhoto : ?Storage.ExternalBlob;
    subPhotos : [Storage.ExternalBlob];
    price : Text;
  };

  module EquipmentItem {
    public func compare(item1 : EquipmentItem, item2 : EquipmentItem) : { #less; #equal; #greater } {
      Nat.compare(item1.id, item2.id);
    };
  };

  let items = Map.empty<Nat, EquipmentItem>();

  var nextId = 0;

  type HomepageContent = {
    operatorPhoto : ?Storage.ExternalBlob;
    storyText : Text;
  };

  var homepageContent : HomepageContent = {
    operatorPhoto = null;
    storyText = "";
  };

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  public type UserProfile = {
    name : Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  // Allows the first authenticated caller to claim admin rights.
  // Once an admin exists, this function does nothing.
  public shared ({ caller }) func claimFirstAdmin() : async Bool {
    if (caller.isAnonymous()) { return false };
    if (accessControlState.adminAssigned) { return false };
    accessControlState.userRoles.add(caller, #admin);
    accessControlState.adminAssigned := true;
    true;
  };

  // Safe version that returns false instead of trapping for unregistered users
  public query ({ caller }) func isCallerAdminSafe() : async Bool {
    if (caller.isAnonymous()) { return false };
    switch (accessControlState.userRoles.get(caller)) {
      case (? #admin) { true };
      case (_) { false };
    };
  };

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

  // Public query - anyone can view items in the selling site
  public query ({ caller }) func getItems() : async [EquipmentItem] {
    items.values().toArray().sort();
  };

  // Admin-only query - exposes internal state
  public query ({ caller }) func getNextItemId() : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can access next item ID");
    };
    nextId;
  };

  // Public query - anyone can view homepage content
  public query ({ caller }) func getHomepageContent() : async HomepageContent {
    homepageContent;
  };

  public shared ({ caller }) func addItem(item : EquipmentItem) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add items");
    };
    let id = nextId;
    let newItem = {
      id;
      itemNumber = item.itemNumber;
      description = item.description;
      mainPhoto = item.mainPhoto;
      subPhotos = item.subPhotos;
      price = item.price;
    };
    items.add(id, newItem);
    nextId += 1;
    id;
  };

  public shared ({ caller }) func updateItem(item : EquipmentItem) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update items");
    };
    items.add(item.id, item);
    true;
  };

  public shared ({ caller }) func deleteItem(id : Nat) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete items");
    };
    items.remove(id);
    true;
  };

  public shared ({ caller }) func setHomepageContent(content : HomepageContent) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can set homepage content");
    };
    homepageContent := content;
    true;
  };
};

