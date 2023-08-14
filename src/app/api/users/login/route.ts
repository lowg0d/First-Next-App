import { connect } from "@/dbConfig/dBconfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

connect();

export async function POST(request: NextRequest) {
  const requestBody = await request.json();
  const { email, password } = requestBody;
  console.log(requestBody);

  // user exits ?
  const userFound = await User.findOne({ email });
  if (!userFound) {
    return NextResponse.json(
      { error: "X :(:( occupied seat :( X" },
      { status: 400 }
    );
  }

  // validat pswd
  const validPassword = await bcryptjs.compare(password, userFound.password);
  if (!validPassword) {
    return NextResponse.json(
      { error: ":( Password is not valid" },
      { status: 400 }
    );
  }

  // create token data
  const TokenData = {
    id: userFound._id,
    username: userFound.username,
    email: userFound.email,
  };

  // create the token
  const token = await jwt.sign(TokenData, process.env.JWT_SECRET_KEY!, {
    expiresIn: "1d",
  });

  const response = NextResponse.json({
    message: "login sucessfull",
    succes: true,
  });

  response.cookies.set("token", token, { httpOnly: true });

  return response;
}
