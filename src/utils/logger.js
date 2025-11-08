import winston from "winston";

const customLevels = {
  levels: {
    fatal: 0,
    error: 1,
    warning: 2,
    info: 3,
    http: 4,
    debug: 5,
  },
  colors: {
    fatal: "redBG white",
    error: "red",
    warning: "yellow",
    info: "blue",
    http: "green",
    debug: "gray",
  },
};

winston.addColors(customLevels.colors);

const buildLogger = (env) => {
  if (env === "production") {
    return winston.createLogger({
      levels: customLevels.levels,
      level: "info",
      transports: [
        new winston.transports.file({ filename: "errors.log", level: "error" }),
        new winston.transports.Console({ format: winston.format.simple() }),
      ],
    });
  } else {
    return winston.createLogger({
      levels: customLevels.levels,
      level: "debug",
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
      transports: [new winston.transports.Console()],
    });
  }
};

export const logger = buildLogger(process.env.NODE_ENV || "development");
