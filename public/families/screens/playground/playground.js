/**
 * @file Playground screen: shows every UI component so they can be tried
 * out and reviewed in one place. Its own texts are in English, in the code:
 * it is a tool for developers, not a screen families see (ADR 0009 only
 * covers user-facing text). The samples keep t() to show the real texts.
 */

import { wait } from '../../../js/utils.js';
import { BalamButton } from '../../../components/button/button.js';
import { icon, iconNames } from '../../../js/icons.js';
import { t } from '../../../js/i18n/es.js';
import { BalamTextField } from '../../../components/text-field/text-field.js';
import { BalamMenu } from '../../../components/menu/menu.js';
import { avatar } from '../../../components/avatar/avatar.js';
import { card } from '../../../components/card/card.js';
import { splitNotice } from '../../../js/notice.js';
import { list } from '../../../components/list/list.js';
import { drawSwitch } from '../../../components/switch/switch.js';
import '../../../components/login-form/login-form.js';
// TODO: remove these two imports and the notices section once the notices
// screen exists. The playground talks to Firebase directly only because a
// teacher cannot log in through session.js (it requires a families/{uid}).
import {
  getConnection,
  signInWithEmailAndPassword,
} from '../../../js/firebase/connection.js';
import { getRecentNotices, publishNotice } from '../../../js/notices.js';

/** @typedef {import('../../../js/icons.js').IconName} IconName */

/**
 * Code to copy for each sample, written exactly as it goes in a screen's
 * template. `\${` keeps `${t('…')}` as text instead of running it here.
 */
const code = {
  buttonVariants: `import '../../../components/button/button.js';

<!-- default-primary: one per screen -->
<balam-button text="\${t('install.button')}"></balam-button>
<balam-button text="\${t('install.button')}" variant="secondary"></balam-button>

<!-- danger: only for destructive actions -->
<balam-button text="\${t('…')}" variant="danger-primary"></balam-button>
<balam-button text="\${t('…')}" variant="danger-secondary"></balam-button>`,

  buttonLoading: `<balam-button
  text="\${t('login.button.default')}"
  loading-text="\${t('login.button.loading')}"
></balam-button>

// In JS: tap the first button above to see it
const button = app.querySelector('balam-button');
if (!(button instanceof BalamButton)) throw new Error('…');
button.loading = true;   // shows loading-text and the pyramid
button.loading = false;  // back to text`,

  icons: `import { icon } from '../../../js/icons.js';

<span class="my-screen__icon">\${icon('megaphone')}</span>

/* The size and color come from the CSS, never from the SVG */
.my-screen__icon .icon {
  width: var(--space-24);
  height: var(--space-24);
  color: var(--text-secondary);
}`,

  textFieldNormal: `import '../../../components/text-field/text-field.js';

<balam-text-field
  label="\${t('login.username.label')}"
  left-icon="user"
  placeholder="\${t('login.username.placeholder')}"
></balam-text-field>
<balam-text-field
  label="\${t('login.password.label')}"
  left-icon="lock"
  type="password"
  placeholder="\${t('login.password.placeholder')}"
></balam-text-field>`,

  textFieldError: `<balam-text-field
  error-message="\${t('login.error.usernameEmpty')}"
  label="\${t('login.username.label')}"
></balam-text-field>

// In JS: show and clear the error
field.setAttribute('error-message', t('login.error.usernameEmpty'));
field.removeAttribute('error-message');`,

  textFieldForm: `<!-- Without name, the field is missing from FormData -->
<form data-my-form>
  <balam-text-field name="username" autocomplete="username" …></balam-text-field>
  <balam-text-field name="password" autocomplete="current-password" type="password" …></balam-text-field>
  <balam-button text="\${t('login.button.default')}"></balam-button>
</form>

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const formData = new FormData(form);
  const username = String(formData.get('username') ?? '');
});`,

  menu: `import '../../../components/menu/menu.js';

// items before append: connectedCallback draws them on entering the page
const menu = document.createElement('balam-menu');
menu.items = [
  { icon: 'books', text: t('…'), action: () => { … } },
  { icon: 'user-circle', text: t('…'), action: () => { … } },
  { icon: 'device-mobile-down', text: t('…'), action: () => { … } },
];
container.append(menu);`,

  avatar: `import { avatar } from '../../../components/avatar/avatar.js';

<!-- Family: no order, bigger and amber -->
\${avatar(family.username)}

<!-- Child: the order (from 1) picks one of 4 colors, then they repeat -->
\${family.children.map((child, index) => avatar(child.name, index + 1)).join('')}`,

  card: `import { card } from '../../../components/card/card.js';

<!-- Default (with border): groups settings, as in the account screen -->
\${card(/* HTML */ \`
  <div class="account__profile">
    \${avatar(family.username)}
    <p class="text-body">@\${family.username}</p>
  </div>
\`)}

<!-- borderless: content to read, one card per notice -->
import { splitNotice } from '../../../js/notice.js';

\${notices
  .map((notice) => {
    const { title, body } = splitNotice(notice.text);
    return card(
      /* HTML */ \`
        <h2 class="text-title">\${title}</h2>
        <p class="text-body">\${body}</p>
      \`,
      'borderless',
    );
  })
  .join('')}`,

  list: `import { list } from '../../../components/list/list.js';

// One object per row; list() draws the <ul> and a <li> for each
\${card(
  list([
    // div (default): only shows data
    ...family.children.map((child, index) => ({
      leading: avatar(child.name, index + 1),
      content: child.name,
      trailing: child.grade,
    })),

    // button: does something when tapped
    {
      leading: icon('refresh'),
      content: t('account.refresh'),
      tag: 'button',
    },

    // label: tapping anywhere on the row flips the switch
    {
      leading: icon('bell'),
      content: t('account.notifications'),
      trailing: drawSwitch(false, false),
      tag: 'label',
    },
  ]),
)}`,

  loginForm: `import '../../../components/login-form/login-form.js';

<balam-login-form></balam-login-form>

// Fires login-submit only when the data is valid
loginForm.addEventListener('login-submit', (event) => {
  const { username, password } = event.detail;
});`,

  textFieldDisabled: `<balam-text-field
  disabled
  label="\${t('login.username.label')}"
></balam-text-field>`,
};

/**
 * Draws a code example below a sample. Escapes it so the browser shows the
 * tags as text instead of drawing them.
 * @param {string} text - The code, as written in `code`.
 * @returns {string} HTML of the code block.
 */
function drawCode(text) {
  const escaped = text
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
  return /* HTML */ `<pre
    class="playground__code"
  ><code>${escaped}</code></pre>`;
}

/**
 * Builds one button of the nav tree that scrolls to its title. They are
 * buttons, not `#id` links: changing the # would make the router look for
 * another screen.
 * @param {Element} title - The h2 or h3 the button scrolls to.
 * @returns {HTMLButtonElement} The button.
 */
function navButton(title) {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'playground__nav-link';
  button.textContent = title.textContent;
  button.addEventListener('click', () => {
    title.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
  return button;
}

/**
 * Fills the side nav with a tree read from the titles: each section (h2)
 * and, below it, its samples (h3). A new section shows up in the nav without
 * touching it.
 * @param {HTMLElement} app - Container where the playground is drawn.
 * @throws {Error} If the nav is missing from the template.
 */
function drawNav(app) {
  const nav = app.querySelector('[data-playground-nav]');
  if (!(nav instanceof HTMLElement)) {
    throw new Error('[data-playground-nav] not found in the playground');
  }

  const tree = document.createElement('ul');
  tree.className = 'playground__tree';

  for (const section of app.querySelectorAll('.playground__section')) {
    const title = section.querySelector(':scope > h2');
    if (!title) continue;

    const item = document.createElement('li');
    item.append(navButton(title));

    const subtitles = section.querySelectorAll('h3');
    if (subtitles.length > 0) {
      const branch = document.createElement('ul');
      branch.className = 'playground__tree playground__tree--branch';
      for (const subtitle of subtitles) {
        const leaf = document.createElement('li');
        leaf.append(navButton(subtitle));
        branch.append(leaf);
      }
      item.append(branch);
    }

    tree.append(item);
  }

  nav.append(tree);
}

/**
 * Shows the playground screen inside the container.
 * @param {HTMLElement} app - Container where the screen is drawn.
 */
export function showPlayground(app) {
  document.title = 'Balam - Catalog';

  app.innerHTML = /* HTML */ `
    <div class="playground-layout">
      <nav
        class="playground__nav"
        data-playground-nav
        aria-label="Sections"
      ></nav>
      <div class="playground">
        <h1 class="text-display">Component catalog</h1>

        <section class="playground__section">
          <h2 class="text-title">Button</h2>
          <div class="playground__sample">
            <balam-button text="${t('install.button')}"></balam-button>
            <balam-button
              text="${t('install.button')}"
              variant="secondary"
            ></balam-button>
            <balam-button text="Delete" variant="danger-primary"></balam-button>
            <balam-button
              text="Delete"
              variant="danger-secondary"
            ></balam-button>
          </div>
          ${drawCode(code.buttonVariants)} ${drawCode(code.buttonLoading)}
        </section>

        <section class="playground__section">
          <h2 class="text-title">Avatar</h2>
          <div class="playground__sample">
            <h3>Family</h3>
            <div class="playground__row">${avatar('arguijoreyes')}</div>
            <h3>Children (the 5th repeats color 1)</h3>
            <div class="playground__row">
              ${['Ana', 'Luis', 'Óscar', 'Emma', 'Iris']
                .map((name, index) => avatar(name, index + 1))
                .join('')}
            </div>
            <h3>Edge cases: accent and empty name</h3>
            <div class="playground__row">
              ${avatar('Ángel', 1)} ${avatar('', 2)} ${avatar(null)}
            </div>
          </div>
          ${drawCode(code.avatar)}
        </section>

        <section class="playground__section">
          <h2 class="text-title">Card</h2>
          <div class="playground__sample">
            <h3>Default (with border): account profile</h3>
            ${card(/* HTML */ `
              <div class="playground__row">
                ${avatar('arguijoreyes')}
                <p class="text-body"><strong>User:</strong> @arguijoreyes</p>
              </div>
            `)}
            <h3>Borderless: notices</h3>
            ${[
              'Early dismissal\nToday, March 10, students leave at 3:00 PM to decorate for Father’s Day.',
              'Parent meeting\nReminder: the parent meeting is on Thursday at 6:00 PM.',
            ]
              .map((text) => {
                const { title, body } = splitNotice(text);
                return card(
                  /* HTML */ `
                    <h4 class="text-title">${title}</h4>
                    <p class="text-body">${body}</p>
                  `,
                  'borderless',
                );
              })
              .join('')}
          </div>
          ${drawCode(code.card)}
        </section>

        <section class="playground__section">
          <h2 class="text-title">List</h2>
          <div class="playground__sample">
            <h3>Account rows, inside a card</h3>
            ${card(
              list([
                {
                  leading: avatar('Ana', 1),
                  content: 'Ana Smith',
                  trailing: '7-1',
                },
                {
                  leading: avatar('Luis', 2),
                  content: 'Luis Smith',
                  trailing: '8-1',
                },
                {
                  leading: icon('clock'),
                  content: 'Refresh data',
                  tag: 'button',
                },
                {
                  leading: icon('megaphone'),
                  content: 'Notifications',
                  trailing: drawSwitch(false, false),
                  tag: 'label',
                },
                {
                  leading: icon('share'),
                  content: 'Requests and questions',
                  tag: 'button',
                },
              ]),
            )}
          </div>
          ${drawCode(code.list)}
        </section>

        <section class="playground__section">
          <h2 class="text-title">Switch</h2>
          <div class="playground__sample">
            <h3>Tap it to turn it on and off</h3>
            <div class="playground__row">${drawSwitch(false, false)}</div>
            <h3>Disabled: off and on</h3>
            <div class="playground__row">
              ${drawSwitch(false, true)} ${drawSwitch(true, true)}
            </div>
          </div>
        </section>

        <section class="playground__section">
          <h2 class="text-title">Menu</h2>
          <div class="playground__sample" data-menu-sample></div>
          <p>Open the menu and tap an option: its action shows up below.</p>
          <pre
            class="playground__console playground__console--log"
            data-menu-output
          ></pre>
          ${drawCode(code.menu)}
        </section>

        <section class="playground__section">
          <h2 class="text-title">Icons</h2>
          ${drawCode(code.icons)}
          <div class="playground__icons">${drawIcons()}</div>
        </section>

        <section class="playground__section">
          <h2 class="text-title">Text field</h2>
          <div class="playground__sample">
            <h3>Normal state</h3>
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
          ${drawCode(code.textFieldNormal)}
          <div class="playground__sample">
            <h3>Error state</h3>
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
          ${drawCode(code.textFieldError)}
          <form class="playground__sample" data-form-sample>
            <h3>Inside a form</h3>
            <p>Type and tap Entrar: what the form sends shows up below.</p>
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
          ${drawCode(code.textFieldForm)}
          <div class="playground__sample">
            <h3>Disabled state</h3>
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
          ${drawCode(code.textFieldDisabled)}
        </section>

        <section class="playground__section">
          <h2 class="text-title">Login form</h2>
          <div class="playground__sample">
            <balam-login-form data-login-form-sample></balam-login-form>
          </div>
          <p>
            Send the form with valid data: the login-submit event shows up
            below.
          </p>
          <pre
            class="playground__console playground__console--log"
            data-login-form-output
          ></pre>
          ${drawCode(code.loginForm)}
        </section>

        <section class="playground__section playground__section--dev">
          <h2 class="text-title">Notices test (real Firestore)</h2>
          <p class="playground__status">
            Session:
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
                    Log out
                  </button>
                </div>
              </form>
              <form class="playground__fieldset" data-notices-publish>
                <label class="playground__control-label">
                  Group
                  <input
                    class="playground__control"
                    name="groupId"
                    value="7-1"
                  />
                </label>
                <label class="playground__control-label">
                  Text (the first line is the title)
                  <textarea
                    class="playground__control"
                    name="text"
                    rows="3"
                  ></textarea>
                </label>
                <div class="playground__actions">
                  <button class="playground__dev-button">Publish</button>
                  <button
                    class="playground__dev-button"
                    type="button"
                    data-notices-read
                  >
                    Read the group's notices
                  </button>
                </div>
              </form>
            </div>
            <pre class="playground__console" data-notices-output></pre>
          </div>
        </section>
      </div>
    </div>
  `;

  drawNav(app);
  setUpNoticesTest(app);

  const loginForm = app.querySelector('[data-login-form-sample]');
  const loginFormOutput = app.querySelector('[data-login-form-output]');
  if (!loginForm || !loginFormOutput) {
    throw new Error('Login form sample not found in the playground');
  }

  // Prints each event with the time, so the history stays visible. The
  // password is printed too: it is a fake one, typed only to test.
  loginForm.addEventListener('login-submit', (event) => {
    if (!(event instanceof CustomEvent)) return;
    const time = new Date().toLocaleTimeString();
    const detail = JSON.stringify(event.detail);
    loginFormOutput.textContent += `[${time}] login-submit ${detail}
`;
    loginFormOutput.scrollTop = loginFormOutput.scrollHeight;
  });

  // The menu is created in JS, not in the template: its items must be set
  // before it enters the page, because connectedCallback draws them.
  // TODO: use t() once the menu keys exist in es.js.
  const menuSample = app.querySelector('[data-menu-sample]');
  const menuOutput = app.querySelector('[data-menu-output]');
  if (!menuSample || !menuOutput) {
    throw new Error('Menu sample not found in the playground');
  }
  const menu = document.createElement('balam-menu');
  if (!(menu instanceof BalamMenu)) throw new Error('<balam-menu> not defined');

  /**
   * Builds a fake action that adds a line with the tapped option and the
   * time, so the history of taps stays visible.
   * @param {string} name - Name of the option, to print.
   * @returns {() => void} The action for that option.
   */
  const logTap = (name) => () => {
    const time = new Date().toLocaleTimeString();
    menuOutput.textContent += `[${time}] Tapped: ${name}\n`;
    // Follows the newest line, like a real console
    menuOutput.scrollTop = menuOutput.scrollHeight;
  };

  menu.items = [
    { icon: 'books', text: 'Libros', action: logTap('books') },
    { icon: 'user-circle', text: 'Cuenta', action: logTap('account') },
    {
      icon: 'device-mobile-down',
      text: 'Instalar app',
      action: logTap('install'),
    },
  ];
  menuSample.append(menu);

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
  const { auth } = getConnection();

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
      publishNotice(String(groupId), { text: String(text) }).then((id) => ({
        published: id,
      })),
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
