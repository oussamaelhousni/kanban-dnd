export type Column = {
  id: string;
  title: string;
};

export type Task = {
  id: string;
  text: string;
  columnId: string;
};
