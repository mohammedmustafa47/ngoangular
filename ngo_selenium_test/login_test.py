"""
Selenium test for the login page.

Prerequisites:
  - Angular app running locally:  npm start   (serves at http://localhost:4200)
  - Django backend running at:    http://127.0.0.1:8000
  - pip install selenium webdriver-manager

Run:
  python login_test.py
"""

from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager

BASE_URL = "http://localhost:8100/login"
VALID_USERNAME = "mustafa"
VALID_PASSWORD = "mustafa1234"


def wait_for_shadow_input(wait, element_id):
    """ion-input attaches its shadow root asynchronously after the custom
    element is upgraded, so the host id can exist in the DOM before
    shadowRoot.querySelector('input') is usable. Poll until it's ready."""
    return wait.until(
        lambda d: d.execute_script(
            """
            const host = document.getElementById(arguments[0]);
            if (!host || !host.shadowRoot) return null;
            return host.shadowRoot.querySelector('input');
            """,
            element_id,
        )
    )


def set_ionic_input_value(driver, wait, element_id, value):
    """ion-input renders its native <input> inside a shadow root, so
    send_keys on the host element doesn't reach it. Set the value directly
    on the shadow input and dispatch an 'input' event so Angular's ngModel
    picks up the change."""
    wait_for_shadow_input(wait, element_id)
    driver.execute_script(
        """
        const host = document.getElementById(arguments[0]);
        const input = host.shadowRoot.querySelector('input');
        const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
        setter.call(input, arguments[1]);
        input.dispatchEvent(new Event('input', { bubbles: true }));
        """,
        element_id,
        value,
    )


def main():
    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()))
    wait = WebDriverWait(driver, 10)

    try:
        driver.get(BASE_URL)

        wait.until(EC.presence_of_element_located((By.ID, "username-input")))
        submit_button = driver.find_element(By.ID, "login-submit-button")

        debug = driver.execute_script(
            """
            const host = document.getElementById('username-input');
            return {
                tag: host.tagName,
                hasShadowRoot: !!host.shadowRoot,
                outerHTML: host.outerHTML,
                shadowHTML: host.shadowRoot ? host.shadowRoot.innerHTML : null,
            };
            """
        )
        print("DEBUG username-input:", debug)

        set_ionic_input_value(driver, wait, "username-input", VALID_USERNAME)
        set_ionic_input_value(driver, wait, "password-input", VALID_PASSWORD)

        wait.until(lambda d: submit_button.get_attribute("aria-disabled") != "true")
        submit_button.click()

        try:
            wait.until(EC.alert_is_present())
            alert = driver.switch_to.alert
            print(f"Alert text: {alert.text}")
            alert.accept()
        except Exception:
            pass

        wait.until(lambda _: driver.current_url != BASE_URL)
        print(f"Redirected to: {driver.current_url}")

    finally:
        driver.quit()


if __name__ == "__main__":
    main()
