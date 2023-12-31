import Koa from 'koa';
import {isEmpty} from 'ramda';
import * as yup from 'yup';

export class RequestValidationError extends Error {
  constructor(message: string, validationErrors: yup.ValidationError) {
    super(message);
    this.validationError = validationErrors;
  }

  validationError: yup.ValidationError;
}

export class ResponseValidationError extends Error {
  constructor(message: string, validationError: yup.ValidationError) {
    super(message);
    this.validationError = validationError;
  }

  validationError: yup.ValidationError;
}

type DefaultSchema = yup.AnySchema<unknown, unknown, unknown, ''>;
export interface ValidatedState extends Koa.DefaultState {
  responseValidated: boolean;
}

interface ValidatedRequest<
  TBody extends yup.Schema = DefaultSchema,
  TQuery extends yup.Schema = DefaultSchema,
> extends Koa.Request {
  body: yup.Asserts<TBody>;
  query: yup.Asserts<TQuery>;
}
export interface ValidatedContext<
  TBody extends yup.Schema = DefaultSchema,
  TQuery extends yup.Schema = DefaultSchema,
  TParams extends yup.Schema = DefaultSchema,
  TResponse extends yup.Schema = DefaultSchema,
> extends Koa.ExtendableContext {
  request: ValidatedRequest<TBody, TQuery>;
  params: yup.Asserts<TParams>;
  body: yup.Asserts<TResponse>;
}

type Validator<
  TBody extends yup.Schema,
  TQuery extends yup.Schema,
  TParams extends yup.Schema,
  TResponse extends yup.Schema,
> = {
  body: TBody;
  query: TQuery;
  params: TParams;
  response: TResponse;
};

type ValidatorOptions<
  TBody extends yup.Schema = DefaultSchema,
  TQuery extends yup.Schema = DefaultSchema,
  TParams extends yup.Schema = DefaultSchema,
  TResponse extends yup.Schema = DefaultSchema,
> = {
  [k in keyof Partial<
    Validator<TBody, TQuery, TParams, TResponse>
  >]: yup.ValidateOptions;
};

const defaultOptions: ValidatorOptions = {
  body: {
    stripUnknown: true,
  },
  query: {
    stripUnknown: true,
  },
  params: {
    stripUnknown: true,
  },
  response: {
    stripUnknown: true,
  },
};

const validation =
  <
    TBody extends yup.Schema,
    TQuery extends yup.Schema,
    TParams extends yup.Schema,
    TResponse extends yup.Schema,
  >(
    validator: Partial<Validator<TBody, TQuery, TParams, TResponse>>,
    options: ValidatorOptions = defaultOptions,
  ): Koa.Middleware<
    ValidatedState,
    ValidatedContext<TBody, TQuery, TParams, TResponse>
  > =>
  async (ctx: Koa.Context, next: Koa.Next) => {
    try {
      if (validator.body) {
        ctx.request.body = await validator.body.validate(
          ctx.request.body,
          options.body,
        );
      }

      if (validator.query) {
        const query = await validator.query.validate(
          ctx.request.query,
          options.query,
        );
        // Overwrites the query in the prototype so it's not stringified
        Object.defineProperty(ctx.request, 'query', {
          value: query,
          writable: false,
        });
      }

      if (validator.params) {
        ctx.params = await validator.params.validate(
          ctx.params,
          options.params,
        );
      }
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        throw new RequestValidationError('Request validation failed', error);
      } else {
        throw error;
      }
    }

    await next();

    try {
      if (ctx.status === 200 && !isEmpty(ctx.body) && validator.response) {
        ctx.body = await validator.response.validate(
          ctx.body,
          options.response,
        );
        ctx.state.responseValidated = true;
      }
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        throw new ResponseValidationError('Response validation failed', error);
      } else {
        throw error;
      }
    }
  };

export interface ResponseContext extends Koa.Context {
  state: ValidatedState;
}

export const assertValidatedResponse =
  () => async (ctx: ResponseContext, next: Koa.Next) => {
    await next();

    if (ctx.status === 200 && ctx.body && !isEmpty(ctx.body)) {
      if (!ctx.state.responseValidated) {
        throw new Error(
          `No schema found for the response to ${ctx.request.method} at ${ctx.request.URL}`,
        );
      }
    }
  };

export default validation;
