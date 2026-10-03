import { shareWebsite, websiteUrl } from "/invite-utils.js";

document.querySelector("#share-site").addEventListener("click", async () => {
  const status = document.querySelector("#share-status");
  try {
    const result = await shareWebsite();
    document.querySelector("#share-fallback").hidden = true;
    status.textContent = result === "copied" ? "网站地址已复制，可以发给家人。" : "";
  } catch {
    status.textContent = "这个浏览器不能直接分享。复制下面的网址，发给家人。";
    document.querySelector("#share-fallback").hidden = false;
    const field = document.querySelector("#share-url");
    field.value = websiteUrl;
    field.focus();
    field.select();
  }
});
