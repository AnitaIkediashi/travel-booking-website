type ResetPasswordEmailProps = {
  rawOtp: string;
};

export const ResetPasswordEmail = ({ rawOtp }: ResetPasswordEmailProps) => {
  const otpChars = [...rawOtp];

  return (
    <div
      style={{
        fontFamily: "sans-serif",
        // maxWidth: "480px",
        // margin: "0 auto",
        // padding: "24px",
      }}
    >
      <h2 style={{ fontSize: "18px", fontWeight: 600, color: "#112211" }}>
        Password Reset Code
      </h2>
      <p style={{ color: "#112211" }}>Your verification code is:</p>
      <h1 style={{ margin: "24px 0", lineHeight: "1" }}>
        {otpChars.map((text, index) => (
          <span
            key={index}
            style={{
              color: "#8dd3bb",
              fontWeight: 500,
              borderRadius: "8px",
              backgroundColor: "#1c1b1f",
              border: "0.5px solid #8dd3bb",
              padding: "8px 14px",
              fontSize: "24px",
              display: "inline-block",
              textAlign: "center",
              lineHeight: "1",
              margin: "0 4px",
            }}
          >
            {text}
          </span>
        ))}
      </h1>
      <p style={{ color: "#112211" }}>
        This code expires in <strong>15 minutes</strong>.
      </p>
      <p style={{ color: "#888", fontSize: "12px", marginTop: "24px" }}>
        If you didn&apos;t request this, ignore this email.
      </p>
    </div>
  );
};
