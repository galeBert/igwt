import {
  Body,
  Button,
  Container,
  Column,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

interface VercelInviteUserEmailProps {
  senderName: string;
  senderEmail: string;
  recieverName: string;
  productName: string;
  inviteLink: string;
}

export const EmailTemplate = ({
  senderName = "albert",
  senderEmail = "albert@igwt.space",
  recieverName = "someone",
  productName = "something",
  inviteLink = "https://vercel.com/teams/invite/foo",
}: VercelInviteUserEmailProps) => {
  const previewText = `Join ${senderEmail} on IGWT`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="bg-white my-auto mx-auto font-sans">
          <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] w-[465px]">
            <Hr className="border border-solid border-[#eaeaea] my-[26px] mx-0 w-full" />
            <Text className="text-[#666666] text-[12px] leading-[24px]">
              If you were not expecting this invitation, you can ignore this
              email. If you are concerned about your {`account's`} safety,
              please reply to this email to get in touch with us.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default EmailTemplate;
