import { test, expect } from "@playwright/test";
import { GuestCallsLogin } from "../page-objects/GuestCallsLogin";

test.describe("Valid Guest Calls login tests @video @audio", () => {
  let guestPage: GuestCallsLogin;

  test.beforeEach(async ({ page }) => {
    guestPage = new GuestCallsLogin(page);
    await guestPage.goto();
    await guestPage.fillName("Гость");
    await guestPage.clickStart();
  });

  test.afterEach(async ({ page }) => {
    await page.close();
  });

  test("Should grant basic permissions to guest user", async () => {
    const mediaAccess = await guestPage.checkMediaAccess();
    expect(mediaAccess.video, "Camera should be available").toBeTruthy();
    expect(mediaAccess.audio, "Microphone should be available").toBeTruthy();
  });

  test("Guest user should be able to join the call", async () => {
    await guestPage.clickJoinCall();
    await expect(guestPage.leaveButton).toBeVisible();
    await expect(guestPage.joinHeader).toBeVisible();
  });

  test("Guest user should be able to leave the call", async ({ page }) => {
    await guestPage.clickJoinCall();
    await guestPage.clickLeaveCall();
    await guestPage.learnMoreButton.waitFor({ state: "visible" });
    await expect(guestPage.learnMoreButton).toBeVisible();
    await expect(guestPage.leaveHeader).toBeVisible();
  });

  test('Guest user should be navigated to another page when clicking the button "Learn about VK teams"', async ({
    context,
  }) => {
    await guestPage.clickJoinCall();
    await guestPage.clickLeaveCall();

    const [newPage] = await Promise.all([
      context.waitForEvent("page"),
      guestPage.clickLearnMore(),
    ]);

    await newPage.waitForLoadState();
    await expect(newPage).toHaveURL("https://biz.mail.ru/teams");
  });

  test("Guest user should be able to return to previous step without errors", async () => {
    // Тест падает! Баг
    await guestPage.clickReturn();
    await guestPage.errorAlert.waitFor({ state: "visible" });
    const isVisible = await guestPage.errorAlert.isVisible();
    await expect(isVisible).toBeFalsy();
  });

  test("Guest user should be able to leave the call without errors", async () => {
    // Тест падает! Баг
    await guestPage.clickJoinCall();
    await guestPage.clickLeaveCall();
    await guestPage.errorAlert.waitFor({ state: "visible" });
    const isVisible = await guestPage.errorAlert.isVisible();
    await expect(isVisible).toBeFalsy();
  });
});

test.describe("Invalid Guest Calls login tests @video @audio", () => {
  let guestPage: GuestCallsLogin;

  test.beforeEach(async ({ page }) => {
    guestPage = new GuestCallsLogin(page);
    await guestPage.goto();
  });

  test("Should show error when name is an empty string", async () => {
    await guestPage.clickStart();
    await expect(guestPage.errorEmptyName).toBeVisible();
  });

  test("Should show error when name is less than two characters", async () => {
    await guestPage.fillName("А");
    await guestPage.clickStart();
    await expect(guestPage.errorInvalidName).toBeVisible();
  });
});
