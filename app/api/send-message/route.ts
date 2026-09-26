import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    console.log("BODY:", body);

    const {
      instanceId,
      apiToken,
      chatId,
      message,
    } = body;

    if (!instanceId || !apiToken || !chatId || !message) {
      return NextResponse.json(
        {
          success: false,
          error: "Не хватает данных",
          received: {
            instanceId: !!instanceId,
            apiToken: !!apiToken,
            chatId: !!chatId,
            message: !!message,
          },
        },
        { status: 400 }
      );
    }

    const url =
      `https://api.green-api.com/waInstance${instanceId}` +
      `/sendMessage/${apiToken}`;

    console.log("GREEN-API URL:", url.replace(apiToken, "***"));

    const greenResponse = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chatId,
        message,
      }),
    });

    const text = await greenResponse.text();

    console.log("GREEN-API STATUS:", greenResponse.status);
    console.log("GREEN-API RESPONSE:", text);

    let data;

    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }

    if (!greenResponse.ok) {
      return NextResponse.json(
        {
          success: false,
          status: greenResponse.status,
          error: data,
        },
        { status: greenResponse.status }
      );
    }

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("SEND MESSAGE ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : String(error),
      },
      { status: 500 }
    );
  }
}