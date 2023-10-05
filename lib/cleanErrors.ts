import { ZodIssue } from "zod";

export const cleanErrors = (error: ZodIssue) => {
  switch (error.code) {
    case "invalid_type":
      return `${error.code}(s) [${error.path.join(", ")}]. expected: ${
        error.expected
      }, received: ${error.received}`;
    case "unrecognized_keys":
      return `${error.message}`;
    default:
      return `${error.code}: ${error.message} (NEW ERROR, MAY NEED MORE HANDLING)`;
    // TODO: add more error handling as they come up. See https://github.com/colinhacks/zod/blob/master/ERROR_HANDLING.md
  }
};
