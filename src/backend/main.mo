import Nat "mo:core/Nat";
import Map "mo:core/Map";
import Iter "mo:core/Iter";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";
import Storage "blob-storage/Storage";
import MixinStorage "blob-storage/Mixin";



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

  // Visitor counter
  var visitorCount : Nat = 0;

  public shared func incrementVisitorCount() : async Nat {
    visitorCount += 1;
    visitorCount;
  };

  public query func getVisitorCount() : async Nat {
    visitorCount;
  };

  // Allows the first authenticated caller to claim admin rights.
  public shared ({ caller }) func claimFirstAdmin() : async Bool {
    if (caller.isAnonymous()) { return false };
    if (accessControlState.adminAssigned) { return false };
    accessControlState.userRoles.add(caller, #admin);
    accessControlState.adminAssigned := true;
    true;
  };

  public query ({ caller }) func isCallerAdminSafe() : async Bool {
    if (caller.isAnonymous()) { return false };
    switch (accessControlState.userRoles.get(caller)) {
      case (? #admin) { true };
      case (_) { false };
    };
  };

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    userProfiles.add(caller, profile);
  };

  // Public query - anyone can view items
  public query ({ caller }) func getItems() : async [EquipmentItem] {
    items.values().toArray().sort();
  };

  // Anyone can get next item ID (needed for admin panel without login)
  public query ({ caller }) func getNextItemId() : async Nat {
    nextId;
  };

  // Public query - anyone can view homepage content
  public query ({ caller }) func getHomepageContent() : async HomepageContent {
    homepageContent;
  };

  public shared ({ caller }) func addItem(item : EquipmentItem) : async Nat {
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
    items.add(item.id, item);
    true;
  };

  public shared ({ caller }) func deleteItem(id : Nat) : async Bool {
    items.remove(id);
    true;
  };

  public shared ({ caller }) func setHomepageContent(content : HomepageContent) : async Bool {
    homepageContent := content;
    true;
  };
};
