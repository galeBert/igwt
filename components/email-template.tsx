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
  return (
    <div>
      <h1>
        Transaction Invititation on &nbsp; <strong>IGWT</strong>
      </h1>
      <h2>Hello {recieverName},</h2>
      <h3>
        <strong>{senderName}</strong> (
        <a href={`mailto:${senderEmail}`}>{senderEmail}</a>) has invited you to
        do transactiom for
        <strong>{productName}</strong> on &nbsp; <strong>IGWT</strong>.
      </h3>

      <div>
        See Transaction at
        <a
          href={`https://www.igwt.space/transactions/
          ${inviteLink}`}
          target="_blank"
        >
          https://www.igwt.space/transactions/
          {inviteLink}
        </a>
      </div>
    </div>
  );
};

export default EmailTemplate;
