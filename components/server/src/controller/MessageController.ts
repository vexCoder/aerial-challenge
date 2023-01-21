import { AddMessage, DeleteMessage, ListMessages } from "core";
import pMap from "p-map";
import { deleteImage, getSignedUrlForSrc } from "../s3";
import { AddMessageDTO, DeleteMessageDTO, GetMessagesDTO } from "../dto";
import PrismaMessageRepository from "../repository/message";
import type { Context } from "../trpc";

type WithContext<T> = { ctx: Context; input: T };

const buildInteractors = (ctx: Context) => {
  const repository = new PrismaMessageRepository(ctx);

  const listMessagesInteractor = new ListMessages(repository);
  const createMessageInteractor = new AddMessage(repository);
  const deleteMessageInteractor = new DeleteMessage(repository);

  return {
    listMessagesInteractor,
    createMessageInteractor,
    deleteMessageInteractor,
  };
};

export const getAllMessages = async ({
  ctx,
  input,
}: WithContext<GetMessagesDTO>) => {
  const { listMessagesInteractor } = buildInteractors(ctx);
  const res = await listMessagesInteractor.run(input.page, input.limit);

  const messages = await pMap(res.messages, async (message) => {
    if (message.hasImage) {
      const image = await getSignedUrlForSrc(message.id);
      return { ...message, url: image };
    }

    return message;
  });

  res.messages = messages;
  return res;
};

export const createMessage = async ({
  ctx,
  input,
}: WithContext<AddMessageDTO>) => {
  const { createMessageInteractor } = buildInteractors(ctx);
  return createMessageInteractor.run(input.message, input.hasImage);
};

export const deleteMessage = async ({
  ctx,
  input,
}: WithContext<DeleteMessageDTO>) => {
  const { deleteMessageInteractor } = buildInteractors(ctx);
  await deleteImage(input.id);
  return deleteMessageInteractor.run(input.id);
};
