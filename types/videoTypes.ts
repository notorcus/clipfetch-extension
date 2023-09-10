export interface Video {
    id: number;
    title: string;
    progress: number;
    status: 'downloading' | 'completed' | 'failed' | 'cancelled' | 'removed';
  }
  