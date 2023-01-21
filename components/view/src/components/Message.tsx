import { Message as MessageType } from "core";
import dayjs from "dayjs";
import Image from "next/image";
import { IconTrash } from "@tabler/icons";
import { Flex, createStyles, Text, ActionIcon } from "@mantine/core";
import { useHover } from "@mantine/hooks";
import { useCallback } from "react";
import { trpc } from "../trpc";

const useStyles = createStyles((theme) => ({
  box: {
    width: "100%",
    padding: theme.spacing.sm,
  },
  image: {
    display: "block",
    position: "relative",
    width: "auto",
    minWidth: 150,
    paddingBottom: `50%`,
  },
  message: {
    position: "relative",
    background: "#fff",
    width: "max-content",
    borderRadius: theme.radius.md,
    overflow: "hidden",
  },
  text: {
    background: "#fff",
    padding: theme.spacing.sm,
    width: "max-content",
    maxWidth: 350,
    textOverflow: "ellipsis",
    overflow: "hidden",
  },
  timestamp: {
    color: theme.colors.gray[6],
  },
  trash: {
    visibility: "hidden",
    transition: "all 0.2s ease",
    transform: "scale(0.75)",
    opacity: 0,
    "&.open": {
      visibility: "visible",
      opacity: 1,
      transform: "scale(1)",
    },
  },
}));

type Props = {
  item: Omit<MessageType, "createdAt"> & { createdAt: string; image?: string };
  page: number;
};

const Message = ({ item, page }: Props) => {
  const { classes, cx } = useStyles();
  const { hovered, ref } = useHover();
  const ctx = trpc.useContext();
  const deleteMessage = trpc.delete.useMutation();

  const url = item.id === "temp" && item.image ? item.image : item.url;

  const handleDelete = useCallback(async () => {
    ctx.list.setData(
      {
        page,
        limit: 3,
      },
      (prev) => {
        const prevMessags = prev?.messages ?? [];
        const messages = prevMessags.filter((m) => m.id !== item.id);
        return {
          messages,
          hasNext: prev?.hasNext ?? false,
        };
      }
    );

    await deleteMessage.mutateAsync({
      id: item.id,
    });

    await ctx.invalidate(undefined, {
      queryKey: ["list"],
    });
  }, [deleteMessage, ctx, page, item]);

  return (
    <div ref={ref} className={classes.box}>
      <Flex align="center" justify="space-between" gap="sm">
        <Flex className={classes.message} direction="column">
          <Text className={classes.text} size="md">
            {item.message}
          </Text>
          {item.hasImage && url && (
            <div className={classes.image}>
              <Image
                src={url}
                alt="test"
                style={{ objectFit: "cover" }}
                fill
                sizes="125px"
              />
            </div>
          )}
        </Flex>
        <ActionIcon
          variant="filled"
          color="red"
          size="md"
          className={cx(classes.trash, hovered && "open")}
          disabled={item.id === "temp" && deleteMessage.isLoading}
          onClick={handleDelete}
        >
          <IconTrash size={16} />
        </ActionIcon>
      </Flex>
      <Text className={classes.timestamp} size="xs">
        {dayjs(item.createdAt).fromNow()}
      </Text>
    </div>
  );
};
export default Message;
