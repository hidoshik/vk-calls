import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/specs",
  timeout: 30_000,
  retries: 1,
  reporter: "list",

  use: {
    baseURL: "https://myteam.mail.ru",
    headless: false,
    viewport: { width: 1280, height: 720 },
    locale: "ru-RU",
    ignoreHTTPSErrors: true,
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
  },

  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        permissions: ["camera", "microphone"],
        launchOptions: {
          args: [
            "--use-fake-device-for-media-stream",
            "--use-fake-ui-for-media-stream",
          ],
        },
      },
    },
    {
      name: "firefox",
      use: {
        ...devices["Desktop Firefox"],
        browserName: "firefox",

        launchOptions: {
          firefoxUserPrefs: {
            "media.navigator.permission.disabled": true,
            "media.navigator.streams.fake": true,
          },
        },
      },
    },
    {
      name: "edge",
      use: {
        ...devices["Desktop Edge"],
        channel: "msedge",
        permissions: ["camera", "microphone"],
        launchOptions: {
          args: [
            "--use-fake-device-for-media-stream",
            "--use-fake-ui-for-media-stream",
          ],
        },
      },
    },
    {
      name: "safari",
      use: {
        browserName: "webkit",
        userAgent:
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.4 Safari/605.1.15",
        launchOptions: {
          executablePath: "/Applications/Safari.app/Contents/MacOS/Safari",
        },
      },
      grepInvert: /@audio|@video/, // safari не поддерживает ссылку
    },
  ],
});
