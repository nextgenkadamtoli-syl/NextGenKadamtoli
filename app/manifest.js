export default function manifest() {
  return {
    name: "NextGen Kadamtoli",
    short_name: "Kadamtoli",
    description: "একসাথে করি, একসাথে গড়ি।",
    lang: "bn",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#EEF3F0",
    theme_color: "#0E5A3C",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
    shortcuts: [
      { name: "রক্ত খুঁজুন", url: "/blood" },
      { name: "নতুন ইভেন্ট", url: "/events/new" },
    ],
  };
}
