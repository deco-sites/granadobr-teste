// deno-lint-ignore-file no-explicit-any prefer-const no-var
import { asset, Head } from "$fresh/runtime.ts";
import { Props } from "./types.ts";
import { useScriptAsDataURI } from "@deco/deco/hooks";
const formKey = () => {
  let formKey: any, inputElements;
  const inputSelector = 'input[name="form_key"]';
  function setFormKeyCookie(value?: string) {
    let expires,
      secure,
      domain,
      date = new Date(),
      cookiesConfig = (window as any).cookiesConfig || {},
      isSecure = !!cookiesConfig.secure,
      samesite = cookiesConfig.samesite || "lax";
    date.setTime(date.getTime() + 86400000);
    expires = "; expires=" + date.toUTCString();
    secure = isSecure ? "; secure" : "";
    samesite = "; samesite=" + samesite;
    domain = `; ${
      globalThis.location.origin.includes("localhost")
        ? "localhost"
        : "domain=.granado.com.br"
    }`;
    document.cookie = "form_key=" + (value || "") + expires + secure +
      "; path=/" + samesite + domain;
  }
  function getFormKeyCookie() {
    let cookie, i;
    const nameEQ = "form_key=";
    const cookieArr = document.cookie.split(";");
    for (i = 0; i < cookieArr.length; i++) {
      cookie = cookieArr[i];
      while (cookie.charAt(0) === " ") {
        cookie = cookie.substring(1, cookie.length);
      }
      if (cookie.indexOf(nameEQ) === 0) {
        return cookie.substring(nameEQ.length, cookie.length);
      }
    }
    return null;
  }
  function getFormKeyFromUI() {
    return document.querySelector<any>(inputSelector)?.value;
  }
  function generateFormKeyString() {
    var result = "",
      length = 16,
      chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    while (length--) {
      result += chars[Math.round(Math.random() * (chars.length - 1))];
    }
    return result;
  }
  function initFormKey() {
    formKey = getFormKeyCookie();
    if (!formKey) {
      formKey = getFormKeyFromUI();
      setFormKeyCookie(formKey);
    }
    if (!formKey) {
      formKey = generateFormKeyString();
      setFormKeyCookie(formKey);
    }
    inputElements = document.querySelectorAll(inputSelector);
    if (inputElements.length) {
      Array.prototype.forEach.call(inputElements, function (element) {
        element.setAttribute("value", formKey);
      });
    }
  }
  initFormKey();
};
const GlobalTags = ({ revision }: Props) => {
  return (
    <Head>
      {/* Enable View Transitions API */}
      <meta name="view-transition" content="same-origin" />
      <script
        type="text/javascript"
        charset="utf-8"
        async
        src={useScriptAsDataURI(formKey)}
      >
      </script>

      {/* Disable zoom on mobile */}
      {
        /* <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
      /> */
      }

      {/* Tailwind v3 CSS file */}
      <link href={asset(`/styles.css?revision=${revision}`)} rel="stylesheet" />
      {/* Web Manifest */}
      <link rel="manifest" href={asset("/site.webmanifest")} />

      {/* Fonts */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
              @font-face {
                font-family: 'Granado';
                font-style: normal;
                font-display: swap;
                src: url(${asset("/fonts/Granado.woff2")}) format('woff2');
              }

              @font-face {
                font-family: 'Matria';
                font-style: normal;
                font-display: swap;
                src: url(${
            asset("/fonts/Matria-Regular.woff2")
          }) format('woff2');
              }

              @font-face {
                font-family: 'Matria';
                font-style: normal;
                font-weight: bold;
                font-display: swap;
                src: url(${asset("/fonts/Matria-Bold.woff2")}) format('woff2');
              }
            `,
        }}
      />
    </Head>
  );
};
export default GlobalTags;
