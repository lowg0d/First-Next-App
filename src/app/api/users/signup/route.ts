import { connect } from "@/dbConfig/dBconfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import { sendEmail } from "@/helpers/mailer";

connect();

export async function POST(request: NextRequest) {
  try {
    const requestBody = await request.json();
    const { username, email, password } = requestBody;

    console.log(requestBody);

    // user exits ?
    const userFound = await User.findOne({ email });
    if (userFound) {
      return NextResponse.json(
        { error: "X :(:( occupied seat :( X" },
        { status: 400 }
      );
    }

    // hash pswd
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    // new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    const saveReponse = await newUser.save();
    console.log(saveReponse);

    // send verification email
    await sendEmail({
      email: newUser.email,
      emailType: "VERIFY",
      userId: newUser._id,
    });

    return NextResponse.json(
      { message: "User Created !", succes: true, newUser },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
