import { useState, useCallback, useRef } from "react";
import {
  Flex,
  Input as MantineInput,
  Button,
  ActionIcon,
  Stack,
  createStyles,
  Text,
} from "@mantine/core";
import { IconPaperclip, IconX } from "@tabler/icons";
import { useMutation } from "@tanstack/react-query";
import ky from "ky";
import { trpc } from "../trpc";

const useStyles = createStyles((theme) => ({
  flex: {
    padding: theme.spacing.sm,
  },
  icon: {
    width: 16,
    height: 16,
    color: theme.colors.blue[6],
  },
  iconX: {
    width: 12,
    height: 12,
    color: theme.colors.red[6],
  },
  file: {
    padding: `4px ${theme.spacing.xs}px 0 ${theme.spacing.xs}px`,
    "& > div": {
      lineHeight: 1,
    },
  },
}));

interface UploadOpts {
  upload: File;
  id: string;
}

const Input = () => {
  const { classes } = useStyles();
  const ref = useRef<HTMLInputElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File>();
  const ctx = trpc.useContext();
  const addMessage = trpc.add.useMutation({});
  const uploadFile = useMutation({
    mutationFn: (opts: UploadOpts) => {
      const formData = new FormData();
      formData.append("file", opts.upload);
      formData.append("id", opts.id);
      return ky.post("/api/upload", {
        body: formData,
      });
    },
  });
  const handleAttach = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const toAttach = e.target.files?.[0];
    if (!toAttach) {
      return;
    }

    setFile(toAttach);
  }, []);

  const handleSubmit = useCallback(async () => {
    const message = inputRef.current?.value;

    if (!message) {
      return;
    }

    ctx.list.setData(
      {
        page: 1,
        limit: 3,
      },
      (prev) => {
        return {
          messages: [
            ...(prev?.messages ?? []),
            {
              id: "temp",
              message,
              hasImage: !!file,
              createdAt: new Date().toISOString(),
              image: file ? URL.createObjectURL(file) : undefined,
            },
          ],
          hasNext: prev?.hasNext ?? false,
        };
      }
    );

    inputRef.current.value = "";

    const res = await addMessage.mutateAsync({
      hasImage: !!file,
      message,
    });

    const id = res?.id;

    if (file && id) {
      setFile(undefined);
      await uploadFile.mutateAsync({
        id,
        upload: file,
      });
    }

    await ctx.invalidate(undefined, {
      queryKey: ["list"],
    });
  }, [addMessage, file, setFile, uploadFile, ctx]);

  return (
    <>
      <input
        ref={ref}
        type="file"
        accept="image/*"
        hidden
        onChange={handleAttach}
      />
      <Stack spacing={0}>
        {file && (
          <Flex className={classes.file} align="center" justify="space-between">
            <Text size="xs">{file.name}</Text>
            <ActionIcon
              onClick={() => {
                setFile(undefined);
              }}
            >
              <IconX className={classes.iconX} />
            </ActionIcon>
          </Flex>
        )}
        <Flex className={classes.flex} align="stretch" gap="sm">
          <MantineInput
            style={{ width: "100%" }}
            disabled={addMessage.isLoading}
            ref={inputRef}
            placeholder="Type your message"
          />
          <ActionIcon
            variant="default"
            style={{ height: "auto", width: 36 }}
            onClick={() => {
              ref.current?.click();
            }}
          >
            <IconPaperclip className={classes.icon} />
          </ActionIcon>
          <Button loading={addMessage.isLoading} onClick={handleSubmit}>
            Send
          </Button>
        </Flex>
      </Stack>
    </>
  );
};
export default Input;
