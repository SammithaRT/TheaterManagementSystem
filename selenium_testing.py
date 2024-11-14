from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.firefox.service import Service
from selenium.webdriver.firefox.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
import time

# Set options for headless mode if desired (for testing without a visible browser)
options = Options()
options.headless = False  # Set to False if you want to see the browser window

# Path to your geckodriver
gecko_path = r'/home/sammitha/Apps/geckodriver'

# Path to your Firefox binary
# firefox_binary_path = r"C:\Program Files\Mozilla Firefox\firefox.exe"

# Specify the Firefox binary path
# options.binary_location = firefox_binary_path

# Set up the service with the path to GeckoDriver if needed
service = Service(gecko_path)

# Initialize the WebDriver for Firefox
driver = webdriver.Firefox(service=service, options=options)

try:
    # Open localhost
    driver.get("http://localhost:3000")
    time.sleep(2)

    # button = driver.find_element(By.CLASS_NAME, "button")
    events_link = driver.find_element(By.LINK_TEXT, "Events")
    events_link.click()

    time.sleep(2)

    samparpana_link = driver.find_element(By.LINK_TEXT, "Samparpana")
    samparpana_link.click()

    time.sleep(2)

    lost_link = driver.find_element(By.LINK_TEXT, "The Lost Treasure")
    lost_link.click()

    time.sleep(2)
    back_button = driver.find_element(By.XPATH, "//button[text()='Back']")
    back_button.click()

    time.sleep(2)

    book_button = driver.find_element(By.XPATH, "//button[text()='Book Event']")
    book_button.click()

    # time.sleep(2)

    input_field = driver.find_element(By.XPATH, "//label[contains(text(), 'Name')]/input")
    input_field.send_keys("Rahul")

# Step 2: Find the label by its text and verify the action (optional)
    name_label = driver.find_element(By.XPATH, "//label[contains(text(), 'Name')]")
    print("Found label with text:", name_label.text)

    time.sleep(1)

# Step 2: Find the label by its text and verify the action (optional)
    name_label = driver.find_element(By.XPATH, "//label[contains(text(), 'SRN')]")
    print("Found label with text:", name_label.text)

    input_field = driver.find_element(By.XPATH, "//label[contains(text(), 'SRN')]/input")
    input_field.send_keys("6789")

    time.sleep(1)

    name_label = driver.find_element(By.XPATH, "//label[contains(text(), 'Department')]")
    print("Found label with text:", name_label.text)

    input_field = driver.find_element(By.XPATH, "//label[contains(text(), 'Department')]/input")
    input_field.send_keys("CSE")

    time.sleep(1)

    name_label = driver.find_element(By.XPATH, "//label[contains(text(), 'Semester')]")
    print("Found label with text:", name_label.text)

    input_field = driver.find_element(By.XPATH, "//label[contains(text(), 'Semester')]/input")
    input_field.send_keys("5")

    time.sleep(1)

    sub_button = driver.find_element(By.XPATH, "//button[text()='Submit']")
    sub_button.click()

    time.sleep(1)

    alert = driver.switch_to.alert

    # Optionally accept or dismiss the alert (dismiss closes it)
    alert.dismiss()

    time.sleep(1)

    close_button = WebDriverWait(driver, 10).until(
    EC.element_to_be_clickable((By.CLASS_NAME, "close"))
    )

    close_button.click()

    time.sleep(1)

    back_btn = driver.find_element(By.XPATH, "//button[text()='Back']")
    back_btn.click()
    
    time.sleep(1)

    bck_link = driver.find_element(By.LINK_TEXT, "Back")
    bck_link.click()

    time.sleep(2)

    # login_link = driver.find_element(By.LINK_TEXT, "Login")
    # login_link.click()
    
finally:
    # Close the browser window
    driver.quit()
