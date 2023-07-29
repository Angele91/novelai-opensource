import api from "@/lib/novelai"

import { NextResponse } from 'next/server'

export async function POST(req) {
  const { email, password } = await req.json()
  
  try {
    const { accessToken } = await api.auth.login(email, password);

    return NextResponse.json({
      accessToken,
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json(error);
  }
}