const fs = require("fs");
const path = require("path");

const LOG_DIR = path.join(__dirname, "logs");
const LOG_FILE = path.join(
  LOG_DIR,
  `register-${new Date().toISOString().slice(0, 10)}.txt`,
);
const JWT_LOG_FILE = path.join(
  LOG_DIR,
  `jwt-${new Date().toISOString().slice(0, 10)}.txt`,
);

if (!fs.existsSync(LOG_DIR)) {
  fs.mkdirSync(LOG_DIR);
}

const originalLog = console.log;
const originalError = console.error;
const FAIL_LOG_FILE_EVERY = 20;
let failLogCount = 0;

function timestamp() {
  return new Date().toISOString().replace("T", " ").slice(0, 19);
}

function formatLogValue(value) {
  if (value instanceof Error) {
    return value.stack ?? value.message;
  }

  if (typeof value === "string") {
    return value;
  }

  return JSON.stringify(value, null, 2);
}

function writeLog(level, args) {
  const message = args.map(formatLogValue).join(" ");
  const line = `[${timestamp()}] [${level}] ${message}`;

  if (message.includes("[FAIL]")) {
    failLogCount++;

    if (failLogCount % FAIL_LOG_FILE_EVERY !== 0) {
      return line;
    }
  }

  fs.appendFileSync(LOG_FILE, line + "\n", "utf8");

  return line;
}

function writeJwtLog(name, account, token) {
  const line = `[${timestamp()}] [${name}] username=${account.username} expire=${account.tokenExpire ?? ""} token=${token}`;

  fs.appendFileSync(JWT_LOG_FILE, line + "\n", "utf8");
}

console.log = (...args) => {
  originalLog(writeLog("INFO", args));
};

console.error = (...args) => {
  originalError(writeLog("ERROR", args));
};

let turnid;

const BASE_URL = "https://dkhpapi.hnue.edu.vn";

const account_TrangDoan = {
  username: "755601384",
  password: "Doanthutrang@706091@",
  jwtToken: "",
  StudyProgramID: "DHCQK75601",
};

//ultraview
const account_NganKim = {
  username: "755904129",
  password: "Ngan2010@",
  jwtToken: "",
  StudyProgramID: "DHCQK75904",
};

//ultraview
const account_ThanhThu = {
  username: "755101248",
  password: "097853472128022007",
  jwtToken: "",
  StudyProgramID: "DHCQK75101",
};

// ======================================================
// CONFIG
// ======================================================

const turnIdRequest = {
  name: "TurnID Fetcher",
  account: account_TrangDoan,
  StudyProgramID: account_TrangDoan.StudyProgramID,
};

const MAX_ATTEMPTS = 999999;
const RETRY_DELAY = 500;
const REQUEST_TIMEOUT = 15000;

// ======================================================
// REQUEST DATA
// ======================================================

const requests = [
  {
    name: "TrangDoan",
    account: account_TrangDoan,
    StudyProgramID: account_TrangDoan.StudyProgramID,
    body: [
      {
        ScheduleStudyUnitAlias: "",
        StudyUnitID: "2611_COMM001",
        CurriculumID: "2611_COMM001_02",
        CurriculumName: "",
      },
      {
        ScheduleStudyUnitAlias: "",
        StudyUnitID: "2611_COMM001",
        CurriculumID: "2611_COMM001_0201",
        CurriculumName: "",
      },
      {
        ScheduleStudyUnitAlias: "",
        StudyUnitID: "2611_COMM001",
        CurriculumID: "2611_COMM001_0202",
        CurriculumName: "",
      },
    ],
  },

  {
    name: "TrangDoan",
    account: account_TrangDoan,
    StudyProgramID: account_TrangDoan.StudyProgramID,
    body: {
      ScheduleStudyUnitAlias: "",
      StudyUnitID: "2611_POLI204",
      CurriculumID: "2611_POLI204_12",
      CurriculumName: "",
    },
  },

  {
    name: "KimNgan",
    account: account_NganKim,
    StudyProgramID: account_NganKim.StudyProgramID,
    body: {
      ScheduleStudyUnitAlias: "",
      StudyUnitID: "2611_COMM005",
      CurriculumID: "2611_COMM005_05",
      CurriculumName: "",
    },
  },

  {
    name: "KimNgan",
    account: account_NganKim,
    StudyProgramID: account_NganKim.StudyProgramID,
    body: {
      ScheduleStudyUnitAlias: "",
      StudyUnitID: "2611_POLI202",
      CurriculumID: "2611_POLI202_01",
      CurriculumName: "",
    },
  },

  {
    name: "ThanhThu",
    account: account_ThanhThu,
    StudyProgramID: account_ThanhThu.StudyProgramID,
    body: {
      ScheduleStudyUnitAlias: "",
      StudyUnitID: "2611_POLI202",
      CurriculumID: "2611_POLI202_01",
      CurriculumName: "",
    },
  },

  {
    name: "ThanhThu",
    account: account_ThanhThu,
    StudyProgramID: account_ThanhThu.StudyProgramID,
    body: {
      ScheduleStudyUnitAlias: "",
      StudyUnitID: "2611_POLI204",
      CurriculumID: "2611_POLI204_09",
      CurriculumName: "",
    },
  },

  {
    name: "ThanhThu",
    account: account_ThanhThu,
    StudyProgramID: account_ThanhThu.StudyProgramID,
    body: {
      ScheduleStudyUnitAlias: "",
      StudyUnitID: "2611_COMM005",
      CurriculumID: "2611_COMM005_05",
      CurriculumName: "",
    },
  },

  {
    name: "ThanhThu",
    account: account_ThanhThu,
    StudyProgramID: account_ThanhThu.StudyProgramID,
    body: {
      ScheduleStudyUnitAlias: "",
      StudyUnitID: "2611_MATH221T",
      CurriculumID: "2611_MATH221T_03",
      CurriculumName: "",
    },
  },

  {
    name: "ThanhThu",
    account: account_ThanhThu,
    StudyProgramID: account_ThanhThu.StudyProgramID,
    body: {
      ScheduleStudyUnitAlias: "",
      StudyUnitID: "2611_MATH231T",
      CurriculumID: "2611_MATH231T_03",
      CurriculumName: "",
    },
  },

  {
    name: "ThanhThu",
    account: account_ThanhThu,
    StudyProgramID: account_ThanhThu.StudyProgramID,
    body: {
      ScheduleStudyUnitAlias: "",
      StudyUnitID: "2611_MATH211T",
      CurriculumID: "2611_MATH211T_04",
      CurriculumName: "",
    },
  },

  {
    name: "ThanhThu",
    account: account_ThanhThu,
    StudyProgramID: account_ThanhThu.StudyProgramID,
    body: {
      ScheduleStudyUnitAlias: "",
      StudyUnitID: "2611_COMM004",
      CurriculumID: "2611_COMM004_06",
      CurriculumName: "",
    },
  },

  {
    name: "ThanhThu",
    account: account_ThanhThu,
    StudyProgramID: account_ThanhThu.StudyProgramID,
    body: {
      ScheduleStudyUnitAlias: "",
      StudyUnitID: "2611_PHYE250TD",
      CurriculumID: "2611_PHYE250TD_02",
      CurriculumName: "",
    },
  },

  {
    name: "ThanhThu",
    account: account_ThanhThu,
    StudyProgramID: account_ThanhThu.StudyProgramID,
    body: {
      ScheduleStudyUnitAlias: "",
      StudyUnitID: "2611_PSYC102",
      CurriculumID: "2611_PSYC102_03",
      CurriculumName: "",
    },
  },
];

// ======================================================
// SLEEP
// ======================================================

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function formatMessage(message) {
  if (typeof message === "string") {
    return message;
  }

  return JSON.stringify(message);
}

function isJwtExpired(token) {
  if (!token) {
    return true;
  }

  try {
    const payload = JSON.parse(
      Buffer.from(token.split(".")[1], "base64url").toString("utf8"),
    );
    const expiresAt = payload.exp * 1000;
    const now = Date.now();

    return now >= expiresAt - 60 * 1000;
  } catch (e) {
    return true;
  }
}

async function login(account, name) {
  if (!account.username) {
    throw new Error(`[${name}] Missing username`);
  }

  if (!account.password) {
    throw new Error(`[${name}] Missing password`);
  }

  console.log(`[AUTH] [${name}] Logging in...`);

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

  try {
    const response = await fetch(`${BASE_URL}/api/Authen/Authenticate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json, text/plain, */*",
      },
      body: JSON.stringify({
        username: account.username,
        password: account.password,
      }),
      signal: controller.signal,
    });

    const responseText = await response.text();
    let responseBody = responseText;

    try {
      responseBody = JSON.parse(responseText);
    } catch (e) {
      // Keep the raw text response when the API does not return JSON.
    }

    if (!response.ok) {
      throw new Error(
        `[${name}] Login failed (${response.status}): ${formatMessage(responseBody)}`,
      );
    }

    const token = responseBody?.Token ?? responseBody?.token;

    if (!token) {
      throw new Error(`[${name}] Login response did not include Token`);
    }

    account.jwtToken = token;
    account.tokenExpire = responseBody?.Expire ?? responseBody?.expire;

    writeJwtLog(name, account, token);

    console.log(`[AUTH] [${name}] Logged in.`);

    return token;
  } finally {
    clearTimeout(timeout);
  }
}

async function getJwtToken(account, name) {
  if (!account) {
    throw new Error(`[${name}] Missing account`);
  }

  if (!isJwtExpired(account.jwtToken)) {
    return account.jwtToken;
  }

  if (!account.loginPromise) {
    account.loginPromise = login(account, name).finally(() => {
      account.loginPromise = null;
    });
  }

  return account.loginPromise;
}

async function fetchTurnId(request) {
  if (!request.account) {
    throw new Error(`[${request.name}] Missing account for TurnID fetch`);
  }

  if (!request.StudyProgramID) {
    throw new Error(
      `[${request.name}] Missing StudyProgramID for TurnID fetch`,
    );
  }

  const jwtToken = await getJwtToken(request.account, request.name);
  const url =
    `${BASE_URL}/api/Regist/GetRegistSemesterCreditQuota` +
    `?StudyProgramID=${encodeURIComponent(request.StudyProgramID)}`;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json, text/plain, */*",
        Origin: "https://tinchi.hnue.edu.vn",
        Authorization: `Bearer ${jwtToken}`,
      },
      signal: controller.signal,
    });

    const responseText = await response.text();
    let responseBody = responseText;

    try {
      responseBody = JSON.parse(responseText);
    } catch (e) {
      // Keep the raw text response when the API does not return JSON.
    }

    if (response.status === 401) {
      request.account.jwtToken = "";
      request.account.tokenExpire = "";
    }

    if (!response.ok) {
      throw new Error(
        `[${request.name}] Failed to fetch TurnID (${response.status}): ${formatMessage(responseBody)}`,
      );
    }

    return responseBody?.IdDot ?? 0;
  } finally {
    clearTimeout(timeout);
  }
}

async function waitForTurnId(request) {
  let attempt = 1;

  while (true) {
    try {
      const nextTurnId = await fetchTurnId(request);

      console.log(`[TURN] [${request.name}] Attempt ${attempt}: ${nextTurnId}`);

      if (nextTurnId !== 0) {
        return nextTurnId;
      }
    } catch (error) {
      const errorMessage =
        error?.name === "AbortError"
          ? `Request timed out after ${REQUEST_TIMEOUT}ms`
          : (error?.message ?? error);

      console.error(
        `[TURN] [${request.name}] Attempt ${attempt} ERROR:`,
        errorMessage,
      );
    }

    attempt++;
    await sleep(RETRY_DELAY);
  }
}

// ======================================================
// SEND REQUEST
// ======================================================

async function runRequestNode(request) {
  if (!request.account) {
    console.error(`[ERROR] [${request.name}] Missing account`);
    return;
  }

  if (!request.StudyProgramID) {
    console.error(`[ERROR] [${request.name}] Missing StudyProgramID`);
    return;
  }

  const url =
    `https://dkhpapi.hnue.edu.vn/api/Regist/RegistScheduleStudyUnit` +
    `?TurnID=${encodeURIComponent(turnid)}` +
    `&Action=REGIST` +
    `&StudyProgramID=${encodeURIComponent(request.StudyProgramID)}` +
    `&StudyRegistType=NKH`;

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    // console.log(`[TRY] [${request.name}] Attempt ${attempt}/${MAX_ATTEMPTS}`);

    try {
      const jwtToken = await getJwtToken(request.account, request.name);
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json, text/plain, */*",
          Origin: "https://tinchi.hnue.edu.vn",
          Authorization: `Bearer ${jwtToken}`,
        },
        body: JSON.stringify(
          Array.isArray(request.body) ? request.body : [request.body],
        ),
        signal: controller.signal,
      });

      clearTimeout(timeout);

      const responseText = await response.text();
      let responseBody = responseText;

      try {
        responseBody = JSON.parse(responseText);
      } catch (e) {
        // Keep the raw text response when the API does not return JSON.
      }

      const message =
        responseBody?.message ??
        responseBody?.Message ??
        responseBody?.msg ??
        responseBody?.Msg ??
        responseBody?.error ??
        responseBody?.Error ??
        responseBody?.description ??
        responseBody?.Description ??
        responseBody;

      if (response.status === 200) {
        console.log(
          `[OK] [${request.name}] [${request.body.CurriculumID}] SUCCESS after ${attempt} attempt(s)`,
        );

        return {
          name: request.name,
          success: true,
          attempts: attempt,
        };
      }

      if (response.status === 401) {
        request.account.jwtToken = "";
        request.account.tokenExpire = "";
      }

      console.log(
        `[FAIL] [${request.name}] [${request.body.CurriculumID}] Attempt ${attempt} FAILED (${response.status}): ${formatMessage(message)}`,
      );
    } catch (error) {
      const errorMessage =
        error?.name === "AbortError"
          ? `Request timed out after ${REQUEST_TIMEOUT}ms`
          : (error?.message ?? error);

      console.error(
        `[ERROR] [${request.name}] Attempt ${attempt} ERROR:`,
        errorMessage,
      );
    }

    if (attempt === MAX_ATTEMPTS) {
      console.log(
        `[FAIL] [${request.name}] FAILED after ${MAX_ATTEMPTS} attempts`,
      );

      return {
        name: request.name,
        success: false,
        attempts: attempt,
      };
    }

    await sleep(RETRY_DELAY);
  }
}

// ======================================================
// RUN REQUESTS CONCURRENTLY
// ======================================================

(async () => {
  console.log("========================================");
  console.log("STARTING ALL REQUESTS");
  console.log(`MAX ATTEMPTS: ${MAX_ATTEMPTS}`);
  console.log(`RETRY DELAY: ${RETRY_DELAY}ms`);
  console.log(`REQUEST TIMEOUT: ${REQUEST_TIMEOUT}ms`);
  console.log("========================================");

  turnid = await waitForTurnId(turnIdRequest);
  console.log(`TURN ID: ${turnid}`);

  const results = await Promise.all(
    requests.map((request) => runRequestNode(request)),
  );

  console.log("========================================");
  console.log("ALL REQUESTS FINISHED");
  console.log("========================================");

  results.forEach((result) => {
    if (!result) {
      return;
    }

    if (result.success) {
      console.log(
        `[OK] ${result.name} => SUCCESS after ${result.attempts} attempt(s)`,
      );
    } else {
      console.log(
        `[FAIL] ${result.name} => FAILED after ${result.attempts} attempt(s)`,
      );
    }
  });
})();
