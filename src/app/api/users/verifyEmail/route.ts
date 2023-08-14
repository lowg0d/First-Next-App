import { connect } from "@/dbConfig/dBconfig";
import { NextResponse, NextRequest } from "next/server";
import User from "@/models/userModel";

connect();

export async function POST(request: NextRequest) {
  try {
    const requestBody = await request.json();
    const { token } = requestBody;
    console.log(token);

    const user = await User.findOne({
      verifyToken: token,
      verifyTokenExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found!" }, { status: 400 });
    }

    console.log(user);

    user.isVerified = true;
    user.isToken = undefined;
    user.isTokenExpiry = undefined;

    await user.save();

    return NextResponse.json(
      { message: "User verified!", success: true },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
