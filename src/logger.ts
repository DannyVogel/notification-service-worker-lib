interface LogEntry {
  message: string;
  metadata: Record<string, any>;
}

export function useLogger() {
  function logToConsole(level: string, logEntry: LogEntry) {
    const now = new Date().toLocaleString();
    const logMessage = `webpushkit log: [${now}] ${logEntry.message}`;
    if (level === "error") console.error(logMessage, logEntry.metadata);
    else console.log(logMessage, logEntry.metadata);
  }

  return {
    log(logEntry: LogEntry) {
      logToConsole("log", logEntry);
    },
    error(logEntry: LogEntry) {
      logToConsole("error", logEntry);
    },
  };
}
