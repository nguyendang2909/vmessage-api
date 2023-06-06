export enum EContactStatus {
  // blocked = 'blocked',
  rejected = 'rejected',
  cancelled = 'cancelled',
  pending = 'pending',
  accepted = 'accepted',
}

export const contactStatusRules = {
  [EContactStatus.pending]: EContactStatus.accepted,
};
