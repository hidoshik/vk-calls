import { Page, Locator } from "@playwright/test";

type MediaAccessResult = {
  video: boolean;
  audio: boolean;
  error?: string;
};

export class GuestCallsLogin {
  private readonly page: Page;
  readonly nameInput: Locator;
  readonly startButton: Locator;
  readonly joinButton: Locator;
  readonly leaveButton: Locator;
  readonly learnMoreButton: Locator;
  readonly returnButton: Locator;
  readonly errorAlert: Locator;
  readonly errorEmptyName: Locator;
  readonly errorInvalidName: Locator;
  readonly joinHeader: Locator;
  readonly leaveHeader: Locator;

  constructor(page: Page) {
    this.page = page;
    this.nameInput = page.locator('input[name="name"]');
    this.startButton = page.locator('[data-action="submit"]');
    this.joinButton = page.getByRole("button", { name: "Присоединиться" });
    this.leaveButton = page.getByText("Выйти");
    this.learnMoreButton = page.getByRole("button", {
      name: "Узнать о VK Teams",
    });
    this.returnButton = page.getByText("Назад");
    this.errorAlert = page.getByText("Извините, что-то пошло не так.");
    this.errorEmptyName = page.getByText("Введите имя");
    this.errorInvalidName = page.getByText(
      "Имя должно состоять не меньше чем из двух букв"
    );
    this.joinHeader = page.getByRole('heading', { name: 'Подождите, пока конференция начнётся', level: 3 });
    this.leaveHeader = page.getByText('Звонок завершён');
  }

  async goto(): Promise<void> {
    await this.page.goto(
      "/webim/call.html?saas=1&call_id=8448fdae17b64623b8d62de7022bdee9"
    );
  }

  async fillName(name: string): Promise<void> {
    await this.nameInput.fill(name);
  }

  async clickStart(): Promise<void> {
    await this.startButton.click();
  }

  async clickJoinCall(): Promise<void> {
    await this.joinButton.click();
  }

  async clickLeaveCall(): Promise<void> {
    await this.leaveButton.click();
  }

  async clickLearnMore(): Promise<void> {
    await this.learnMoreButton.click();
  }

  async clickReturn(): Promise<void> {
    await this.returnButton.click();
  }

  async checkMediaAccess(): Promise<MediaAccessResult> {
    const mediaAccess = await this.page.evaluate(async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        return {
          video: stream.getVideoTracks().length > 0,
          audio: stream.getAudioTracks().length > 0,
        };
      } catch (e) {
        return {
          video: false,
          audio: false,
          error: e instanceof Error ? e.message : "Unknown error",
        };
      }
    });

    return mediaAccess;
  }
}
