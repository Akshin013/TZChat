export type Message = {
  id: string | number;
  text: string;
  incoming: boolean;
  time: string;
};

export type Chat = {
  id: string;
  phone: string;
  lastMessage: string;
  messages: Message[];
  unreadCount: number;
  username?: string | null;
  name?: string | null;
  avatar: string | null;
};