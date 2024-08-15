export interface Tweet {
  id: string;
  text: string;
  imageUrl?: string;
  timestamp: any;
  likes: number;
  likedBy: string[];
}
