export const resetPasswordTemplate = (resetLink: string, userName: string) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Password</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px;">
        <div style="text-align: center; border-bottom: 2px solid #007bff; padding-bottom: 20px; margin-bottom: 20px;">
            <h1 style="color: #333333; margin: 0;">Payment Records</h1>
        </div>

        <div style="padding: 20px 0;">
            <h2 style="color: #333333; margin-bottom: 15px;">Reset Your Password</h2>
            <p style="color: #666666; line-height: 1.6; margin-bottom: 20px;">
                Hi ${userName},
            </p>
            <p style="color: #666666; line-height: 1.6; margin-bottom: 20px;">
                We received a request to reset your password. Click the button below to create a new password:
            </p>

            <div style="text-align: center; margin: 30px 0;">
                <a href="${resetLink}"
                   style="background-color: #007bff; color: #ffffff; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
                    Reset Password
                </a>
            </div>

            <p style="color: #666666; line-height: 1.6; margin-bottom: 10px;">
                If you didn't request this, you can safely ignore this email.
            </p>
            <p style="color: #999999; font-size: 12px; line-height: 1.4;">
                This link will expire in 1 hour for security reasons.
            </p>
        </div>

        <div style="border-top: 1px solid #eeeeee; padding-top: 20px; text-align: center;">
            <p style="color: #999999; font-size: 12px; margin: 0;">
                © 2025 Payment Records. All rights reserved.
            </p>
        </div>
    </div>
</body>
</html>
`;

export const welcomeTemplate = (userName: string) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px;">
        <div style="text-align: center; border-bottom: 2px solid #28a745; padding-bottom: 20px; margin-bottom: 20px;">
            <h1 style="color: #333333; margin: 0;">Payment Records</h1>
        </div>

        <div style="padding: 20px 0;">
            <h2 style="color: #333333; margin-bottom: 15px;">Welcome to Payment Records!</h2>
            <p style="color: #666666; line-height: 1.6; margin-bottom: 20px;">
                Hi ${userName},
            </p>
            <p style="color: #666666; line-height: 1.6; margin-bottom: 20px;">
                Thank you for joining Payment Records! Your account has been successfully created.
            </p>
            <p style="color: #666666; line-height: 1.6; margin-bottom: 20px;">
                You can now start managing your financial transactions with ease.
            </p>

            <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
                <p style="color: #666666; margin: 0; font-size: 14px;">
                    If you have any questions, feel free to contact our support team.
                </p>
            </div>
        </div>

        <div style="border-top: 1px solid #eeeeee; padding-top: 20px; text-align: center;">
            <p style="color: #999999; font-size: 12px; margin: 0;">
                © 2025 Payment Records. All rights reserved.
            </p>
        </div>
    </div>
</body>`
