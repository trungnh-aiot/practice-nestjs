import { LoggerService } from '../logger/logger.service'; // your custom logger
import { omit } from '../utils/omit';

let globalLogger: LoggerService | null = null;

/**
 * Set the logger instance once (usually from main.ts or AppModule)
 */
export function setGlobalLogger(logger: LoggerService) {
  if (!globalLogger) {
    globalLogger = logger;
  }
}

function isSafeToLog(arg: unknown): boolean {
  if (!arg || typeof arg !== 'object') return false;
  if (arg instanceof Buffer) return false;
  if (Array.isArray(arg)) return arg.every(isSafeToLog);
  const unsafeKeys = ['pipe', 'stream', 'mimetype', 'originalname', 'headers'];
  return !unsafeKeys.some((key) => key in (arg as any));
}

export function LogMethod(contextName?: string): MethodDecorator {
  return <T>(
    target: object,
    propertyKey: string | symbol,
    descriptor: TypedPropertyDescriptor<T>,
  ): TypedPropertyDescriptor<T> | void => {
    const originalMethod = descriptor.value;

    if (typeof originalMethod !== 'function') {
      throw new Error('@LogMethod can only be applied to methods');
    }

    const wrappedMethod = function (this: unknown, ...args: unknown[]) {
      const className = (target as any)?.constructor?.name ?? 'UnknownClass';
      const methodName = String(propertyKey);
      const context = contextName || `${className}.${methodName}`;
      const start = Date.now();
      console.log('dsads');
      // Log args safely
      try {
        const safeArgs = args.map((arg) => {
          if (isSafeToLog(arg)) {
            return omit(arg as Record<string, unknown>, [
              'password',
              'passwordConfirmation',
              'token',
            ]);
          }
          return '[Non-loggable param]';
        });
        globalLogger?.log(
          `[START] ${context} args: ${JSON.stringify(safeArgs)}`,
          context,
        );
      } catch (err) {
        globalLogger?.warn(`[WARN] Failed to log args for ${context}`, context);
      }

      try {
        const result = originalMethod.apply(this, args);

        if (result instanceof Promise) {
          return result
            .then((res) => {
              globalLogger?.log(
                `[SUCCESS] ${context} completed in ${Date.now() - start}ms`,
                context,
              );
              return res;
            })
            .catch((err: unknown) => {
              globalLogger?.error(
                `[ERROR] ${context} failed in ${Date.now() - start}ms`,
                err instanceof Error ? err.stack : String(err),
                context,
              );
              throw err;
            });
        } else {
          globalLogger?.log(
            `[SUCCESS] ${context} completed in ${Date.now() - start}ms`,
            context,
          );
          return result;
        }
      } catch (err: unknown) {
        globalLogger?.error(
          `[ERROR] ${context} failed in ${Date.now() - start}ms`,
          err instanceof Error ? err.stack : String(err),
          context,
        );
        throw err;
      }
    };

    descriptor.value = wrappedMethod as T;
    console.log('dsasdas');
    return descriptor;
  };
}
