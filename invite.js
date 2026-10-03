import { appInviteUrl, copyText, invitationMessage, readInviteCode } from "/invite-utils.js";

const code = readInviteCode(location.search);
if (code === null) {
  document.querySelector("#invite-invalid").hidden = false;
} else {
  const message = invitationMessage(code);
  document.querySelector("#invite-valid").hidden = false;
  document.querySelector("#invite-code").textContent = code;
  document.querySelector("#invite-message").textContent = message;
  document.querySelector("#open-app").href = appInviteUrl(code);
  document.querySelector("#copy-invite").addEventListener("click", async () => {
    const status = document.querySelector("#invite-status");
    try {
      await copyText(message);
      document.querySelector("#invite-fallback").hidden = true;
      status.textContent = "邀请已复制。现在手动打开「帮帮」，点一下「连接家人」。";
    } catch {
      status.textContent = "这个浏览器不能直接复制。长按下方消息，把整条复制下来，再打开「帮帮」。";
      document.querySelector("#invite-fallback").hidden = false;
      const field = document.querySelector("#invite-copy-text");
      field.value = message;
      field.focus();
      field.select();
    }
  });
}
