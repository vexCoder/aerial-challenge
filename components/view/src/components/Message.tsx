import { Message as MessageType } from "core";
import dayjs from "dayjs";
import Image from "next/image";
import { Flex, createStyles, Text } from "@mantine/core";

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
  },
  timestamp: {
    color: theme.colors.gray[6],
  },
}));

type Props = {
  item: Omit<MessageType, "createdAt"> & { createdAt: string; image?: string };
};

const Message = ({ item }: Props) => {
  const { classes } = useStyles();

  const url = item.id === "temp" && item.image ? item.image : item.url;

  return (
    <div data-testid="scroll-test-item" className={classes.box}>
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
      <Text className={classes.timestamp} size="xs">
        {dayjs(item.createdAt).fromNow()}
      </Text>
    </div>
  );
};
export default Message;
