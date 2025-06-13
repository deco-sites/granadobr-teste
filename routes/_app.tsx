import { defineApp } from "$fresh/server.ts";
import Theme from "../sections/Theme/Theme.tsx";
import GlobalUi from "../components/globalUi/index.tsx";
import GlobalTags from "../components/globalTags/index.tsx";
import { Context } from "@deco/deco";
const sw = () =>
  addEventListener("load", () => {
    if (navigator && navigator.serviceWorker) {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        for (const registration of registrations) {
          registration.unregister();
        }
      });
    }
  });
export default defineApp(async (_req, ctx) => {
  const revision = await Context.active().release?.revision();
  return (
    <>
      {/* Queue-it */}
      {
        /*       <script
        type="text/javascript"
        src="//static.queue-it.net/script/queueclient.min.js"
      >
      </script>
      <script
        data-queueit-c="granado"
        type="text/javascript"
        src="//static.queue-it.net/script/queueconfigloader.min.js"
      >
      </script> */
      }

      {/* Include default fonts and css vars */}
      <Theme />

      {/* Include Icons and manifest */}
      <GlobalTags revision={revision} />

      {/* Rest of Preact tree */}
      <ctx.Component />

      {/* Include Global components */}
      <GlobalUi />

      {/* Include service worker */}
      <script
        type="module"
        dangerouslySetInnerHTML={{ __html: `(${sw})();` }}
      />

      <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
      />
    </>
  );
});
