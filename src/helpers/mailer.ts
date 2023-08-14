import bcryptjs from "bcryptjs";
import User from "@/models/userModel";
import nodemailer from "nodemailer";

export const sendEmail = async ({ email, emailType, userId }: any) => {
  try {
    // hash the user id to fetch in the db
    const hashedToken = await bcryptjs.hash(userId.toString(), 10);

    if (emailType === "VERIFY") {
      await User.findByIdAndUpdate(userId, {
        verifyToken: hashedToken,
        verifyTokenExpiry: Date.now() + 3600000,
      });
    } else if (emailType === "RESTART_PSWRD") {
      await User.findByIdAndUpdate(userId, {
        forgotPasswordToken: hashedToken,
        forgotPasswordTokenExpiry: Date.now() + 3600000,
      });
    }

    var transport = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: "81f61a695389dc",
        pass: "3f374808819ee2",
      },
    });

    const mailOptions = {
      from: "noreply.starlab@gmail.com",
      to: email,
      subject:
        emailType === "VERIFY"
          ? "Verify Mail For Your Starlab Account"
          : "Reset The Password Of Your Starlab Account",
      html: `<p>Click <a href="${process.env.DOMAIN}/${
        emailType === "VERIFY" ? "verifyEmail" : "resetPassword"
      }?token=${hashedToken}">HERE</a> to ${
        emailType === "VERIFY" ? "verify your email" : "reset your password"
      }
      or copy paste the link below in to your browser
      ${process.env.DOMAIN}/${
        emailType === "VERIFY" ? "verifyEmail" : "resetPassword"
      }?token=${hashedToken}
      </p>`,
    };

    const mailreponse = await transport.sendMail(mailOptions);
    return mailreponse;
  } catch (error: any) {
    throw new Error(error.message);
  }
};
