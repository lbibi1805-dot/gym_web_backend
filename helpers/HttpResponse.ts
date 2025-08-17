import { StatusCode } from '../enums/statusCode.enums';

export class HttpResponse {
  static success<T = unknown>(data: T = null as T, message: string = 'Success', statusCode: StatusCode = StatusCode.OK) {
    return {
      success: true,
      statusCode,
      message,
      data,
    };
  }

  static error<T = unknown>(message: string = 'Error', statusCode: StatusCode = StatusCode.INTERNAL_SERVER_ERROR, data: T = null as T) {
    return {
      success: false,
      statusCode,
      message,
      data,
    };
  }

  static created<T = unknown>(data: T = null as T, message: string = 'Created successfully') {
    return this.success(data, message, StatusCode.CREATED);
  }

  static badRequest<T = unknown>(message: string = 'Bad request', data: T = null as T) {
    return this.error(message, StatusCode.BAD_REQUEST, data);
  }

  static unauthorized<T = unknown>(message: string = 'Unauthorized', data: T = null as T) {
    return this.error(message, StatusCode.UNAUTHORIZED, data);
  }

  static forbidden<T = unknown>(message: string = 'Forbidden', data: T = null as T) {
    return this.error(message, StatusCode.FORBIDDEN, data);
  }

  static notFound<T = unknown>(message: string = 'Not found', data: T = null as T) {
    return this.error(message, StatusCode.NOT_FOUND, data);
  }

  static conflict<T = unknown>(message: string = 'Conflict', data: T = null as T) {
    return this.error(message, StatusCode.CONFLICT, data);
  }
}
