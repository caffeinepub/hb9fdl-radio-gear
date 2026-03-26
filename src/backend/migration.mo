import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Storage "blob-storage/Storage";
import AccessControl "authorization/access-control";
import Principal "mo:core/Principal";

module {
  type OldEquipmentItem = {
    id : Nat;
    itemNumber : Text;
    description : Text;
    photo : ?Storage.ExternalBlob;
    price : Text;
  };

  type OldHomepageContent = {
    photo : ?Storage.ExternalBlob;
    storyText : Text;
  };

  type OldActor = {
    items : Map.Map<Nat, OldEquipmentItem>;
    nextId : Nat;
    homepageContent : OldHomepageContent;
    accessControlState : AccessControl.AccessControlState;
    userProfiles : Map.Map<Principal, { name : Text }>;
  };

  type NewEquipmentItem = {
    id : Nat;
    itemNumber : Text;
    description : Text;
    mainPhoto : ?Storage.ExternalBlob;
    subPhotos : [Storage.ExternalBlob];
    price : Text;
  };

  type NewHomepageContent = {
    operatorPhoto : ?Storage.ExternalBlob;
    storyText : Text;
  };

  type NewActor = {
    items : Map.Map<Nat, NewEquipmentItem>;
    nextId : Nat;
    homepageContent : NewHomepageContent;
    accessControlState : AccessControl.AccessControlState;
    userProfiles : Map.Map<Principal, { name : Text }>;
  };

  public func run(old : OldActor) : NewActor {
    let newItems = old.items.map<Nat, OldEquipmentItem, NewEquipmentItem>(
      func(_id, oldItem) {
        {
          oldItem with
          mainPhoto = oldItem.photo; // rename field and keep value
          subPhotos = [];
        };
      }
    );

    let newHomepageContent = {
      operatorPhoto = old.homepageContent.photo; // rename field and keep value
      storyText = old.homepageContent.storyText;
    };
    {
      old with
      items = newItems;
      homepageContent = newHomepageContent;
    };
  };
};
