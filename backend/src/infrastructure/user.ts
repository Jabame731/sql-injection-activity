import { ResultSetHeader } from "mysql2";
import { connection } from "../config/mysql.db";
import {
  ErrorResponse,
  SuccessResponse,
  Result,
  RegisterUser,
  LoginUser,
  User,
  UserResponse,
} from "../models";

export const loginUserIn = async (
  data: LoginUser,
): Promise<Result<SuccessResponse<UserResponse>, ErrorResponse>> => {
  const db = connection();

  try {
    const [rows] = await db.execute(
      `SELECT * FROM users WHERE username = '${data.username}' AND password = '${data.password}'`,
    );

    const users = rows as User[];

    const user = users[0]!;

    const response: UserResponse = {
      id: user.id,
      type: user.role,
      attributes: {
        username: user.username,
        name: user.name,
        created_at: user.created_at,
      },
    };

    return {
      success: true,
      data: {
        statusCode: 200,
        message: "Login successfull",
        data: response,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: {
        statusCode: 500,
        errorMessage: error instanceof Error ? error.message : String(error),
      },
    };
  }
};

export const registerUserIn = async (
  user: RegisterUser,
): Promise<Result<SuccessResponse, ErrorResponse>> => {
  const db = connection();

  try {
    const { v4: uuidv4 } = await import("uuid");
    const newUserId = uuidv4();

    console.log(newUserId);

    const [result] = await db.execute(
      "INSERT INTO users (`id`, `username`, `name`, `password`, `role`) VALUES (?, ?, ?, ?, ?)",
      [newUserId, user.username, user.name, user.password, user.role],
    );

    const insertResult = result as ResultSetHeader;

    if (insertResult.affectedRows === 0) {
      return {
        success: false,
        error: {
          statusCode: 500,
          errorMessage: "Failed to insert user.",
        },
      };
    }

    return {
      success: true,
      data: {
        statusCode: 200,
        message: "User registered successfully.",
      },
    };
  } catch (error) {
    return {
      success: false,
      error: {
        statusCode: 500,
        errorMessage: error instanceof Error ? error.message : String(error),
      },
    };
  }
};
