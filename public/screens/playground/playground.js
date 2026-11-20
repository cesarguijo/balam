/**
 * @file Playground screen: shows every UI component so they can be tried
 * out and reviewed in one place.
 */

import { wait } from '../../js/utils.js';
import { BalamButton } from '../../components/button/button.js';
import { icon, iconNames } from '../../js/icons.js';
import { t } from '../../js/i18n/es.js';
import { BalamTextField } from '../../components/text-field/text-field.js';
// TODO: remove these two imports and the notices section once the notices
// screen exists. The playground talks to Firebase directly only because a
// teacher cannot log in through session.js (it requires a families/{uid}).
import {
  auth,
  signInWithEmailAndPassword,
} from '../../js/firebase/connection.js';
import { getRecentNotices, publishNotice } from '../../js/notices.js';

/** @typedef {import('../../js/icons.js').IconName} IconName */

/**
 * Shows the playground screen inside the container.
 * @param {HTMLElement} app - Container where the screen is drawn.
 */
export function showPlayground(app) {
  document.title = t('playground.pageTitle');

  app.innerHTML = /* HTML */ `
    <div class="playground">
      <h1 class="text-display">${t('playground.title')}</h1>

      <section class="playground__section">
        <h2 class="text-title">${t('playground.button')}</h2>
        <div class="playground__sample">
          <balam-button text="${t('install.button')}"></balam-button>
        </div>
      </section>

      <section class="playground__section">
        <h2 class="text-title">${t('playground.icons')}</h2>
        <div class="playground__icons">${drawIcons()}</div>
      </section>

      <section class="playground__section">
        <h2 class="text-title">${t('playground.textField')}</h2>
        <div class="playground__sample">
          <h3>${t('playground.textField.normal')}</h3>
          <balam-text-field
            label="${t('login.username.label')}"
            left-icon="user"
            placeholder="${t('login.username.placeholder')}"
          ></balam-text-field>
          <balam-text-field
            label="${t('login.password.label')}"
            left-icon="lock"
            type="password"
            placeholder="${t('login.password.placeholder')}"
          ></balam-text-field>
        </div>
        <div class="playground__sample">
          <h3>${t('playground.textField.error')}</h3>
          <balam-text-field
            error-message="${t('login.error.usernameEmpty')}"
            label="${t('login.username.label')}"
            left-icon="user"
            placeholder="${t('login.username.placeholder')}"
          ></balam-text-field>
          <balam-text-field
            error-message="${t('login.error.passwordEmpty')}"
            label="${t('login.password.label')}"
            left-icon="lock"
            type="password"
            placeholder="${t('login.password.placeholder')}"
          ></balam-text-field>
        </div>
        <form class="playground__sample" data-form-sample>
          <h3>${t('playground.textField.form')}</h3>
          <p>${t('playground.textField.formHint')}</p>
          <balam-text-field
            name="username"
            autocomplete="username"
            label="${t('login.username.label')}"
            left-icon="user"
            placeholder="${t('login.username.placeholder')}"
          ></balam-text-field>
          <balam-text-field
            name="password"
            autocomplete="current-password"
            label="${t('login.password.label')}"
            left-icon="lock"
            type="password"
            placeholder="${t('login.password.placeholder')}"
          ></balam-text-field>
          <balam-button text="${t('login.button.default')}"></balam-button>
          <pre data-form-output></pre>
        </form>
        <div class="playground__sample">
          <h3>${t('playground.textField.disabled')}</h3>
          <balam-text-field
            disabled
            label="${t('login.username.label')}"
            left-icon="user"
            placeholder="${t('login.username.placeholder')}"
          ></balam-text-field>
          <balam-text-field
            disabled
            label="${t('login.password.label')}"
            left-icon="lock"
            type="password"
            placeholder="${t('login.password.placeholder')}"
          ></balam-text-field>
        </div>
      </section>

      <section class="playground__section playground__section--dev">
        <h2 class="text-title">${t('playground.notices')}</h2>
        <p class="playground__status">
          ${t('playground.notices.account')}
          <strong data-notices-account>—</strong>
        </p>
        <div class="playground__dev">
          <div class="playground__panel">
            <form class="playground__fieldset" data-notices-login>
              <label class="playground__control-label">
                ${t('login.username.label')}
                <input
                  class="playground__control"
                  name="username"
                  autocomplete="username"
                />
              </label>
              <label class="playground__control-label">
                ${t('login.password.label')}
                <input
                  class="playground__control"
                  name="password"
                  type="password"
                  autocomplete="current-password"
                />
              </label>
              <div class="playground__actions">
                <button class="playground__dev-button">
                  ${t('login.button.default')}
                </button>
                <button
                  class="playground__dev-button"
                  type="button"
                  data-notices-logout
                >
                  ${t('playground.notices.logout')}
                </button>
              </div>
            </form>
            <form class="playground__fieldset" data-notices-publish>
              <label class="playground__control-label">
                ${t('playground.notices.group')}
                <input class="playground__control" name="groupId" value="7-1" />
              </label>
              <label class="playground__control-label">
                ${t('playground.notices.text')}
                <textarea
                  class="playground__control"
                  name="text"
                  rows="3"
                ></textarea>
              </label>
              <div class="playground__actions">
                <button class="playground__dev-button">
                  ${t('playground.notices.publish')}
                </button>
                <button
                  class="playground__dev-button"
                  type="button"
                  data-notices-read
                >
                  ${t('playground.notices.read')}
                </button>
              </div>
            </form>
          </div>
          <pre class="playground__console" data-notices-output></pre>
        </div>
      </section>
    </div>
  `;

  setUpNoticesTest(app);

  const button = app.querySelector('balam-button');
  if (!(button instanceof BalamButton)) {
    throw new Error('<balam-button> not found in the playground');
  }

  const textField = app.querySelector('balam-text-field');
  if (!(textField instanceof BalamTextField)) {
    throw new Error('<balam-text-field> not found in the playground');
  }

  button.addEventListener('click', async () => {
    if (button.loading) return;
    button.loading = true;
    // Simulates a slow task, to see the loading state
    await wait(3000);
    button.loading = false;
  });

  const form = app.querySelector('[data-form-sample]');
  const formOutput = app.querySelector('[data-form-output]');
  if (!(form instanceof HTMLFormElement) || !formOutput) {
    throw new Error('Form sample not found in the playground');
  }

  // Shows what the form really sends: an input without `name` is missing
  // from FormData, so this reveals whether the field passes it through.
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(form));
    formOutput.textContent = JSON.stringify(data, null, 2);
  });
}

/**
 * Wires the notices test: log in with any account, publish and read
 * notices against the real Firestore, and print what came back (or the
 * error type) so the rules and the adapter can be checked by hand.
 * @param {HTMLElement} app - Container where the playground was drawn.
 */
function setUpNoticesTest(app) {
  const loginForm = app.querySelector('[data-notices-login]');
  const publishForm = app.querySelector('[data-notices-publish]');
  const readButton = app.querySelector('[data-notices-read]');
  const logoutButton = app.querySelector('[data-notices-logout]');
  const account = app.querySelector('[data-notices-account]');
  const output = app.querySelector('[data-notices-output]');
  if (
    !(loginForm instanceof HTMLFormElement) ||
    !(publishForm instanceof HTMLFormElement) ||
    !(readButton instanceof HTMLButtonElement) ||
    !logoutButton ||
    !account ||
    !output
  ) {
    throw new Error('Notices test not found in the playground');
  }

  // The account line is always visible, so it is clear which rules apply
  // (teacher or family) before pressing anything.
  auth.onAuthStateChanged((user) => {
    account.textContent = user?.email ?? '—';
  });

  /**
   * Prints a result in the console box, with the time, so two equal
   * results in a row can still be told apart.
   * @param {unknown} result - Anything to show; errors show their type.
   */
  const show = (result) => {
    const time = new Date().toLocaleTimeString();
    const text =
      result instanceof Error
        ? `${result.name}: ${'type' in result ? result.type : result.message}`
        : JSON.stringify(result, null, 2);
    output.textContent = `[${time}]\n${text}`;
  };

  /**
   * Disables a button while a request runs, so a second tap does not send
   * it twice (e.g. publishing the same notice twice).
   * @param {HTMLButtonElement} button - The button that started the request.
   * @param {Promise<unknown>} request - The request to wait for.
   */
  const whileLoading = (button, request) => {
    button.disabled = true;
    request
      .then(show)
      .catch(show)
      .finally(() => {
        button.disabled = false;
      });
  };

  loginForm.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!(event.submitter instanceof HTMLButtonElement)) return;
    const { username, password } = Object.fromEntries(new FormData(loginForm));
    whileLoading(
      event.submitter,
      signInWithEmailAndPassword(
        auth,
        `${String(username).trim().toLowerCase()}@balam.local`,
        String(password),
      ).then(() => 'Logged in'),
    );
  });

  publishForm.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!(event.submitter instanceof HTMLButtonElement)) return;
    const { groupId, text } = Object.fromEntries(new FormData(publishForm));
    whileLoading(
      event.submitter,
      publishNotice(String(groupId), { text: String(text) }).then((id) => ({ published: id })),
    );
  });

  readButton.addEventListener('click', () => {
    const groupId = new FormData(publishForm).get('groupId');
    whileLoading(readButton, getRecentNotices(String(groupId)));
  });

  logoutButton.addEventListener('click', () => {
    auth.signOut().then(() => show('Logged out'));
  });
}

/**
 * Draws every available icon, to check at a glance that they are centered.
 * @returns {string} HTML with one icon per name in iconNames.
 */
export function drawIcons() {
  let icons = ``;
  iconNames.forEach((name) => {
    icons =
      icons +
      /* HTML */ `
        <figure class="playground__icon">
          ${icon(/** @type {IconName} */ (name))}
          <figcaption class="playground__name">${name}</figcaption>
        </figure>
      `;
  });
  return icons;
}
