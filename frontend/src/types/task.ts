export interface Task {
  id: number;
  title: string;
  note: string | null;
  completed: boolean;
}

export interface TaskCreate {
  title: string;
  note: string | null;
}

export interface TaskUpdate {
  title?: string;
  note?: string | null;
  completed?: boolean;
}