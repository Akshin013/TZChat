import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { instanceId, apiToken, chatId } = await request.json();

    console.log("INSTANCE:", instanceId);
    console.log("CHAT ID:", chatId);

    const url =
      `https://api.green-api.com/waInstance${instanceId}` +
      `/getContactInfo/${apiToken}`;

    console.log("GREEN URL:", url.replace(apiToken, "***"));

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chatId,
      }),
      cache: "no-store",
    });

    const text = await response.text();

    console.log("GREEN STATUS:", response.status);
    console.log("GREEN RESPONSE:", text);

    let data;

    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          status: response.status,
          error: data,
        },
        { status: response.status }
      );
    }

    return NextResponse.json({
      success: true,
      username: data.contactName || null,
      name: data.name || null,
      avatar: data.avatar || null,
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