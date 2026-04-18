import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';
import { ZodError } from 'zod';

interface PrismaError {
  code: string;
  meta?: { target?: string[] };
}

const handlePrismaError = (err: PrismaError): AppError => {
  if (err.code === 'P2002') {
    const field = err.meta?.target?.[0] ?? 'field';
    return new AppError(`Duplicate value: ${field} already exists.`, 409);
  }
  if (err.code === 'P2025') {
    return new AppError('Record not found.', 404);
  }
  return new AppError('Database error occurred.', 500);
};

const handleZodError = (err: ZodError): AppError => {
  const message = err.errors.map((e) => e.message).join(', ');
  return new AppError(message, 422);
};

const handleJWTError = (): AppError =>
  new AppError('Invalid token. Please log in again.', 401);

const handleJWTExpiredError = (): AppError =>
  new AppError('Your token has expired. Please log in again.', 401);

const sendError = (err: AppError, res: Response): void => {
  res.status(err.statusCode).json({
    status: false,
    code: err.statusCode,
    message: err.message,
  });
};

const globalErrorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  // Handle Zod validation errors
  if (err instanceof ZodError) {
    const appErr = handleZodError(err);
    sendError(appErr, res);
    return;
  }

  // Handle AppError (our custom operational errors)
  if (err instanceof AppError) {
    sendError(err, res);
    return;
  }

  // Handle Prisma errors
  if (
    typeof err === 'object' &&
    err !== null &&
    'code' in err &&
    typeof (err as { code: unknown }).code === 'string' &&
    (err as { code: string }).code.startsWith('P')
  ) {
    const appErr = handlePrismaError(err as PrismaError);
    sendError(appErr, res);
    return;
  }

  // Handle JWT errors
  if (err instanceof Error) {
    if (err.name === 'JsonWebTokenError') {
      sendError(handleJWTError(), res);
      return;
    }
    if (err.name === 'TokenExpiredError') {
      sendError(handleJWTExpiredError(), res);
      return;
    }

    // Generic error
    console.error('UNHANDLED ERROR:', err);
    res.status(500).json({
      status: false,
      code: 500,
      message:
        process.env.NODE_ENV === 'development'
          ? err.message
          : 'Something went wrong.',
    });
    return;
  }

  res.status(500).json({
    status: false,
    code: 500,
    message: 'Something went wrong.',
  });
};

export default globalErrorHandler;
