import { Message } from './entities/message.entity';

export type CreateMessageEntity = {
  replyMessage: Message;
  userId: string;
  reactionLike?: string[];
  reactionLove?: string[];
  text?: string;
  imageUrl?: string;
  videoUrl?: string;
};
