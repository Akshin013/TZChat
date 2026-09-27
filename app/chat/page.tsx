"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "../components/Sidebar";
import ChatHeader from "../components/ChatHeader";
import MessageList from "../components/MessageList";
import { normalizePhone, phonesMatch } from "../lib/phone";
import { useResizableSidebar } from "../hooks/useResizableSidebar";
import type { Message, Chat } from "../lib/types";

export default function ChatPage() {
  const router = useRouter();

  //   const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [selectedChat, setSelectedChat] = useState("79233709894");
  const [sending, setSending] = useState(false);
  const [newPhone, setNewPhone] = useState("");
  const [showNewChat, setShowNewChat] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [search, setSearch] = useState("");
  const [mobileChatOpen, setMobileChatOpen] = useState(true);
  const [isDesktop, setIsDesktop] = useState(false);

  const {
    width: sidebarWidth,
    startResizing,
    resetWidth,
  } = useResizableSidebar();

  const [chats, setChats] = useState<Chat[]>([
    {
      id: "79233709894",
      phone: "+7 923 370 98 94",
      lastMessage: "Привет, как дела?",
      messages: [
        {
          id: 1,
          text: "Привет! 👋",
          incoming: true,
          time: "12:41",
        },
        {
          id: 2,
          text: "Здравствуйте!",
          incoming: false,
          time: "12:42",
        },
        {
          id: 3,
          text: "Как ваши дела?",
          incoming: true,
          time: "12:42",
        },
      ],
      unreadCount: 2,
      avatar:"https://img.magnific.com/free-photo/friendly-smiling-successful-man-black-suit-waving-hand-hello-gesture-introduce-himself-saying-hi-welcome-greet-someone-white-background_176420-45255.jpg",
    },
  ]);

  const currentChat = chats.find((chat) => chat.id === selectedChat);

  const receiveMessages = async () => {
    try {
      const instanceId = localStorage.getItem("instanceId");
      const apiToken = localStorage.getItem("apiToken");

      if (!instanceId || !apiToken) return;

      const response = await fetch("/api/receive-message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          instanceId,
          apiToken,
        }),
      });

      const data = await response.json();

      if (data.success && data.message && data.message.text) {
        const incomingChatId = data.message.chatId;

        if (!incomingChatId) return;

        setChats((prev) => {
          const existingChat = prev.find((chat) =>
            phonesMatch(chat.id, incomingChatId),
          );

          if (!existingChat) {
            return [
              ...prev,
              {
                id: incomingChatId,
                phone: `+${incomingChatId.replace("@c.us", "")}`,
                lastMessage: data.message.text,
                messages: [data.message],
                unreadCount: incomingChatId === selectedChat ? 0 : 1,
                avatar: data.avatar,
              },
            ];
          }

          return prev.map((chat) => {
            if (chat.id !== existingChat.id) {
              return chat;
            }

            const alreadyExists = chat.messages.some(
              (item) => item.id === data.message.id,
            );

            if (alreadyExists) {
              return chat;
            }
            const isActive = chat.id === selectedChat;

            return {
              ...chat,
              lastMessage: data.message.text,
              messages: [...chat.messages, data.message],
              unreadCount: isActive ? 0 : chat.unreadCount + 1,
            };
          });
        });
      }
    } catch (error) {
      console.error("RECEIVE ERROR:", error);
    }
  };

  // ЗАГРУЗКА
  useEffect(() => {
    try {
      const savedChats = localStorage.getItem("chats");
      const savedSelectedChat = localStorage.getItem("selectedChat");

      if (savedChats) {
        const parsedChats: Chat[] = JSON.parse(savedChats);

        if (Array.isArray(parsedChats) && parsedChats.length > 0) {
          setChats(parsedChats);

          const chatToOpen =
            savedSelectedChat &&
            parsedChats.some((chat) => chat.id === savedSelectedChat)
              ? savedSelectedChat
              : parsedChats[0].id;

          setSelectedChat(chatToOpen);
        }
      }
    } catch (error) {
      console.error("Ошибка загрузки чатов:", error);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // СОХРАНЕНИЕ
  useEffect(() => {
    if (!isLoaded) return;

    localStorage.setItem("chats", JSON.stringify(chats));
    localStorage.setItem("selectedChat", selectedChat);
  }, [chats, selectedChat, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;

    let cancelled = false;
    let timeoutId: ReturnType<typeof setTimeout>;

    async function loop() {
      if (cancelled) return;

      await receiveMessages();

      if (!cancelled) {
        timeoutId = setTimeout(loop, 3000);
      }
    }

    loop();

    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
    };
  }, [isLoaded]);

  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  // ///////////////////////////////////////////////////
  const sendMessage = async () => {
    if (!message.trim() || sending) return;

    const instanceId = localStorage.getItem("instanceId");
    const apiToken = localStorage.getItem("apiToken");

    if (!instanceId || !apiToken) {
      router.push("/");
      return;
    }

    setSending(true);

    try {
      const response = await fetch("/api/send-message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          instanceId,
          apiToken,
          chatId: `${selectedChat}@c.us`,
          message: message.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("GREEN-API ERROR:", data);

        if (data.status === 466) {
          alert(
            "Превышен месячный лимит GREEN-API. Проверьте тариф или лимиты аккаунта.",
          );
        } else {
          alert(
            data.error?.message ||
              data.error?.description ||
              "Не удалось отправить сообщение",
          );
        }

        return;
      }

      setMessage("");
      const text = message.trim();

      if (!text) return;

      setChats((prev) =>
        prev.map((chat) =>
          chat.id === selectedChat
            ? {
                ...chat,
                lastMessage: text,
                messages: [
                  ...chat.messages,
                  {
                    id: Date.now(),
                    text,
                    incoming: false,
                    time: new Date().toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    }),
                  },
                ],
              }
            : chat,
        ),
      );

      setMessage("");
    } catch (error) {
      console.error(error);
      alert("Ошибка соединения");
    } finally {
      setSending(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("instanceId");
    localStorage.removeItem("apiToken");

    router.push("/");
  };

  const fetchContactInfo = async (chatId: string) => {
    const instanceId = localStorage.getItem("instanceId");
    const apiToken = localStorage.getItem("apiToken");

    if (!instanceId || !apiToken) return;

    try {
      const response = await fetch("/api/get-contact-info", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          instanceId,
          apiToken,
          chatId: `${chatId}@c.us`,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setChats((prev) =>
          prev.map((chat) =>
            chat.id === chatId
              ? {
                  ...chat,
                  username: data.username || null,
                  name: data.name || null,
                  avatar: data.avatar || null,
                }
              : chat,
          ),
        );
      }
    } catch (error) {
      console.error("CONTACT INFO ERROR:", error);
    }
  };

  const handleDeleteChat = (chatId: string) => {
    const confirmed = confirm("Удалить этот чат?");

    if (!confirmed) return;

    setChats((prev) => prev.filter((chat) => chat.id !== chatId));

    const remainingChats = chats.filter((chat) => chat.id !== chatId);

    if (remainingChats.length > 0) {
      setSelectedChat(remainingChats[0].id);
    } else {
      setSelectedChat("");
    }
  };

  const createChat = async () => {
    const cleanPhone = normalizePhone(newPhone);

    if (cleanPhone.length < 10 || cleanPhone.length > 15) {
      alert("Введите корректный номер телефона");
      return;
    }

    const instanceId = localStorage.getItem("instanceId");
    const apiToken = localStorage.getItem("apiToken");

    if (!instanceId || !apiToken) {
      alert("Нет данных GREEN-API");
      return;
    }

    try {
      const response = await fetch("/api/get-contact-info", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          instanceId,
          apiToken,
          chatId: `${cleanPhone}@c.us`,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        alert("Не удалось получить данные контакта");
        return;
      }

      const newChat: Chat = {
        id: cleanPhone,
        phone: `+${cleanPhone}`,
        lastMessage: "",
        messages: [],
        unreadCount: 0,

        username: data.username || null,
        name: data.name || null,
        avatar: data.avatar || null,
      };

      setChats((prev) => [...prev, newChat]);

      setSelectedChat(cleanPhone);
      setShowNewChat(false);
      setNewPhone("");
    } catch (error) {
      console.error("CREATE CHAT ERROR:", error);
    }
  };
  return (
    <>
      {showNewChat && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center">
          <div className="w-[400px] rounded-2xl bg-[#15171c] border border-white/10 p-6">
            <h2 className="text-lg font-semibold mb-2">Новый чат</h2>

            <p className="text-sm text-gray-500 mb-5">
              Введите номер телефона получателя
            </p>

            <input
              value={newPhone}
              onChange={(e) => setNewPhone(e.target.value)}
              placeholder="Введите номер телевона"
              className="w-full h-12 rounded-xl bg-[#191c21] border border-white/10 px-4 outline-none focus:border-white/30"
            />

            <div className="flex gap-3 mt-4">
              <button
                onClick={() => {
                  setShowNewChat(false);
                  setNewPhone("");
                }}
                className="flex-1 h-11 rounded-xl bg-[#25282e] text-white"
              >
                Отмена
              </button>

              <button
                onClick={createChat}
                className="flex-1 h-11 rounded-xl bg-white text-black font-medium"
              >
                Создать
              </button>
            </div>
          </div>
        </div>
      )}

      <main className="h-screen bg-[#0b0d10] text-white flex overflow-hidden">
        <div
          className={`${mobileChatOpen ? "hidden" : "flex"} w-full md:w-auto md:flex relative shrink-0`}
          style={isDesktop ? { width: sidebarWidth } : undefined}
        >
          <Sidebar
            chats={chats}
            selectedChat={selectedChat}
            search={search}
            onSearchChange={setSearch}
            onSelectChat={(id) => {
              setSelectedChat(id);
              setMobileChatOpen(true);
              setChats((prev) =>
                prev.map((chat) =>
                  chat.id === id ? { ...chat, unreadCount: 0 } : chat,
                ),
              );
              const chat = chats.find((c) => c.id === id);
              if (chat && chat.username === undefined) {
                fetchContactInfo(id);
              }
            }}
            onNewChat={() => setShowNewChat(true)}
            onLogout={handleLogout}
            onDeleteChat={handleDeleteChat}
          />

          <div
            onMouseDown={startResizing}
            className="hidden md:block absolute top-0 right-0 h-full w-1 cursor-col-resize hover:bg-white/20 active:bg-white/30 transition-colors"
          />
        </div>

        <section
          className={`${
            mobileChatOpen ? "flex" : "hidden"
          } md:flex flex-1 w-full min-w-0 flex-col`}
        >
          <ChatHeader
            phone={currentChat?.phone || selectedChat}
            username={currentChat?.username}
            avatar={currentChat?.avatar}
            onBack={() => setMobileChatOpen(false)}
          />

          <MessageList messages={currentChat?.messages || []} />

          <div className="[#101216] p-4">
            <div className="max-w-3xl mx-auto flex gap-3">
              <input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Напишите сообщение..."
                className="flex-1 h-12 rounded-xl bg-[#191c21] border border-white/5 px-4 outline-none placeholder:text-gray-600 focus:border-white/20"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
              />

              <button
                onClick={sendMessage}
                disabled={sending || !message.trim()}
                className="w-12 h-12 rounded-xl bg-white text-black flex items-center justify-center font-semibold hover:bg-gray-200 transition disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {sending ? "..." : "↑"}
              </button>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
