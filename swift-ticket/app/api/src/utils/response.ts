import { Response } from 'express';

export const successResponse = (
  res: Response,
  data: unknown,
  message = 'Success',
  statusCode = 200
) => {
  return res.status(statusCode).json({
    status: true,
    code: statusCode,
    message,
    data,
  });
};

export const errorResponse = (
  res: Response,
  message = 'Something went wrong',
  statusCode = 500,
  errors?: unknown
) => {
  return res.status(statusCode).json({
    status: false,
    code: statusCode,
    message,
    ...(errors ? { errors } : {}),
  });
};

export const paginateResponse = (
  res: Response,
  data: unknown,
  pagination: object,
  message = 'Success'
) => {
  return res.status(200).json({
    status: true,
    code: 200,
    message,
    data,
    pagination,
  });
};
