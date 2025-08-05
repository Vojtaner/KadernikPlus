import addUserUseCase, {
  AddUserUseCaseType,
} from "../../application/use-cases/user/add-user";
import getUserByIdUseCase, {
  GetUserByIdUseCaseType,
} from "../../application/use-cases/user/get-user-by-id";
import { UserCreateData } from "@/entities/user";
import { HasId } from "@/domain/entity";
import { ControllerFunction } from "@/adapters/express/make-express-callback";

type CreateUserControllerType = {
  addUserController: ControllerFunction<AddUserControllerType>;
  getUserByIdController: ControllerFunction<GetUserByIdControllerType>;
};

type AddUserControllerType = {
  body: UserCreateData;
};

type GetUserByIdControllerType = { params: HasId };

const createUserController = (dependencies: {
  getUserByIdUseCase: GetUserByIdUseCaseType;
  addUserUseCase: AddUserUseCaseType;
}): CreateUserControllerType => {
  const addUserController: ControllerFunction<AddUserControllerType> = async (
    httpRequest
  ) => {
    try {
      const userData = httpRequest.body;

      // Input validation (basic example - use a validation library in real app)
      if (!userData.name || !userData.email) {
        return {
          statusCode: 400,
          body: {
            error: "Missing required user fields: name, email.",
          },
        };
      }

      // Call the AddUser use case (application layer)
      const newUser = await dependencies.addUserUseCase.execute(userData);

      return {
        statusCode: 201, // 201 Created
        body: newUser,
      };
    } catch (error: any) {
      // Handle specific application-level errors
      if (error.name === "UserAlreadyExistsError") {
        return {
          statusCode: 409, // Conflict
          body: { error: error.message },
        };
      }
      // Re-throw or handle other unexpected errors
      console.error("Error in addUserController:", error);
      throw error; // Let makeExpressCallback handle the generic 500 error
    }
  };
  const getUserByIdController: ControllerFunction<
    GetUserByIdControllerType
  > = async (httpRequest) => {
    try {
      const { id } = httpRequest.params;

      if (!id) {
        return {
          statusCode: 400,
          body: { error: "Missing user ID in parameters." },
        };
      }

      const user = await dependencies.getUserByIdUseCase.execute(id);

      return {
        statusCode: 200,
        body: user,
      };
    } catch (error: any) {
      if (error.name === "UserNotFoundError") {
        return {
          statusCode: 404,
          body: { error: error.message },
        };
      }
      console.error("Error in getUserByIdController:", error);
      throw error;
    }
  };

  return { addUserController, getUserByIdController };
};

const userController = createUserController({
  getUserByIdUseCase,
  addUserUseCase,
});

export default userController;
