import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { instanceId, apiToken } = await request.json();

    if (!instanceId || !apiToken) {
      return NextResponse.json(
        {
          success: false,
          error: "Нет instanceId или apiToken",
        },
        { status: 400 }
      );
    }

    const url =
      `https://api.green-api.com/waInstance${instanceId}` +
      `/receiveNotification/${apiToken}?receiveTimeout=5`;

    const response = await fetch(url, {
      method: "GET",
      cache: "no-store",
    });

    const text = await response.text();

    console.log("========== RECEIVE ==========");
    console.log("STATUS:", response.status);
    console.log("RAW:", text);
    console.log("=============================");

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          error: text,
        },
        { status: response.status }
      );
    }

    // когда новых уведомлений нет
    if (!text || text === "null") {
      return NextResponse.json({
        success: true,
        message: null,
      });
    }

    let notification;

    try {
      notification = JSON.parse(text);
    } catch {
      return NextResponse.json({
        success: true,
        message: null,
      });
    }

    // Доп защита
    if (!notification) {
      return NextResponse.json({
        success: true,
        message: null,
      });
    }

    console.log("NOTIFICATION:", notification);

    const receiptId = notification.receiptId;
    const body = notification.body;

    // Если нет body
    if (!body) {
      if (receiptId) {
        const deleteUrl =
          `https://api.green-api.com/waInstance${instanceId}` +
          `/deleteNotification/${apiToken}/${receiptId}`;

        await fetch(deleteUrl, {
          method: "DELETE",
        });
      }

      return NextResponse.json({
        success: true,
        message: null,
      });
    }

    if (body.typeWebhook === "incomingMessageReceived") {
      const messageData = body.messageData;

      const textMessage =
        messageData?.textMessageData?.textMessage || "";

      console.log("INCOMING TEXT:", textMessage);

      const chatId =
        body.senderData?.chatId?.replace("@c.us", "") || "";

      if (receiptId) {
        const deleteUrl =
          `https://api.green-api.com/waInstance${instanceId}` +
          `/deleteNotification/${apiToken}/${receiptId}`;

        const deleteResponse = await fetch(deleteUrl, {
          method: "DELETE",
        });

        const deleteText = await deleteResponse.text();

        console.log(
          "DELETE NOTIFICATION:",
          deleteResponse.status,
          deleteText
        );
      }

      if (textMessage) {
        return NextResponse.json({
          success: true,
          message: {
            id: body.idMessage,
            chatId,
            text: textMessage,
            incoming: true,
            time: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
          },
        });
      }
    }

    if (receiptId) {
      const deleteUrl =
        `https://api.green-api.com/waInstance${instanceId}` +
        `/deleteNotification/${apiToken}/${receiptId}`;

      await fetch(deleteUrl, {
        method: "DELETE",
      });
    }

    return NextResponse.json({
      success: true,
      message: null,
    });
  } catch (error) {
    console.error("RECEIVE MESSAGE ERROR:", error);

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