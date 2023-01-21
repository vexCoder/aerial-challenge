import { Stack, createStyles } from "@mantine/core";
import { useIntersection } from "@mantine/hooks";
import dayjs from "dayjs";
import { useRef, useEffect, useState, useCallback, memo } from "react";
import { trpc } from "../trpc";
import Message from "./Message";

const useStyles = createStyles((theme) => ({
  root: {
    background: theme.colors.gray[2],
    maxHeight: "50vh",
    minHeight: "50vh",
    overflowY: "auto",
    flexDirection: "column-reverse",
  },
  visibility: {
    "&::before": {
      content: '""',
      display: "block",
      height: 15,
      width: "100%",
    },
  },
}));

const Messages = () => {
  const { classes } = useStyles();
  const ref = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(false);

  const { ref: intersectRef, entry } = useIntersection({
    root: ref.current,
    threshold: [0, 0.5, 1],
  });

  const intersecting = !!entry?.isIntersecting;

  const scroll = useCallback(() => {
    if (ref.current) ref.current.scrollTop = ref.current.scrollHeight;
  }, []);

  const next = useCallback(() => {
    setHasNext(true);
  }, [setHasNext]);

  useEffect(() => {
    if (intersecting && hasNext) {
      setPage((prev) => prev + 1);
      setHasNext(false);
    }
  }, [hasNext, intersecting]);

  const array = new Array(page).fill(0).map((_, i) => i + 1);
  return (
    <Stack
      data-testid="scroll-test"
      ref={ref}
      className={classes.root}
      spacing={0}
    >
      {array.map((i) => {
        return (
          <Section key={i} limit={3} page={i} scroll={scroll} next={next} />
        );
      })}
      <div ref={intersectRef} className={classes.visibility} />
    </Stack>
  );
};

interface SectionProps {
  limit: number;
  page: number;
  scroll: () => void;
  next: () => void;
}

const Section = memo(({ limit, page, scroll, next }: SectionProps) => {
  const list = trpc.list.useQuery(
    { limit, page },
    {
      refetchOnWindowFocus: false,
      refetchInterval: false,
    }
  );

  const messages = list.data?.messages ?? [];
  const hasNext = !!list.data?.hasNext;

  useEffect(() => {
    if (list.isFetched) {
      if (hasNext) next();
    }
  }, [list.isFetched, list.dataUpdatedAt, scroll, hasNext, next]);

  useEffect(() => {
    if (page === 1) scroll();
  }, [list.dataUpdatedAt, scroll, page]);

  return (
    <Stack spacing={0}>
      {messages
        .sort((a, b) => dayjs(a.createdAt).unix() - dayjs(b.createdAt).unix())
        .map((message) => {
          return <Message key={message.id} item={message} page={page} />;
        })}
    </Stack>
  );
});

export default Messages;
