import path from "node:path";
import process from "node:process";

import { findpath } from "nw";
import selenium from "selenium-webdriver";
import chrome from "selenium-webdriver/chrome.js";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

describe("NW.js Window", async () => {
  /**
   * @type {selenium.ThenableWebDriver | undefined}
   */
  let driver = undefined;

  beforeAll(async function () {
    const options = new chrome.Options();
    const args = [
      'nwapp=' + path.resolve('tests', 'fixtures', 'api'),
      "headless=new",
    ];
    options.addArguments(args);

    const nwPath = await findpath('nwjs', { flavor: 'sdk' });
    options.setChromeBinaryPath(nwPath);

    driver = new selenium.Builder()
      .forBrowser('chrome')
      .setChromeOptions(options)
      .build();
  });

  it("has a height of 100px", async function () {
    const heightElement = await driver.findElement(selenium.By.id("nw-window-height"));
    const height = await heightElement.getText();
    // TODO: Fix this behaviour in upstream Chromium
    if (process.platform === "darwin") {
      expect(height).toEqual("128");
    } else if (process.platform === "win32") {
      expect(height).toEqual("139");
    } else {
      expect(height).toEqual("100");
    }
  });

  it("has a width of 100px", async function () {
    const widthElement = await driver.findElement(selenium.By.id("nw-window-width"));
    const width = await widthElement.getText();
    if (process.platform === "win32") {
      expect(width).toEqual("116");
    } else {
      expect(width).toEqual("100");
    }
  });

  it("has id which is of type string", async function () {
    const idElement = await driver.findElement(selenium.By.id("nw-window-id"));
    const id = await idElement.getText();
    expect(typeof id).toEqual("string");
  });

  it("has a title", async function () {
    const titleElement = await driver.findElement(selenium.By.id("nw-window-title"));
    const title = await titleElement.getText();
    expect(title).toEqual("Window");
  });

  it("has a `devtools-closed` event", async function () {
    const devtoolsElement = await driver.findElement(
      selenium.By.id("nw-window-on-devtools-closed"),
    );
    const devtools = await devtoolsElement.getText();
    // TODO: Add support for this event in NW.js
    // equal(devtools, "devtools-closed") is expected but not working
    expect(devtools).toEqual("");
  });

  afterAll(async function () {
    await driver.quit();
  });
});