import api from "@/lib/novelai"

import { NextResponse } from 'next/server'

export async function POST(req) {
  const { email, password } = await req.json()
  
  try {
    const response = await api.auth.login(email, password);
    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(error);
  }
}