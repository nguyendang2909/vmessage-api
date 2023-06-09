import Joi from 'joi';

export class SendChatMessageDto {
  roomId: string;
  targetUserId: string;
  likeUserIds?: string[];
  loveUserIds?: string[];
  replyMessageId?: string;
  text?: string;
}

export const sendChangeMessageSchema = Joi.object({
  roomId: Joi.string().when('targetUserId', {
    is: Joi.exist(),
    then: Joi.forbidden(),
    otherwise: Joi.string().required(),
  }),
  targetUserId: Joi.string().optional(),
  text: Joi.string().optional(),
  likeUserIds: Joi.string().uuid().optional(),
  loveUserIds: Joi.string().uuid().optional(),
  replyMessageId: Joi.string().uuid().optional(),
});
