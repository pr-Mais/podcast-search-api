import { z } from "zod";

export const ErrorCodes = {
  MISSING_TERM: "MISSING_TERM",
  INTERNAL_SERVER_ERROR: "INTERNAL_SERVER_ERROR",
  INVALID_TERM: "INVALID_TERM",
} as const;

export type ErrorCode = keyof typeof ErrorCodes;

export const ErrorMessages: Record<ErrorCode, string> = {
  MISSING_TERM: "Missing term query parameter",
  INTERNAL_SERVER_ERROR: "Internal Server Error",
  INVALID_TERM: "Invalid term query parameter",
};

export const ErrorSchema = z.object({
  code: z.string().default("INTERNAL_SERVER_ERROR"),
  message: z.string().optional(),
});

export const createErrorResponse = (code: ErrorCode) => ({
  code,
  message: ErrorMessages[code],
});
