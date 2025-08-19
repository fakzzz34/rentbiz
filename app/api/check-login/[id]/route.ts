/* File: app/api/check-login/[userId]/route.ts */
import * as kv from "@/app/lib/kv_store";
import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: { params: { userId: string } }) {
  try {
    const userId = params.userId;
    const userData = await kv.get(`user_${userId}`) || {};

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    const canLogin = userData.lastDeposit === yesterdayStr || userData.canLogin === true;

    return NextResponse.json({ canLogin, lastDeposit: userData.lastDeposit });
  } catch (error) {
    console.log('Check login error:', error);
    return NextResponse.json({ error: 'Failed to check login permission' }, { status: 500 });
  }
}
