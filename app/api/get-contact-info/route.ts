import { log } from "console";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
    const { instanceId, apiToken, chatId } = await request.json();

    if (!instanceId || !apiToken || !chatId) {
      return NextResponse.json(
        { success: false, error: "Нет instanceId, apiToken или chatId" },
        { status: 400 }
      );
    }
    
    const url = `https://api.green-api.com/waInstance${instanceId}/getContactInfo/${apiToken}`;    
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chatId }),
      cache: "no-store",
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { success: false, error: data },
        { status: response.status }
      );
    }

    return NextResponse.json({
      success: true,
      username: data.contactName || null,
      name: data.name || null,
    });
  } catch (error) {
    console.error("GET CONTACT INFO ERROR:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}