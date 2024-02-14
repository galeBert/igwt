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
            <Section className="mt-[32px]">
              {/* <Img
                src={`https://firebasestorage.googleapis.com/v0/b/igwt-3b1a7.appspot.com/o/fix-igwt-bordered-logo.png?alt=media&token=243eb52a-16ad-469e-8b1e-991cd873e436`}
                width="40"
                height="37"
                alt="IGWT"
                className="my-0 mx-auto"
              /> */}
            </Section>
            <Heading className="text-black text-[24px] font-normal text-center p-0 my-[30px] mx-0">
              Transaction Invititation on &nbsp; <strong>IGWT</strong>
            </Heading>
            <Text className="text-black text-[14px] leading-[24px]">
              Hello {recieverName},
            </Text>
            <Text className="text-black text-[14px] leading-[24px]">
              <strong>{senderName}</strong> (
              <Link
                href={`mailto:${senderEmail}`}
                className="text-blue-600 no-underline"
              >
                {senderEmail}
              </Link>
              ) has invited you to do transactiom for
              <strong>{productName}</strong> on &nbsp; <strong>IGWT</strong>.
            </Text>
            <Section>
              <Row>
                <Column align="right"></Column>
                <Column align="center"></Column>
                <Column align="left"></Column>
              </Row>
            </Section>
            <Section className="text-center mt-[32px] mb-[32px]">
              <Button
                className="bg-[#000000] px-5 py-3 rounded text-white text-[12px] font-semibold no-underline text-center"
                href={`https://www.igwt.space/transactions/${inviteLink}`}
              >
                See Transaction
              </Button>
            </Section>
            <Text className="text-black text-[14px] leading-[24px]">
              or copy and paste this URL into your browser:{" "}
              <Link
                href={`https://www.igwt.space/transactions/${inviteLink}`}
                className="text-blue-600 no-underline"
              >
                https://www.igwt.space/transactions/{inviteLink}
              </Link>
            </Text>
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
