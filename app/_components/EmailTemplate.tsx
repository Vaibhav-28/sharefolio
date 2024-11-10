import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
} from "@react-email/components";
import * as React from "react";

interface EmailData {
  email: string;
  userName: string;
  url: string;
}

interface EmailTemplateProps {
  emailData: EmailData;
}

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
  ? `${process.env.NEXT_PUBLIC_BASE_URL}`
  : "";

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  emailData,
}) => (
  <Html>
    <Head />
    <Preview>{emailData?.userName} shared a file with you</Preview>
    <Body style={main}>
      <Container style={container}>
        <Img
          src={`${baseUrl}/logo.png`}
          width="150"
          height="100"
          alt="Sharefolio"
          style={logo}
        />
        <Heading style={heading}>
          {emailData?.userName} shared a file with you
        </Heading>
        <Section style={buttonContainer}>
          <Button style={button} href={emailData?.url}>
            Access the file
          </Button>
        </Section>
        <Hr style={hr} />
        <Link href={emailData?.url} style={reportLink}>
          Sharefolio
        </Link>
      </Container>
    </Body>
  </Html>
);

const logo = {
  borderRadius: 21,
  width: 150,
  height: 100,
};

const main = {
  backgroundColor: "#ffffff",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: "0 auto",
  padding: "20px 0 48px",
  maxWidth: "560px",
};

const heading = {
  fontSize: "24px",
  letterSpacing: "-0.5px",
  lineHeight: "1.3",
  fontWeight: "400",
  color: "#484848",
  padding: "17px 0 0",
};

const buttonContainer = {
  padding: "27px 0 27px",
};

const button = {
  backgroundColor: "#5e6ad2",
  borderRadius: "3px",
  fontWeight: "600",
  color: "#fff",
  fontSize: "15px",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  padding: "11px 23px",
};

const reportLink = {
  fontSize: "14px",
  color: "#b4becc",
};

const hr = {
  borderColor: "#dfe1e4",
  margin: "42px 0 26px",
};
