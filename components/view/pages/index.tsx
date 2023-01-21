import { Container, Center, Stack } from "@mantine/core";
import Input from "../src/components/Input";
import Messages from "../src/components/Messages";

const Page = () => {
  return (
    <Container style={{ height: "100vh" }}>
      <Center style={{ height: "100%" }}>
        <Stack
          style={{
            borderRadius: "4px",
            overflow: "hidden",
            border: `1px solid #aeaeae`,
          }}
          spacing={0}
        >
          <Messages />
          <Input />
        </Stack>
      </Center>
    </Container>
  );
};

export default Page;
