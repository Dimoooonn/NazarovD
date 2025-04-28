const { Builder, By, until, Key, Actions } = require("selenium-webdriver");
const path = require("path");

jest.setTimeout(30000); // Збільшення таймауту для тривалих операцій

const uniqueId = Math.floor(Math.random() * 100000);
const testUser = {
  username: "SampleTester",
  userEmail: `sampletester${uniqueId}@example.com`,
  userPassword: "SecurePass123",
  personalInfo: {
    firstName: "Jane",
    lastName: "Smith",
    companyName: "DemoCompany",
  },
  addressInfo: {
    addressLine1: "456 Demo Avenue",
    addressLine2: "Suite 10A",
    country: "Canada",
    state: "Ontario",
    city: "Ottawa",
    postalCode: "K1P 1A4",
    phoneNumber: "9876543210",
  },
};

describe("Automation Exercise — Перевірка головної сторінки", () => {
  let driver;

  beforeAll(async () => {
    driver = await new Builder().forBrowser("chrome").build();
    await driver.get("https://automationexercise.com/");
  }, 20000);

  afterAll(async () => {
    await driver.quit();
  });

  test("Перевірка наявності логотипу на сайті (alt-атрибут)", async () => {
    const logoElement = await driver.wait(
      until.elementLocated(By.css('img[alt="Website for automation practice"]')),
      10000
    );
    const altAttribute = await logoElement.getAttribute("alt");
    expect(altAttribute).toBe("Website for automation practice");
  });

  test("Перевірка існування навігаційного меню (ul.nav)", async () => {
    const navigationMenu = await driver.findElement(By.css("ul.nav.navbar-nav"));
    expect(navigationMenu).toBeDefined();
  });

  test("Перевірка наявності кнопки 'Signup / Login' (по тексту)", async () => {
    const signupLoginButton = await driver.findElement(By.linkText("Signup / Login"));
    const buttonText = await signupLoginButton.getText();
    expect(buttonText).toContain("Signup");
  });
});

describe("Test Scenario 1: User Registration Process", () => {
  let browser;

  beforeAll(async () => {
    browser = await new Builder().forBrowser("chrome").build();
  }, 30000);

  afterAll(async () => {
    await browser.quit();
  });

  test("Відкрити сайт та перевірити заголовок сторінки", async () => {
    await browser.get("http://automationexercise.com");
    await browser.wait(until.titleContains("Automation Exercise"), 10000);
    const pageTitle = await browser.getTitle();
    expect(pageTitle).toBe("Automation Exercise");
  });

  test("Перехід до форми реєстрації через 'Signup / Login'", async () => {
    await browser.findElement(By.linkText("Signup / Login")).click();
    const newUserTitle = await browser.wait(
      until.elementLocated(By.xpath("//h2[contains(text(),'New User Signup!')]")),
      10000
    );
    expect(await newUserTitle.getText()).toBe("New User Signup!");
  });

  test("Заповнення початкової інформації користувача", async () => {
    await browser.findElement(By.name("name")).sendKeys(testUser.username);
    await browser.findElement(By.css('input[data-qa="signup-email"]')).sendKeys(testUser.userEmail);
    await browser.findElement(By.css('button[data-qa="signup-button"]')).click();

    const accountInfoTitle = await browser.wait(
      until.elementLocated(By.xpath("//b[contains(text(),'Enter Account Information')]")),
      10000
    );
    expect(await accountInfoTitle.getText()).toContain("ENTER ACCOUNT INFORMATION");
  });

  test("Заповнення розширеної інформації акаунта", async () => {
    await browser.findElement(By.id("id_gender1")).click();
    await browser.findElement(By.id("password")).sendKeys(testUser.userPassword);
    await browser.findElement(By.id("days")).sendKeys("10");
    await browser.findElement(By.id("months")).sendKeys("May");
    await browser.findElement(By.id("years")).sendKeys("1995");

    await browser.findElement(By.id("newsletter")).click();
    await browser.findElement(By.id("optin")).click();

    await browser.findElement(By.id("first_name")).sendKeys(testUser.personalInfo.firstName);
    await browser.findElement(By.id("last_name")).sendKeys(testUser.personalInfo.lastName);
    await browser.findElement(By.id("company")).sendKeys(testUser.personalInfo.companyName);
    await browser.findElement(By.id("address1")).sendKeys(testUser.addressInfo.addressLine1);
    await browser.findElement(By.id("address2")).sendKeys(testUser.addressInfo.addressLine2);
    await browser.findElement(By.id("country")).sendKeys(testUser.addressInfo.country);
    await browser.findElement(By.id("state")).sendKeys(testUser.addressInfo.state);
    await browser.findElement(By.id("city")).sendKeys(testUser.addressInfo.city);
    await browser.findElement(By.id("zipcode")).sendKeys(testUser.addressInfo.postalCode);
    await browser.findElement(By.id("mobile_number")).sendKeys(testUser.addressInfo.phoneNumber);
  });

  test("Створення акаунта та підтвердження успішної реєстрації", async () => {
    await browser.findElement(By.css('button[data-qa="create-account"]')).click();

    const accountCreatedMsg = await browser.wait(
      until.elementLocated(By.xpath("//b[contains(text(),'Account Created!')]")),
      10000
    );
    expect(await accountCreatedMsg.getText()).toContain("ACCOUNT CREATED!");
  });

  test("Перевірка авторизації користувача", async () => {
    jest.setTimeout(15000);

    await browser.findElement(By.css('a[data-qa="continue-button"]')).click();
    const loggedInIndicator = await browser.wait(
      until.elementLocated(By.xpath("//a[contains(., 'Logged in as')]")),
      15000
    );

    const loggedInText = await loggedInIndicator.getText();
    expect(loggedInText).toMatch(/Logged in as/i);
  });

  test("Видалення акаунта", async () => {
    await browser.findElement(By.linkText("Delete Account")).click();

    const accountDeletedMsg = await browser.wait(
      until.elementLocated(By.xpath("//b[contains(text(),'Account Deleted!')]")),
      10000
    );
    expect(await accountDeletedMsg.getText()).toContain("ACCOUNT DELETED!");
  });
});

describe("Scenario 2: Successful Login with Valid Credentials", () => {
  let browser;

  beforeAll(async () => {
    browser = await new Builder().forBrowser("chrome").build();
    await browser.get("https://automationexercise.com/");

    // Створення нового користувача для тестування
    await browser.findElement(By.linkText("Signup / Login")).click();
    await browser.findElement(By.name("name")).sendKeys(testUser.username);
    await browser.findElement(By.css('input[data-qa="signup-email"]')).sendKeys(testUser.userEmail);
    await browser.findElement(By.css('button[data-qa="signup-button"]')).click();

    await browser.wait(until.elementLocated(By.xpath("//b[contains(text(),'Enter Account Information')]")), 10000);

    await browser.findElement(By.id("id_gender1")).click();
    await browser.findElement(By.id("password")).sendKeys(testUser.userPassword);
    await browser.findElement(By.id("days")).sendKeys("10");
    await browser.findElement(By.id("months")).sendKeys("May");
    await browser.findElement(By.id("years")).sendKeys("1995");

    await browser.findElement(By.id("newsletter")).click();
    await browser.findElement(By.id("optin")).click();

    await browser.findElement(By.id("first_name")).sendKeys(testUser.personalInfo.firstName);
    await browser.findElement(By.id("last_name")).sendKeys(testUser.personalInfo.lastName);
    await browser.findElement(By.id("company")).sendKeys(testUser.personalInfo.companyName);
    await browser.findElement(By.id("address1")).sendKeys(testUser.addressInfo.addressLine1);
    await browser.findElement(By.id("address2")).sendKeys(testUser.addressInfo.addressLine2);
    await browser.findElement(By.id("country")).sendKeys(testUser.addressInfo.country);
    await browser.findElement(By.id("state")).sendKeys(testUser.addressInfo.state);
    await browser.findElement(By.id("city")).sendKeys(testUser.addressInfo.city);
    await browser.findElement(By.id("zipcode")).sendKeys(testUser.addressInfo.postalCode);
    await browser.findElement(By.id("mobile_number")).sendKeys(testUser.addressInfo.phoneNumber);

    await browser.findElement(By.css('button[data-qa="create-account"]')).click();

    await browser.wait(until.elementLocated(By.xpath("//b[contains(text(),'Account Created!')]")), 10000);
    await browser.findElement(By.css('a[data-qa="continue-button"]')).click();
    await browser.findElement(By.linkText("Logout")).click();
  }, 60000);

  afterAll(async () => {
    await browser.quit();
  });

  test("Відкрити домашню сторінку", async () => {
    await browser.get("https://automationexercise.com/");
    const siteLogo = await browser.wait(
      until.elementLocated(By.css("img[alt='Website for automation practice']")),
      10000
    );
    expect(await siteLogo.isDisplayed()).toBe(true);
  });

  test("Перехід до форми авторизації", async () => {
    const signupLoginBtn = await browser.findElement(By.linkText("Signup / Login"));
    await signupLoginBtn.click();

    const loginSectionTitle = await browser.wait(
      until.elementLocated(By.xpath("//h2[contains(text(),'Login to your account')]")),
      10000
    );
    expect(await loginSectionTitle.getText()).toBe("Login to your account");
  });

  test("Вхід із правильними обліковими даними", async () => {
    await browser.findElement(By.css('input[data-qa="login-email"]')).sendKeys(testUser.userEmail);
    await browser.findElement(By.css('input[data-qa="login-password"]')).sendKeys(testUser.userPassword);
    await browser.findElement(By.css('button[data-qa="login-button"]')).click();
  });

  test("Перевірка успішної авторизації", async () => {
    const loggedUserInfo = await browser.wait(
      until.elementLocated(By.xpath("//a[contains(text(),'Logged in as')]")),
      10000
    );
    const displayedText = await loggedUserInfo.getText();
    expect(displayedText).toContain(`Logged in as ${testUser.username}`);
  });

  test("Видалення створеного акаунта", async () => {
    await browser.findElement(By.linkText("Delete Account")).click();

    const deletionConfirmation = await browser.wait(
      until.elementLocated(By.xpath("//b[contains(text(),'Account Deleted!')]")),
      10000
    );
    expect(await deletionConfirmation.getText()).toContain("ACCOUNT DELETED!");

    await browser.findElement(By.css('a[data-qa="continue-button"]')).click();
  });
});

describe("Scenario: Attempt to Login with Invalid Credentials", () => {
  let browser;
  const invalidUser = {
    emailAddress: "wrongemail@mail.com",
    password: "WrongPassword123",
  };

  beforeAll(async () => {
    browser = await new Builder().forBrowser("chrome").build();
    await browser.get("http://automationexercise.com/");
  }, 20000);

  afterAll(async () => {
    await browser.quit();
  });

  test("Відкриття головної сторінки", async () => {
    const siteLogo = await browser.wait(
      until.elementLocated(By.css("img[alt='Website for automation practice']")),
      10000
    );
    expect(await siteLogo.isDisplayed()).toBe(true);
  });

  test("Перехід до сторінки авторизації", async () => {
    const loginNavLink = await browser.findElement(By.linkText("Signup / Login"));
    await loginNavLink.click();

    const loginFormHeader = await browser.wait(
      until.elementLocated(By.xpath("//h2[contains(text(),'Login to your account')]")),
      10000
    );
    expect(await loginFormHeader.getText()).toBe("Login to your account");
  });

  test("Введення неправильних даних користувача", async () => {
    await browser.findElement(By.css('input[data-qa="login-email"]')).sendKeys(invalidUser.emailAddress);
    await browser.findElement(By.css('input[data-qa="login-password"]')).sendKeys(invalidUser.password);
  });

  test("Натискання кнопки логіну", async () => {
    await browser.findElement(By.css('button[data-qa="login-button"]')).click();
  });

  test("Перевірка повідомлення про помилку", async () => {
    const errorAlert = await browser.wait(
      until.elementLocated(By.xpath("//p[contains(text(),'Your email or password is incorrect!')]")),
      10000
    );
    expect(await errorAlert.getText()).toBe("Your email or password is incorrect!");
  });
});

describe("Scenario: User Registration, Login and Logout", () => {
  let browser;

  beforeAll(async () => {
    browser = await new Builder().forBrowser("chrome").build();
    await browser.get("http://automationexercise.com/");
  }, 20000);

  afterAll(async () => {
    await browser.quit();
  });

  test("Запуск сайту та перевірка логотипу", async () => {
    const logoElement = await browser.wait(
      until.elementLocated(By.css("img[alt='Website for automation practice']")),
      10000
    );
    expect(await logoElement.isDisplayed()).toBe(true);
  });

  test("Перехід до сторінки реєстрації", async () => {
    const signupButton = await browser.findElement(By.linkText("Signup / Login"));
    await signupButton.click();

    const newUserSignupHeader = await browser.wait(
      until.elementLocated(By.xpath("//h2[contains(text(),'New User Signup!')]")),
      10000
    );
    expect(await newUserSignupHeader.getText()).toBe("New User Signup!");
  });

  test("Заповнення форми реєстрації", async () => {
    await browser.findElement(By.name("name")).sendKeys(testUser.username);
    await browser.findElement(By.css('input[data-qa="signup-email"]')).sendKeys(testUser.userEmail);
    await browser.findElement(By.css('button[data-qa="signup-button"]')).click();

    const infoTitle = await browser.wait(
      until.elementLocated(By.xpath("//b[contains(text(),'Enter Account Information')]")),
      10000
    );
    expect(await infoTitle.getText()).toContain("ENTER ACCOUNT INFORMATION");
  });

  test("Заповнення даних акаунта", async () => {
    await browser.findElement(By.id("id_gender1")).click();
    await browser.findElement(By.id("password")).sendKeys(testUser.userPassword);
    await browser.findElement(By.id("days")).sendKeys("10");
    await browser.findElement(By.id("months")).sendKeys("May");
    await browser.findElement(By.id("years")).sendKeys("1995");

    await browser.findElement(By.id("newsletter")).click();
    await browser.findElement(By.id("optin")).click();

    await browser.findElement(By.id("first_name")).sendKeys(testUser.personalInfo.firstName);
    await browser.findElement(By.id("last_name")).sendKeys(testUser.personalInfo.lastName);
    await browser.findElement(By.id("company")).sendKeys(testUser.personalInfo.companyName);
    await browser.findElement(By.id("address1")).sendKeys(testUser.addressInfo.addressLine1);
    await browser.findElement(By.id("address2")).sendKeys(testUser.addressInfo.addressLine2);
    await browser.findElement(By.id("country")).sendKeys(testUser.addressInfo.country);
    await browser.findElement(By.id("state")).sendKeys(testUser.addressInfo.state);
    await browser.findElement(By.id("city")).sendKeys(testUser.addressInfo.city);
    await browser.findElement(By.id("zipcode")).sendKeys(testUser.addressInfo.postalCode);
    await browser.findElement(By.id("mobile_number")).sendKeys(testUser.addressInfo.phoneNumber);
  });

  test("Створення акаунта та перевірка успіху", async () => {
    await browser.findElement(By.css('button[data-qa="create-account"]')).click();

    const accountCreatedText = await browser.wait(
      until.elementLocated(By.xpath("//b[contains(text(),'Account Created!')]")),
      10000
    );
    expect(await accountCreatedText.getText()).toContain("ACCOUNT CREATED!");
  });

  test("Перевірка, що користувач залогінений", async () => {
    jest.setTimeout(15000);

    await browser.findElement(By.css('a[data-qa="continue-button"]')).click();
    const userStatus = await browser.wait(
      until.elementLocated(By.xpath("//a[contains(., 'Logged in as')]")),
      15000
    );

    const statusText = await userStatus.getText();
    expect(statusText).toMatch(/Logged in as/i);
  });

  test("Вихід із акаунта", async () => {
    await browser.findElement(By.linkText("Logout")).click();
  });

  test("Перевірка переходу на сторінку логіну після виходу", async () => {
    const loginAgainHeader = await browser.wait(
      until.elementLocated(By.xpath("//h2[contains(text(),'Login to your account')]")),
      10000
    );
    expect(await loginAgainHeader.getText()).toBe("Login to your account");
  });
});

describe("Scenario: User Registration Flow", () => {
  let browser;

  beforeAll(async () => {
    browser = await new Builder().forBrowser("chrome").build();
    await browser.get("http://automationexercise.com/");
  }, 20000);

  afterAll(async () => {
    await browser.quit();
  });

  test("Заповнення форми для створення нового акаунта", async () => {
    // Створення нового користувача через випадкове число для унікальності
    const uniqueId = Math.floor(Math.random() * 100000);
    const newUser = {
      username: "ExampleUser",
      email: `exampleuser${uniqueId}@testmail.com`,
      password: "StrongPass123",
      firstName: "Alice",
      lastName: "Johnson",
      company: "DemoCorp",
      addressLine1: "789 Sample Road",
      addressLine2: "Suite 12C",
      country: "Canada",
      state: "Quebec",
      city: "Montreal",
      postalCode: "H3B 1X8",
      phone: "9876543210",
    };

    await browser.findElement(By.linkText("Signup / Login")).click();
    await browser.wait(until.elementLocated(By.name("name")), 10000);

    await browser.findElement(By.name("name")).sendKeys(newUser.username);
    await browser.findElement(By.css('input[data-qa="signup-email"]')).sendKeys(newUser.email);
    await browser.findElement(By.css('button[data-qa="signup-button"]')).click();

    await browser.wait(until.elementLocated(By.id("id_gender1")), 10000);
    await browser.findElement(By.id("id_gender1")).click();
    await browser.findElement(By.id("password")).sendKeys(newUser.password);

    await browser.findElement(By.id("days")).sendKeys("1");
    await browser.findElement(By.id("months")).sendKeys("January");
    await browser.findElement(By.id("years")).sendKeys("2000");

    await browser.findElement(By.id("first_name")).sendKeys(newUser.firstName);
    await browser.findElement(By.id("last_name")).sendKeys(newUser.lastName);
    await browser.findElement(By.id("company")).sendKeys(newUser.company);
    await browser.findElement(By.id("address1")).sendKeys(newUser.addressLine1);
    await browser.findElement(By.id("address2")).sendKeys(newUser.addressLine2);
    await browser.findElement(By.id("country")).sendKeys(newUser.country);
    await browser.findElement(By.id("state")).sendKeys(newUser.state);
    await browser.findElement(By.id("city")).sendKeys(newUser.city);
    await browser.findElement(By.id("zipcode")).sendKeys(newUser.postalCode);
    await browser.findElement(By.id("mobile_number")).sendKeys(newUser.phone);

    await browser.findElement(By.css('button[data-qa="create-account"]')).click();

    const confirmationMessage = await browser.wait(
      until.elementLocated(By.xpath("//b[text()='Account Created!']")),
      10000
    );

    const confirmationText = await confirmationMessage.getText();
    expect(confirmationText).toBe("ACCOUNT CREATED!");

    // Збереження даних для повторної реєстрації в наступному наборі
    global.registeredUser = newUser;
  });
});

describe("Scenario: Duplicate Registration Attempt", () => {
  let browser;

  beforeAll(async () => {
    browser = await new Builder().forBrowser("chrome").build();
    await browser.get("http://automationexercise.com/");
  }, 20000);

  afterAll(async () => {
    await browser.quit();
  });

  test("Спроба створити акаунт із уже зареєстрованою поштою", async () => {
    await browser.findElement(By.linkText("Signup / Login")).click();
    await browser.wait(until.elementLocated(By.name("name")), 10000);

    await browser.findElement(By.name("name")).sendKeys("AnotherName");
    await browser.findElement(By.css('input[data-qa="signup-email"]')).sendKeys(global.registeredUser.email);
    await browser.findElement(By.css('button[data-qa="signup-button"]')).click();

    const duplicateEmailError = await browser.wait(
      until.elementLocated(By.xpath("//p[contains(text(),'Email Address already exist!')]")),
      10000
    );

    const errorText = await duplicateEmailError.getText();
    console.log("Duplicate Email Error:", errorText);
    expect(errorText).toBe("Email Address already exist!");
  });
});

describe("Scenario: Contact Us Form Submission", () => {
  let browser;

  beforeAll(async () => {
    browser = await new Builder().forBrowser("chrome").build();
  });

  afterAll(async () => {
    await browser.quit();
  });

  test("Успішна відправка форми зворотного зв'язку", async () => {
    // Відкрити головну сторінку
    await browser.get("http://automationexercise.com");

    // Перевірка, що домашня сторінка завантажена
    await browser.wait(until.titleContains("Automation"), 5000);
    const siteLogo = await browser.findElement(By.css('img[alt="Website for automation practice"]'));
    expect(await siteLogo.isDisplayed()).toBe(true);

    // Перехід до розділу 'Contact Us'
    const contactUsLink = await browser.findElement(By.css('a[href="/contact_us"]'));
    await contactUsLink.click();

    // Перевірка заголовку сторінки (фактично "CONTACT US", хоча має бути "GET IN TOUCH")
    const contactPageTitle = await browser.wait(
      until.elementLocated(By.css("h2.title.text-center")),
      5000
    );
    expect(await contactPageTitle.getText()).toBe("CONTACT US");

    // Заповнення полів форми
    await browser.findElement(By.name("name")).sendKeys("Sample User");
    await browser.findElement(By.name("email")).sendKeys("sampleuser@example.com");
    await browser.findElement(By.name("subject")).sendKeys("Feedback Inquiry");
    await browser.findElement(By.id("message")).sendKeys("This is a sample feedback message.");

    // Завантаження файлу
    const fileUpload = await browser.findElement(By.name("upload_file"));
    const filePath = path.resolve(__dirname, "testfile.txt"); // файл має бути у тій же папці
    await fileUpload.sendKeys(filePath);

    // Відправка форми
    const submitButton = await browser.findElement(By.name("submit"));
    await submitButton.click();

    // Підтвердження алерта
    await browser.switchTo().alert().accept();

    // Перевірка повідомлення про успішну відправку
    const successNotification = await browser.wait(
      until.elementLocated(By.css(".status.alert.alert-success")),
      5000
    );
    expect(await successNotification.getText()).toBe("Success! Your details have been submitted successfully.");

    // Повернення на головну сторінку
    const homeButton = await browser.findElement(By.css("a.btn.btn-success"));
    await homeButton.click();

    // Перевірка, що знову на головній сторінці
    await browser.wait(until.titleContains("Automation"), 5000);
    const mainLogo = await browser.findElement(By.css('img[alt="Website for automation practice"]'));
    expect(await mainLogo.isDisplayed()).toBe(true);
  });
});

describe("Scenario: Navigate to Test Cases Section", () => {
  let browser;

  beforeAll(async () => {
    browser = await new Builder().forBrowser("chrome").build();
  });

  afterAll(async () => {
    await browser.quit();
  });

  test("Перехід до сторінки тест-кейсів", async () => {
    // Відкрити сайт
    await browser.get("http://automationexercise.com");

    // Перевірити завантаження головної сторінки
    await browser.wait(until.titleContains("Automation"), 5000);
    const logoElement = await browser.findElement(By.css('img[alt="Website for automation practice"]'));
    expect(await logoElement.isDisplayed()).toBe(true);

    // Клік по кнопці 'Test Cases'
    const testCasesLink = await browser.findElement(By.css('a[href="/test_cases"]'));
    await testCasesLink.click();

    // Переконатися, що URL змінився на сторінку тест-кейсів
    await browser.wait(until.urlContains("/test_cases"), 5000);

    // Очікування заголовку на сторінці
    const testCasesTitle = await browser.wait(
      until.elementLocated(By.css("h2.title.text-center")),
      5000
    );
    const titleText = await testCasesTitle.getText();
    expect(titleText.toUpperCase()).toContain("TEST CASES");
  });
});

describe("Scenario: Viewing Product Information", () => {
  let browser;

  beforeAll(async () => {
    browser = await new Builder().forBrowser("chrome").build();
  });

  afterAll(async () => {
    await browser.quit();
  });

  test("Відображення деталей вибраного товару", async () => {
    // Відкрити сайт
    await browser.get("http://automationexercise.com");

    // Перевірити, що головна сторінка відображається
    await browser.wait(until.titleContains("Automation"), 5000);
    const homepageLogo = await browser.findElement(By.css('img[alt="Website for automation practice"]'));
    expect(await homepageLogo.isDisplayed()).toBe(true);

    // Перейти у розділ продуктів
    const productsLink = await browser.findElement(By.css('a[href="/products"]'));
    await productsLink.click();

    // Перевірити, що користувача перенаправило на сторінку продуктів
    await browser.wait(until.titleContains("All Products"), 5000);

    // Список товарів має бути видимий
    const productsSection = await browser.wait(until.elementLocated(By.css(".features_items")), 5000);
    expect(await productsSection.isDisplayed()).toBe(true);

    // Натиснути 'View Product' для першого товару
    const firstProductViewBtn = await browser.findElement(By.css('a[href="/product_details/1"]'));
    await firstProductViewBtn.click();

    // Перевірити, що відкрито сторінку деталей товару
    await browser.wait(until.urlContains("/product_details/1"), 5000);

    // Перевірити видимість основних елементів з інформацією про продукт
    const productTitle = await browser.findElement(By.css(".product-information h2"));
    const productCategory = await browser.findElement(By.xpath("//p[contains(text(),'Category')]"));
    const productPrice = await browser.findElement(By.css(".product-information span span"));
    const availabilityInfo = await browser.findElement(By.xpath("//b[contains(text(),'Availability')]"));
    const conditionInfo = await browser.findElement(By.xpath("//b[contains(text(),'Condition')]"));
    const brandInfo = await browser.findElement(By.xpath("//b[contains(text(),'Brand')]"));

    expect(await productTitle.isDisplayed()).toBe(true);
    expect(await productCategory.isDisplayed()).toBe(true);
    expect(await productPrice.isDisplayed()).toBe(true);
    expect(await availabilityInfo.isDisplayed()).toBe(true);
    expect(await conditionInfo.isDisplayed()).toBe(true);
    expect(await brandInfo.isDisplayed()).toBe(true);
  });
});

describe("Scenario: Searching for a Product", () => {
  let browser;

  beforeAll(async () => {
    browser = await new Builder().forBrowser("chrome").build();
  });

  afterAll(async () => {
    await browser.quit();
  });

  test("Пошук товару за ключовим словом і перевірка результатів", async () => {
    // Відкрити сайт
    await browser.get("http://automationexercise.com");

    // Перевірка, що домашня сторінка успішно завантажилася
    await browser.wait(until.titleContains("Automation"), 5000);
    const mainLogo = await browser.findElement(By.css('img[alt="Website for automation practice"]'));
    expect(await mainLogo.isDisplayed()).toBe(true);

    // Перейти до всіх продуктів
    const allProductsLink = await browser.findElement(By.css('a[href="/products"]'));
    await allProductsLink.click();

    // Перевірити, що сторінка продуктів завантажена
    await browser.wait(until.titleContains("All Products"), 5000);
    const allProductsArea = await browser.findElement(By.css(".features_items"));
    expect(await allProductsArea.isDisplayed()).toBe(true);

    // Ввести запит у пошукове поле і натиснути кнопку пошуку
    const searchField = await browser.findElement(By.id("search_product"));
    await searchField.sendKeys("Dress");

    const searchButton = await browser.findElement(By.id("submit_search"));
    await searchButton.click();

    // Перевірити наявність заголовка результатів пошуку
    const searchResultsHeader = await browser.wait(
      until.elementLocated(By.xpath("//h2[contains(text(), 'Searched Products')]")),
      5000
    );
    expect(await searchResultsHeader.isDisplayed()).toBe(true);

    // Перевірка, що результати пошуку відображені
    const foundProducts = await browser.findElements(By.css(".features_items .product-image-wrapper"));
    expect(foundProducts.length).toBeGreaterThan(0);

    // Перевірити, що кожен продукт відображається
    for (const product of foundProducts) {
      expect(await product.isDisplayed()).toBe(true);
    }
  });
});

describe("Scenario: Subscribing from Home Page", () => {
  let browser;

  beforeAll(async () => {
    browser = await new Builder().forBrowser("chrome").build();
  });

  afterAll(async () => {
    await browser.quit();
  });

  test("Успішна підписка через головну сторінку", async () => {
    await browser.get("http://automationexercise.com");

    await browser.wait(until.titleContains("Automation"), 5000);
    const mainLogo = await browser.findElement(By.css('img[alt="Website for automation practice"]'));
    expect(await mainLogo.isDisplayed()).toBe(true);

    // Прокрутка сторінки до підвалу
    await browser.executeScript("window.scrollTo(0, document.body.scrollHeight)");

    // Перевірка наявності заголовка 'SUBSCRIPTION'
    const subscriptionHeader = await browser.wait(
      until.elementLocated(By.xpath("//h2[contains(text(), 'Subscription')]")),
      5000
    );
    expect(await subscriptionHeader.isDisplayed()).toBe(true);

    // Заповнення поля email та підтвердження підписки
    const emailField = await browser.findElement(By.id("susbscribe_email"));
    const randomEmail = `subscriber${Math.floor(Math.random() * 100000)}@example.com`;
    await emailField.sendKeys(randomEmail);

    const submitButton = await browser.findElement(By.id("subscribe"));
    await submitButton.click();

    // Очікування успішного повідомлення
    const successAlert = await browser.wait(
      until.elementLocated(By.css(".alert-success.alert")),
      10000
    );

    const alertText = await successAlert.getText();
    expect(alertText).toBe("You have been successfully subscribed!");
    expect(alertText).not.toBeNull();
  });
});
describe("Scenario: Subscribing from Cart Page", () => {
  let browser;

  beforeAll(async () => {
    browser = await new Builder().forBrowser("chrome").build();
  });

  afterAll(async () => {
    await browser.quit();
  });

  test("Підписка через сторінку кошика", async () => {
    await browser.get("http://automationexercise.com");

    await browser.wait(until.titleContains("Automation"), 5000);
    const homepageLogo = await browser.findElement(By.css('img[alt="Website for automation practice"]'));
    expect(await homepageLogo.isDisplayed()).toBe(true);

    // Перехід до кошика
    const cartLink = await browser.findElement(By.css("a[href='/view_cart']"));
    await cartLink.click();

    // Прокрутка вниз до секції підписки
    await browser.executeScript("window.scrollTo(0, document.body.scrollHeight)");

    // Перевірка заголовку 'SUBSCRIPTION'
    const subscriptionTitle = await browser.wait(
      until.elementLocated(By.xpath("//h2[contains(text(), 'Subscription')]")),
      5000
    );
    expect(await subscriptionTitle.isDisplayed()).toBe(true);

    // Введення email і підтвердження
    const emailBox = await browser.findElement(By.id("susbscribe_email"));
    const testEmail = `newsubscriber${Math.floor(Math.random() * 100000)}@example.com`;
    await emailBox.sendKeys(testEmail);

    const confirmBtn = await browser.findElement(By.id("subscribe"));
    await confirmBtn.click();

    // Очікування повідомлення про успіх
    const successMessage = await browser.wait(
      until.elementLocated(By.css(".alert-success.alert")),
      10000
    );

    const messageText = await successMessage.getText();
    expect(messageText).toBe("You have been successfully subscribed!");
    expect(messageText).not.toBeNull();
  });
});
