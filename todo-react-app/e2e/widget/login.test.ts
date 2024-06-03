import { expect, test } from '@playwright/test';

test('widget: login protect', async ({ page }) => {
  await page.goto('/?journey=TEST_LoginPingProtect');
  const loginButton = page.locator('.cstm_login-link');
  await loginButton.click();

  // const text = page.getByText('Sign in to Huckleberry Store');
  // await expect(text).toBeVisible();

  const username = page.getByLabel('Username');
  // const password = page.getByLabel('Password');

  await username.fill('ryan1');
  // await password.fill('Password1!');

  const submit = page.getByRole('button', { name: 'Next' });
  await submit.click();
  await expect(page.getByText('Evaluating device information')).toBeVisible();
  await expect(page.getByText('Medium Risk')).toBeVisible();
  const yes = page.getByText('Yes');
  await yes.click();
  await page.waitForResponse(/authenticate/);
  await page.waitForResponse(/authorize/);
  await page.waitForResponse(/callback\.html/);

  await expect(page.getByText('Welcome back, ryan ryan')).toBeVisible();
  await expect(
    page.getByText(
      'Learn how to develop ForgeRock protected, web apps with the React.js library and our JavaScript SDK',
    ),
  ).toBeVisible();
});
test('widget: initialize protect early', async ({ page }) => {
  await page.goto(
    '/?journey=TEST_LoginPingProtectNoCallback&initializeProtect=02fb4743-189a-4bc7-9d6c-a919edfe6447',
  );
  const loginButton = page.locator('.cstm_login-link');
  await loginButton.click();

  // const text = page.getByText('Sign in to Huckleberry Store');
  // await expect(text).toBeVisible();

  const username = page.getByLabel('Username');
  // const password = page.getByLabel('Password');

  await username.fill('ryan1');
  // await password.fill('Password1!');

  const submit = page.getByRole('button', { name: 'Next' });
  await submit.click();
  await expect(page.getByText('Evaluating device information')).toBeVisible();
  await expect(page.getByText('Medium Risk')).toBeVisible();
  const yes = page.getByText('Yes');
  await yes.click();
  await page.waitForResponse(/authenticate/);
  await page.waitForResponse(/authorize/);
  await page.waitForResponse(/callback\.html/);

  await expect(page.getByText('Welcome back, ryan ryan')).toBeVisible();
  await expect(
    page.getByText(
      'Learn how to develop ForgeRock protected, web apps with the React.js library and our JavaScript SDK',
    ),
  ).toBeVisible();
});
test('widget: login', async ({ page }) => {
  await page.goto('/');
  const loginButton = page.locator('.cstm_login-link');
  await loginButton.click();

  const text = page.getByText('Sign in to Huckleberry Store');
  await expect(text).toBeVisible();

  const username = page.getByLabel('Username');
  const password = page.getByLabel('Password');

  await username.fill('ryan1');
  await password.fill('Password1!');

  const submit = page.getByRole('button', { name: 'Next' });
  await submit.click();

  await page.waitForResponse(/authenticate/);
  await page.waitForResponse(/authorize/);
  await page.waitForResponse(/callback\.html/);

  await expect(page.getByText('Welcome back, ryan ryan')).toBeVisible();
  await expect(
    page.getByText(
      'Learn how to develop ForgeRock protected, web apps with the React.js library and our JavaScript SDK',
    ),
  ).toBeVisible();
});
