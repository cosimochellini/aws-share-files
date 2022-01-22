interface BaseDynamoItem {
  pk: string;
  sk: string;
}

export interface UserEmail extends BaseDynamoItem {
  user: string;
  email: string;
  description: string;
  default: boolean;
}
