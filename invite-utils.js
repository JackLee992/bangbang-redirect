export const websiteUrl = "https://bangbang.yilin.fun/";

export function isDeviceCode(code) {
  return typeof code === "string" && code.length >= 6 && code.length <= 16 &&
    !/[^0-9]/u.test(code);
}

export function readInviteCode(search) {
  const codes = new URLSearchParams(search).getAll("code");
  return codes.length === 1 && decodeInviteCode(codes[0]) !== null ? codes[0] : null;
}

function requireDeviceCode(code) {
  if (!isDeviceCode(code)) throw new Error("Invalid invitation code");
}

export function encodeInviteCode(deviceId) {
  requireDeviceCode(deviceId);
  return `BB1-${btoa(deviceId).replaceAll("+", "-").replaceAll("/", "_").replace(/=+$/u, "")}`;
}

export function decodeInviteCode(token) {
  if (typeof token !== "string" || !/^BB1-[A-Za-z0-9_-]{8,22}$/u.test(token)) return null;
  try {
    const encoded = token.slice(4).replaceAll("-", "+").replaceAll("_", "/");
    const deviceId = atob(encoded.padEnd(Math.ceil(encoded.length / 4) * 4, "="));
    return isDeviceCode(deviceId) && encodeInviteCode(deviceId) === token ? deviceId : null;
  } catch {
    return null;
  }
}

function requireInviteCode(token) {
  if (decodeInviteCode(token) === null) throw new Error("Invalid invitation token");
}

export function inviteUrl(token) {
  requireInviteCode(token);
  return `${websiteUrl}invite.html?code=${token}`;
}

export function appInviteUrl(token) {
  requireInviteCode(token);
  return `bangbang://invite?code=${token}`;
}

export function invitationMessage(token) {
  return `我这手机有个地方弄不明白，你有空帮我看看。\n\n把这条消息整个复制下来，再打开「帮帮」，点一下「连接家人」就行。\n\n【帮帮邀请】\n配对口令：${token}\n${inviteUrl(token)}\n\n还没装帮帮的话，点这里装：\n${websiteUrl}`;
}

export async function copyText(text, environment = navigator) {
  if (typeof environment.clipboard?.writeText !== "function") {
    throw new Error("Clipboard unavailable");
  }
  await environment.clipboard.writeText(text);
}

export async function shareWebsite(environment = navigator) {
  if (typeof environment.share === "function") {
    try {
      await environment.share({
        title: "帮帮 — 让家人帮忙看看手机",
        text: "在这里安装帮帮，就能请家人帮忙看看手机。",
        url: websiteUrl,
      });
      return "shared";
    } catch (error) {
      if (error?.name === "AbortError") return "cancelled";
    }
  }
  await copyText(websiteUrl, environment);
  return "copied";
}
