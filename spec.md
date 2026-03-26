# HB9FDL Radio Gear

## Current State
Each EquipmentItem has a single optional `photo` field. The admin page has one photo upload per item. The equipment listing page shows one small thumbnail.

## Requested Changes (Diff)

### Add
- `subPhotos: [Storage.ExternalBlob]` array field to EquipmentItem in the backend
- Multiple sub-photo upload UI in the admin equipment editor (up to ~5 additional photos)
- Sub-photo gallery display on the EquipmentPage for each item (clicking main photo or thumbnails shows a larger view)

### Modify
- Backend `EquipmentItem` type: add `subPhotos` array
- `addItem` and `updateItem` accept and store `subPhotos`
- AdminPage EquipmentSection: add multi-photo upload area for sub-photos
- EquipmentPage: show sub-photo thumbnails beneath/beside main photo per item

### Remove
- Nothing removed

## Implementation Plan
1. Update Motoko backend to add `subPhotos` to EquipmentItem
2. Update frontend AdminPage to support uploading/removing sub-photos
3. Update frontend EquipmentPage to display sub-photo gallery per item
