import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const views = [
  { tab: 'Understand exposure', title: 'Security overview', score: '84%' },
  { tab: 'Explore cloud security', title: 'Cloud security', score: '78%' },
  { tab: 'Validate your controls', title: 'Security control validation', score: '71.2%' },
];

for (const width of [320, 390, 640, 768, 1024, 1440, 1920]) {
  test(`product explorer and layout at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 });
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    page.on('response', (response) => {
      if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`);
    });
    await page.goto('./');

    for (const view of views) {
      await page.getByRole('tab', { name: view.tab }).click();
      await expect(page.getByRole('heading', { name: view.title, exact: true })).toBeVisible();
      await expect(page.locator('#posture-value')).toHaveText(view.score);
      await expect(page.locator('.metric')).toHaveCount(4);
      await expect(page.locator('.finding-row')).toHaveCount(3);
      await page.evaluate(() =>
        Promise.all(
          [...document.images]
            .filter((image) => image.loading !== 'lazy' || image.complete)
            .map((image) => image.decode()),
        ),
      );
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
    }
    expect(errors).toEqual([]);
  });
}

test('tabs work with arrows, Home and End', async ({ page }) => {
  await page.goto('./');
  const first = page.getByRole('tab', { name: views[0].tab });
  await first.focus();
  await page.keyboard.press('ArrowRight');
  await expect(page.getByRole('tab', { name: views[1].tab })).toBeFocused();
  await page.keyboard.press('End');
  await expect(page.getByRole('tab', { name: views[2].tab })).toHaveAttribute('aria-selected', 'true');
  await page.keyboard.press('ArrowRight');
  await expect(first).toBeFocused();
  await page.keyboard.press('Home');
  await expect(first).toHaveAttribute('tabindex', '0');
});

test('finding details contain evidence, trap focus and restore the trigger', async ({ page }) => {
  await page.goto('./');
  const trigger = page.locator('.finding-row').first();
  await trigger.click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await expect(
    dialog.getByRole('heading', { name: 'Exposed workload with privileged access' }),
  ).toBeVisible();
  await expect(dialog.locator('.evidence-list li')).toHaveCount(3);
  await expect(dialog.locator('#dialog-resource')).toHaveText('demo-web-01');
  await dialog.getByRole('button', { name: 'Back to the overview' }).focus();
  await page.keyboard.press('Tab');
  await expect(dialog.getByRole('button', { name: 'Close finding details' })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(dialog).not.toBeVisible();
  await expect(trigger).toBeFocused();
  await expect(page.locator('html')).not.toHaveClass('has-dialog');
});

test('cloud and control findings retain their own investigation details', async ({ page }) => {
  await page.goto('./');
  for (const view of views.slice(1)) {
    await page.getByRole('tab', { name: view.tab }).click();
    for (const row of await page.locator('.finding-row').all()) {
      await row.click();
      await expect(page.locator('#dialog-resource')).toContainText('demo-');
      await expect(page.locator('#dialog-guidance')).not.toBeEmpty();
      await page.getByRole('button', { name: 'Close finding details' }).click();
      await expect(row).toBeFocused();
    }
  }
});

test('mobile navigation opens, closes, restores focus and follows links', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('./');
  await page.getByRole('button', { name: 'Open navigation' }).click();
  await expect(page.getByRole('navigation', { name: 'Main navigation' })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('button', { name: 'Open navigation' })).toBeFocused();
  await page.getByRole('button', { name: 'Open navigation' }).click();
  await page.getByRole('navigation').getByRole('link', { name: 'Platform', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Open navigation' })).toHaveAttribute(
    'aria-expanded',
    'false',
  );
  await expect(page).toHaveURL(/#platform$/);
});

test('context links select the intended product view', async ({ page }) => {
  await page.goto('./');
  await page.getByRole('link', { name: 'Explore validation' }).click();
  await expect(page.getByRole('tab', { name: 'Validate your controls' })).toHaveAttribute(
    'aria-selected',
    'true',
  );
  await expect(page.getByRole('heading', { name: 'Security control validation', exact: true })).toBeVisible();
});

test('hero investigation opens evidence and restores the originating link', async ({ page }) => {
  await page.goto('./');
  const trigger = page.getByRole('link', { name: 'Inspect example' });
  await trigger.click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await expect(dialog.locator('#dialog-resource')).toHaveText('demo-web-01');
  await expect(dialog.locator('.evidence-list li')).toHaveCount(3);
  await page.keyboard.press('Escape');
  await expect(dialog).not.toBeVisible();
  await expect(trigger).toBeFocused();
});

test('FAQ disclosures and demo contact links work', async ({ page }) => {
  await page.goto('./');
  await page.locator('summary').filter({ hasText: 'How can we see the platform in action?' }).click();
  await expect(page.locator('.faq-list details').last()).toHaveAttribute('open', '');
  const links = await page
    .locator('a[href^="mailto:"]')
    .evaluateAll((nodes) => nodes.map((node) => node.getAttribute('href')));
  expect(links.length).toBeGreaterThan(2);
  expect(links.every((href) => href?.startsWith('mailto:support@safora.ai'))).toBe(true);
});

test('essential content and demo contact work without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto('./');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Get a demo' }).first()).toHaveAttribute(
    'href',
    /mailto:support@safora.ai/,
  );
  await expect(page.locator('.metric')).toHaveCount(4);
  await context.close();
});

for (const width of [390, 1440]) {
  test(`accessibility at ${width}px, including an open finding`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto('./');
    const scan = () => new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
    expect(
      (await scan()).violations.map((item) => ({
        id: item.id,
        targets: item.nodes.map((node) => node.target),
      })),
    ).toEqual([]);
    await page.locator('.finding-row').first().click();
    expect(
      (await scan()).violations.map((item) => ({
        id: item.id,
        targets: item.nodes.map((node) => node.target),
      })),
    ).toEqual([]);
  });
}
