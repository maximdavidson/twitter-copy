import { Timestamp } from 'firebase/firestore';

export const convertToDate = (timestamp: any) => {
  if (timestamp instanceof Timestamp) {
    return timestamp.toDate();
  }
  return new Date(timestamp);
};
