const readline = require("node:readline");
const fs = require("node:fs");
const path = require("node:path");

let inputBuffer = "";
let lastError = null;
const MEMORY_FILE = path.join(__dirname, "memories.json");
const ERROR_LOG_FILE = path.join(__dirname, "error_log.json");

const stateMachine = {
  states: {
    IDLE: {
      transitions: { LISTENING: "LISTENING" },
      allowedActions: ["exit", "startListening"],

      enter() {
        console.log("System is idle. Press Ctrl+S to start listening.");
      },

      exit() {},
    },

    LISTENING: {
      transitions: { IDLE: "IDLE", MEMORIZING: "MEMORIZING", ERROR: "ERROR" },
      allowedActions: ["processInput", "addNewLine", "cancelAction", "exit", "startMemorizing", "deleteChar"],

      enter() {
        console.log(
          "Listening... Type anything or Press Ctrl+X to cancel. When you finish press Ctrl+D to start memorizing."
        );
      },

      exit() {},
    },
    MEMORIZING: {
      transitions: {
        IDLE: "IDLE",
        ERROR: "ERROR",
      },
      allowedActions: ["saveMemory"],

      enter() {
        console.log("\nMemorizing input...");
        setTimeout(() => executeAction("saveMemory"), 0);
      },
    },
    ERROR: {
      transitions: {
        IDLE: "IDLE",
        MEMORIZING: "MEMORIZING",
      },
      allowedActions: ["retryMemorizing", "cancelAction"],

      enter() {
        console.log("\n⚠️  Error occurred:", lastError?.message || "Unknown error");
        console.log("Options:");
        console.log("  Ctrl+R - Retry saving");
        console.log("  Ctrl+X - Cancel and return to IDLE");
      },

      exit() {},
    },
  },
  currentState: "IDLE",
};

const actions = {
  startListening() {
    inputBuffer = "";
    transitionTo("LISTENING");
  },

  exit() {
    console.log("Exiting application.");
    process.exit(0);
  },

  cancelAction() {
    console.log("\nInterrupted: Going back to IDLE state.");
    transitionTo("IDLE");
  },

  processInput(str) {
    inputBuffer += str;
    process.stdout.write(str);
  },

  addNewLine() {
    inputBuffer += "\n";
    process.stdout.write("\n");
  },

  startMemorizing() {
    if (inputBuffer.trim().length === 0) {
      console.log("No input to memorize. Returning to IDLE state.");
      transitionTo("IDLE");
      return;
    }
    transitionTo("MEMORIZING");
  },

  saveMemory() {
    try {
      let memories = [];
      if (fs.existsSync(MEMORY_FILE)) {
        const data = fs.readFileSync(MEMORY_FILE, "utf-8");
        memories = JSON.parse(data);
      }

      const newMemory = {
        id: Date.now(),
        content: inputBuffer.trim(),
        timestamp: new Date().toISOString(),
      };

      memories.push(newMemory);
      fs.writeFileSync(MEMORY_FILE, JSON.stringify(memories, null, 2), "utf-8");
      console.log("\nInput memorized successfully!");

      transitionTo("IDLE");
    } catch (error) {
      lastError = error;
      actions.saveErrorLog(error);
      transitionTo("ERROR");
    }
  },

  deleteChar() {
    if (inputBuffer.length > 0) {
      inputBuffer = inputBuffer.slice(0, -1);
      process.stdout.write("\b \b");
    }
  },

  retryMemorizing() {
    console.log("\nRetrying...");
    transitionTo("MEMORIZING");
  },

  saveErrorLog(error) {
    try {
      let errorLogs = [];
      
      if (fs.existsSync(ERROR_LOG_FILE)) {
        const data = fs.readFileSync(ERROR_LOG_FILE, "utf-8");
        errorLogs = JSON.parse(data);
      }

      const errorEntry = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        error: error.message,
        stack: error.stack,
        attemptedContent: inputBuffer.trim(),
      };

      errorLogs.push(errorEntry);
      fs.writeFileSync(ERROR_LOG_FILE, JSON.stringify(errorLogs, null, 2), "utf-8");
      console.log("Error logged to error_log.json");
    } catch (logError) {
      console.log("Failed to save error log:", logError.message);
    }
  },
};

function main() {
  console.log("Application started.");
  activateKeyListener();
  getCurrentState().enter();
}

function getCurrentState() {
  return stateMachine.states[stateMachine.currentState];
}

function transitionTo(nextState) {
  const CURRENT_STATE = getCurrentState();
  const ALLOWED = CURRENT_STATE?.transitions[nextState];

  if (!ALLOWED) {
    console.log(
      `Transition from ${stateMachine.currentState} to ${nextState} not allowed.`
    );
    return;
  }

  CURRENT_STATE.exit?.();
  stateMachine.currentState = ALLOWED;
  stateMachine.states[stateMachine.currentState].enter?.();
}

function executeAction(actionName, ...args) {
  const CURRENT_STATE = getCurrentState();
  const ALLOWED_ACTIONS = CURRENT_STATE?.allowedActions || [];

  if (!ALLOWED_ACTIONS.includes(actionName)) {
    console.log(
      `Action "${actionName}" not allowed in state "${stateMachine.currentState}".`
    );
    return;
  }

  actions[actionName]?.(...args);
}

function activateKeyListener() {
  readline.emitKeypressEvents(process.stdin);
  if (process.stdin.isTTY) process.stdin.setRawMode(true);

  process.stdin.on("keypress", (str, key) => {
    if (key?.ctrl && key.name === "s") {
      executeAction("startListening");
      return;
    }

    if (key?.ctrl && key.name === "c") {
      executeAction("exit");
      return;
    }

    if (key?.ctrl && key.name === "x") {
      executeAction("cancelAction");
      return;
    }

    if (key?.ctrl && key.name === "d") {
      executeAction("startMemorizing");
      return;
    }

    if (key?.name === "return") {
      executeAction("addNewLine");
      return;
    }

    if (key?.name === "backspace") {
      executeAction("deleteChar");
      return;
    }

    if (key?.ctrl && key.name === "r") {
      executeAction("retryMemorizing");
      return;
    }

    if (str && !key?.ctrl && !key?.meta) {
      executeAction("processInput", str);
    }
  });
}

main();
