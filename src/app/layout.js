"use client";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./content/authContent";
import { Toaster } from "react-hot-toast";
import { metadata } from "./metaData";
import QueryProvider from "./content/QueryProvider";
import { SessionProvider } from "next-auth/react";
import SocketHandler from "./content/SocketHandler";
import NextTopLoader from "nextjs-toploader";
import { useEffect } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
  useEffect(() => {
    /** ✅ GoAffPro script loader */
    const gafScript = document.createElement("script");
    gafScript.src = "https://cdn.goaffpro.com/js/gaf.min.js";
    gafScript.async = true;
    gafScript.onload = () => {
      window.gaf =
        window.gaf ||
        function () {
          (window.gaf.q = window.gaf.q || []).push(arguments);
        };
      window.gaf("init", "axualetemf");
      window.gaf("track");
    };
    document.body.appendChild(gafScript);

    /** ✅ ChatBot.com script loader (ChatBot widget before </body>) */
    // const chatbotScript = document.createElement("script");
    // chatbotScript.async = true;
    // chatbotScript.innerHTML = `
    //   window.__ow = window.__ow || {};
    //   window.__ow.organizationId = "9a62d47f-7b24-47fc-8a08-35ab3ae8d980";
    //   window.__ow.template_id = "b352d5d4-c9de-4e65-a39c-01338d07e1bc";
    //   window.__ow.integration_name = "manual_settings";
    //   window.__ow.product_name = "chatbot";

    //   (function(n,t,c){
    //     function i(n){return e._h?e._h.apply(null,n):e._q.push(n)}
    //     var e={_q:[],_h:null,_v:"2.0",
    //       on:function(){i(["on",c.call(arguments)])},
    //       once:function(){i(["once",c.call(arguments)])},
    //       off:function(){i(["off",c.call(arguments)])},
    //       get:function(){if(!e._h)throw new Error("[OpenWidget] You can't use getters before load.");return i(["get",c.call(arguments)])},
    //       call:function(){i(["call",c.call(arguments)])},
    //       init:function(){
    //         var n=t.createElement("script");
    //         n.async=!0;
    //         n.type="text/javascript";
    //         n.src="https://cdn.openwidget.com/openwidget.js";
    //         t.head.appendChild(n);
    //       }};
    //     !n.__ow.asyncInit && e.init();
    //     n.OpenWidget = n.OpenWidget || e;
    //   }(window,document,[].slice));
    // `;
    // document.body.appendChild(chatbotScript);
  }, []);

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="UTF-8" />
        <meta name="author" content={metadata.author} />
        <meta name="description" content={metadata.description} />
        <meta name="keywords" content={metadata.keywords} />
        <meta name="robots" content={metadata.robots} />
        <link rel="canonical" href={metadata.canonical} />

        {/* 🔒 Important for AliCDN / local IP image fixes */}
        <meta name="referrer" content="no-referrer" />
        <meta
          httpEquiv="Content-Security-Policy"
          content="default-src * 'unsafe-inline' 'unsafe-eval' data: blob:;"
        />
        <meta httpEquiv="Cross-Origin-Resource-Policy" content="cross-origin" />
        <meta httpEquiv="Cross-Origin-Embedder-Policy" content="unsafe-none" />
        <meta
          httpEquiv="Cross-Origin-Opener-Policy"
          content="same-origin-allow-popups"
        />

        {/* Open Graph Metadata */}
        <meta property="og:type" content={metadata.og.type} />
        <meta property="og:title" content={metadata.og.title} />
        <meta property="og:description" content={metadata.og.description} />
        <meta property="og:url" content={metadata.og.url} />
        <meta property="og:image" content={metadata.og.image} />

        {/* Twitter Card Metadata */}
        <meta name="twitter:card" content={metadata.twitter.card} />
        <meta name="twitter:site" content={metadata.twitter.site} />
        <meta name="twitter:title" content={metadata.twitter.title} />
        <meta
          name="twitter:description"
          content={metadata.twitter.description}
        />
        <meta name="twitter:image" content={metadata.twitter.image} />

        {/* Favicon */}
        <link rel="icon" href="/rb_616.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/rb_616.png" />
        <link rel="manifest" href="/site.webmanifest" />

        <title>{metadata.title}</title>
      </head>

      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionProvider>
          <QueryProvider>
            <AuthProvider>
              <NextTopLoader color="#fc030b" height={3} showSpinner={false} />
              <main className="bg-white w-full min-h-screen text-black">
                {children}
                <Toaster position="bottom-right" />
                <SocketHandler />
              </main>
            </AuthProvider>
          </QueryProvider>
        </SessionProvider>
      </body>
      {/* ✅ Fallback message if JS disabled */}
      {/* <noscript>
        You need to{" "}
        <a
          href="https://www.chatbot.com/help/chat-widget/enable-javascript-in-your-browser/"
          rel="noopener nofollow"
        >
          enable JavaScript
        </a>{" "}
        to use the chatbot powered by{" "}
        <a
          href="https://www.chatbot.com/"
          rel="noopener nofollow"
          target="_blank"
        >
          ChatBot.com
        </a>
        .
      </noscript> */}
      <script
        defer
        src="https://app.fastbots.ai/embed.js"
        data-bot-id="cmgqdlbij0bdwqm1kuw4swndq"
      ></script>
    </html>
  );
}
