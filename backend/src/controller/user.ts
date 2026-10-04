import { Request, Response } from "express";
import { loginUserIn, registerUserIn } from "../infrastructure/user";
import {
  ErrorResponse,
  Result,
  SuccessResponse,
  UserResponse,
} from "../models";

export const registerUserController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  console.log(req.body);

  const result: Result<SuccessResponse, ErrorResponse> = await registerUserIn(
    req.body,
  );

  if (!result.success) {
    res.status(result.error.statusCode).json({
      error: result.error.errorMessage,
    });

    return;
  }

  res.status(result.data.statusCode).json({
    message: result.data.message,
    data: result.data.data,
  });
};

export const loginUserController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  console.log(req.body);

  const result: Result<
    SuccessResponse<UserResponse>,
    ErrorResponse
  > = await loginUserIn(req.body);

  if (!result.success) {
    res.status(result.error.statusCode).json({
      success: !result.success,
      error: result.error.errorMessage,
    });

    return;
  }

  res.status(result.data.statusCode).json({
    success: result.success,
    message: result.data.message,
    data: result.data,
  });
};
