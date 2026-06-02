
type resetPasswordEmailProps = {
    resetUrl: string
}

export const ResetPasswordEmail = ({ resetUrl }: resetPasswordEmailProps) => {
  return (
    <div>
      <p className="text-lg font-medium">Click the link below to reset your password:</p>
      <a href={resetUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline capitalize">
        reset password
      </a>
    </div>
  )
}
