export enum EContactStatus {
  blocked = 'blocked',
  rejected = 'rejected',
  cancelled = 'cancelled',
  pending = 'pending',
  accepted = 'accepted',
}

export const contactStatus = {
  me: {
    [EContactStatus.blocked]: [
      EContactStatus.pending,
      EContactStatus.cancelled,
    ],
    [EContactStatus.rejected]: [EContactStatus.pending],
    [EContactStatus.pending]: [
      EContactStatus.blocked,
      EContactStatus.cancelled,
    ],
    // [EContactStatus.]
  },
};
