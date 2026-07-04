/**
 * Client
 **/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types; // general types
import $Public = runtime.Types.Public;
import $Utils = runtime.Types.Utils;
import $Extensions = runtime.Types.Extensions;
import $Result = runtime.Types.Result;

export type PrismaPromise<T> = $Public.PrismaPromise<T>;

/**
 * Model TicketMetricDaily
 *
 */
export type TicketMetricDaily = $Result.DefaultSelection<Prisma.$TicketMetricDailyPayload>;
/**
 * Model WorkspaceKpiSnapshot
 *
 */
export type WorkspaceKpiSnapshot = $Result.DefaultSelection<Prisma.$WorkspaceKpiSnapshotPayload>;

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more TicketMetricDailies
 * const ticketMetricDailies = await prisma.ticketMetricDaily.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof ClientOptions
    ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition>
      ? Prisma.GetEvents<ClientOptions['log']>
      : never
    : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] };

  /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more TicketMetricDailies
   * const ticketMetricDailies = await prisma.ticketMetricDaily.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(
    eventType: V,
    callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void,
  ): void;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

  /**
   * Add a middleware
   * @deprecated since 4.16.0. For new code, prefer client extensions instead.
   * @see https://pris.ly/d/extensions
   */
  $use(cb: Prisma.Middleware): void;

  /**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(
    query: TemplateStringsArray | Prisma.Sql,
    ...values: any[]
  ): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(
    query: TemplateStringsArray | Prisma.Sql,
    ...values: any[]
  ): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(
    arg: [...P],
    options?: { isolationLevel?: Prisma.TransactionIsolationLevel },
  ): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>;

  $transaction<R>(
    fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>,
    options?: {
      maxWait?: number;
      timeout?: number;
      isolationLevel?: Prisma.TransactionIsolationLevel;
    },
  ): $Utils.JsPromise<R>;

  $extends: $Extensions.ExtendsHook<'extends', Prisma.TypeMapCb, ExtArgs>;

  /**
   * `prisma.ticketMetricDaily`: Exposes CRUD operations for the **TicketMetricDaily** model.
   * Example usage:
   * ```ts
   * // Fetch zero or more TicketMetricDailies
   * const ticketMetricDailies = await prisma.ticketMetricDaily.findMany()
   * ```
   */
  get ticketMetricDaily(): Prisma.TicketMetricDailyDelegate<ExtArgs>;

  /**
   * `prisma.workspaceKpiSnapshot`: Exposes CRUD operations for the **WorkspaceKpiSnapshot** model.
   * Example usage:
   * ```ts
   * // Fetch zero or more WorkspaceKpiSnapshots
   * const workspaceKpiSnapshots = await prisma.workspaceKpiSnapshot.findMany()
   * ```
   */
  get workspaceKpiSnapshot(): Prisma.WorkspaceKpiSnapshotDelegate<ExtArgs>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF;

  export type PrismaPromise<T> = $Public.PrismaPromise<T>;

  /**
   * Validator
   */
  export import validator = runtime.Public.validator;

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError;
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError;
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError;
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError;
  export import PrismaClientValidationError = runtime.PrismaClientValidationError;
  export import NotFoundError = runtime.NotFoundError;

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag;
  export import empty = runtime.empty;
  export import join = runtime.join;
  export import raw = runtime.raw;
  export import Sql = runtime.Sql;

  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal;

  export type DecimalJsLike = runtime.DecimalJsLike;

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics;
  export type Metric<T> = runtime.Metric<T>;
  export type MetricHistogram = runtime.MetricHistogram;
  export type MetricHistogramBucket = runtime.MetricHistogramBucket;

  /**
   * Extensions
   */
  export import Extension = $Extensions.UserArgs;
  export import getExtensionContext = runtime.Extensions.getExtensionContext;
  export import Args = $Public.Args;
  export import Payload = $Public.Payload;
  export import Result = $Public.Result;
  export import Exact = $Public.Exact;

  /**
   * Prisma Client JS version: 5.22.0
   * Query Engine version: 605197351a3c8bdd595af2d2a9bc3025bca48ea2
   */
  export type PrismaVersion = {
    client: string;
  };

  export const prismaVersion: PrismaVersion;

  /**
   * Utility Types
   */

  export import JsonObject = runtime.JsonObject;
  export import JsonArray = runtime.JsonArray;
  export import JsonValue = runtime.JsonValue;
  export import InputJsonObject = runtime.InputJsonObject;
  export import InputJsonArray = runtime.InputJsonArray;
  export import InputJsonValue = runtime.InputJsonValue;

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
     * Type of `Prisma.DbNull`.
     *
     * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
     *
     * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
     */
    class DbNull {
      private DbNull: never;
      private constructor();
    }

    /**
     * Type of `Prisma.JsonNull`.
     *
     * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
     *
     * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
     */
    class JsonNull {
      private JsonNull: never;
      private constructor();
    }

    /**
     * Type of `Prisma.AnyNull`.
     *
     * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
     *
     * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
     */
    class AnyNull {
      private AnyNull: never;
      private constructor();
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull;

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull;

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull;

  type SelectAndInclude = {
    select: any;
    include: any;
  };

  type SelectAndOmit = {
    select: any;
    omit: any;
  };

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<
    ReturnType<T>
  >;

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
    [P in K]: T[P];
  };

  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K;
  }[keyof T];

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K;
  };

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>;

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  } & (T extends SelectAndInclude
    ? 'Please either choose `select` or `include`.'
    : T extends SelectAndOmit
      ? 'Please either choose `select` or `omit`.'
      : {});

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  } & K;

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> = T extends object
    ? U extends object
      ? (Without<T, U> & U) | (Without<U, T> & T)
      : U
    : T;

  /**
   * Is T a Record?
   */
  type IsObject<T extends any> =
    T extends Array<any>
      ? False
      : T extends Date
        ? False
        : T extends Uint8Array
          ? False
          : T extends BigInt
            ? False
            : T extends object
              ? True
              : False;

  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T;

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O>; // With K possibilities
    }[K];

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>;

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>;

  type _Either<O extends object, K extends Key, strict extends Boolean> = {
    1: EitherStrict<O, K>;
    0: EitherLoose<O, K>;
  }[strict];

  type Either<O extends object, K extends Key, strict extends Boolean = 1> = O extends unknown
    ? _Either<O, K, strict>
    : never;

  export type Union = any;

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K];
  } & {};

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (U extends unknown ? (k: U) => void : never) extends (
    k: infer I,
  ) => void
    ? I
    : never;

  export type Overwrite<O extends object, O1 extends object> = {
    [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<
    Overwrite<
      U,
      {
        [K in keyof U]-?: At<U, K>;
      }
    >
  >;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
    1: AtStrict<O, K>;
    0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function
    ? A
    : {
        [K in keyof A]: A[K];
      } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
      ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
        | ({ [P in keyof O as P extends K ? K : never]-?: O[P] } & O)
      : never
  >;

  type _Strict<U, _U = U> = U extends unknown
    ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>>
    : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False;

  // /**
  // 1
  // */
  export type True = 1;

  /**
  0
  */
  export type False = 0;

  export type Not<B extends Boolean> = {
    0: 1;
    1: 0;
  }[B];

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
      ? 1
      : 0;

  export type Has<U extends Union, U1 extends Union> = Not<Extends<Exclude<U1, U>, U1>>;

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0;
      1: 1;
    };
    1: {
      0: 1;
      1: 1;
    };
  }[B1][B2];

  export type Keys<U extends Union> = U extends unknown ? keyof U : never;

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;

  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object
    ? {
        [P in keyof T]: P extends keyof O ? O[P] : never;
      }
    : never;

  type FieldPaths<T, U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>> =
    IsObject<T> extends True ? U : T;

  type GetHavingFields<T> = {
    [K in keyof T]: Or<Or<Extends<'OR', K>, Extends<'AND', K>>, Extends<'NOT', K>> extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
        ? never
        : K;
  }[keyof T];

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never;
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>;
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T;

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<
    T,
    MaybeTupleToUnion<K>
  >;

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T;

  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>;

  type FieldRefInputType<Model, FieldType> = Model extends never
    ? never
    : FieldRef<Model, FieldType>;

  export const ModelName: {
    TicketMetricDaily: 'TicketMetricDaily';
    WorkspaceKpiSnapshot: 'WorkspaceKpiSnapshot';
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName];

  export type Datasources = {
    db?: Datasource;
  };

  interface TypeMapCb extends $Utils.Fn<
    { extArgs: $Extensions.InternalArgs; clientOptions: PrismaClientOptions },
    $Utils.Record<string, any>
  > {
    returns: Prisma.TypeMap<this['params']['extArgs'], this['params']['clientOptions']>;
  }

  export type TypeMap<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    ClientOptions = {},
  > = {
    meta: {
      modelProps: 'ticketMetricDaily' | 'workspaceKpiSnapshot';
      txIsolationLevel: Prisma.TransactionIsolationLevel;
    };
    model: {
      TicketMetricDaily: {
        payload: Prisma.$TicketMetricDailyPayload<ExtArgs>;
        fields: Prisma.TicketMetricDailyFieldRefs;
        operations: {
          findUnique: {
            args: Prisma.TicketMetricDailyFindUniqueArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$TicketMetricDailyPayload> | null;
          };
          findUniqueOrThrow: {
            args: Prisma.TicketMetricDailyFindUniqueOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$TicketMetricDailyPayload>;
          };
          findFirst: {
            args: Prisma.TicketMetricDailyFindFirstArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$TicketMetricDailyPayload> | null;
          };
          findFirstOrThrow: {
            args: Prisma.TicketMetricDailyFindFirstOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$TicketMetricDailyPayload>;
          };
          findMany: {
            args: Prisma.TicketMetricDailyFindManyArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$TicketMetricDailyPayload>[];
          };
          create: {
            args: Prisma.TicketMetricDailyCreateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$TicketMetricDailyPayload>;
          };
          createMany: {
            args: Prisma.TicketMetricDailyCreateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          createManyAndReturn: {
            args: Prisma.TicketMetricDailyCreateManyAndReturnArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$TicketMetricDailyPayload>[];
          };
          delete: {
            args: Prisma.TicketMetricDailyDeleteArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$TicketMetricDailyPayload>;
          };
          update: {
            args: Prisma.TicketMetricDailyUpdateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$TicketMetricDailyPayload>;
          };
          deleteMany: {
            args: Prisma.TicketMetricDailyDeleteManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          updateMany: {
            args: Prisma.TicketMetricDailyUpdateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          upsert: {
            args: Prisma.TicketMetricDailyUpsertArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$TicketMetricDailyPayload>;
          };
          aggregate: {
            args: Prisma.TicketMetricDailyAggregateArgs<ExtArgs>;
            result: $Utils.Optional<AggregateTicketMetricDaily>;
          };
          groupBy: {
            args: Prisma.TicketMetricDailyGroupByArgs<ExtArgs>;
            result: $Utils.Optional<TicketMetricDailyGroupByOutputType>[];
          };
          count: {
            args: Prisma.TicketMetricDailyCountArgs<ExtArgs>;
            result: $Utils.Optional<TicketMetricDailyCountAggregateOutputType> | number;
          };
        };
      };
      WorkspaceKpiSnapshot: {
        payload: Prisma.$WorkspaceKpiSnapshotPayload<ExtArgs>;
        fields: Prisma.WorkspaceKpiSnapshotFieldRefs;
        operations: {
          findUnique: {
            args: Prisma.WorkspaceKpiSnapshotFindUniqueArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$WorkspaceKpiSnapshotPayload> | null;
          };
          findUniqueOrThrow: {
            args: Prisma.WorkspaceKpiSnapshotFindUniqueOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$WorkspaceKpiSnapshotPayload>;
          };
          findFirst: {
            args: Prisma.WorkspaceKpiSnapshotFindFirstArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$WorkspaceKpiSnapshotPayload> | null;
          };
          findFirstOrThrow: {
            args: Prisma.WorkspaceKpiSnapshotFindFirstOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$WorkspaceKpiSnapshotPayload>;
          };
          findMany: {
            args: Prisma.WorkspaceKpiSnapshotFindManyArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$WorkspaceKpiSnapshotPayload>[];
          };
          create: {
            args: Prisma.WorkspaceKpiSnapshotCreateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$WorkspaceKpiSnapshotPayload>;
          };
          createMany: {
            args: Prisma.WorkspaceKpiSnapshotCreateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          createManyAndReturn: {
            args: Prisma.WorkspaceKpiSnapshotCreateManyAndReturnArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$WorkspaceKpiSnapshotPayload>[];
          };
          delete: {
            args: Prisma.WorkspaceKpiSnapshotDeleteArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$WorkspaceKpiSnapshotPayload>;
          };
          update: {
            args: Prisma.WorkspaceKpiSnapshotUpdateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$WorkspaceKpiSnapshotPayload>;
          };
          deleteMany: {
            args: Prisma.WorkspaceKpiSnapshotDeleteManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          updateMany: {
            args: Prisma.WorkspaceKpiSnapshotUpdateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          upsert: {
            args: Prisma.WorkspaceKpiSnapshotUpsertArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$WorkspaceKpiSnapshotPayload>;
          };
          aggregate: {
            args: Prisma.WorkspaceKpiSnapshotAggregateArgs<ExtArgs>;
            result: $Utils.Optional<AggregateWorkspaceKpiSnapshot>;
          };
          groupBy: {
            args: Prisma.WorkspaceKpiSnapshotGroupByArgs<ExtArgs>;
            result: $Utils.Optional<WorkspaceKpiSnapshotGroupByOutputType>[];
          };
          count: {
            args: Prisma.WorkspaceKpiSnapshotCountArgs<ExtArgs>;
            result: $Utils.Optional<WorkspaceKpiSnapshotCountAggregateOutputType> | number;
          };
        };
      };
    };
  } & {
    other: {
      payload: any;
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]];
          result: any;
        };
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]];
          result: any;
        };
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]];
          result: any;
        };
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]];
          result: any;
        };
      };
    };
  };
  export const defineExtension: $Extensions.ExtendsHook<
    'define',
    Prisma.TypeMapCb,
    $Extensions.DefaultArgs
  >;
  export type DefaultPrismaClient = PrismaClient;
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal';
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources;
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string;
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat;
    /**
     * @example
     * ```
     * // Defaults to stdout
     * log: ['query', 'info', 'warn', 'error']
     *
     * // Emit as events
     * log: [
     *   { emit: 'stdout', level: 'query' },
     *   { emit: 'stdout', level: 'info' },
     *   { emit: 'stdout', level: 'warn' }
     *   { emit: 'stdout', level: 'error' }
     * ]
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[];
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number;
      timeout?: number;
      isolationLevel?: Prisma.TransactionIsolationLevel;
    };
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error';
  export type LogDefinition = {
    level: LogLevel;
    emit: 'stdout' | 'event';
  };

  export type GetLogType<T extends LogLevel | LogDefinition> = T extends LogDefinition
    ? T['emit'] extends 'event'
      ? T['level']
      : never
    : never;
  export type GetEvents<T extends any> =
    T extends Array<LogLevel | LogDefinition>
      ? GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]> | GetLogType<T[3]>
      : never;

  export type QueryEvent = {
    timestamp: Date;
    query: string;
    params: string;
    duration: number;
    target: string;
  };

  export type LogEvent = {
    timestamp: Date;
    message: string;
    target: string;
  };
  /* End Types for Logging */

  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy';

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName;
    action: PrismaAction;
    args: any;
    dataPath: string[];
    runInTransaction: boolean;
  };

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => $Utils.JsPromise<T>,
  ) => $Utils.JsPromise<T>;

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>;

  export type Datasource = {
    url?: string;
  };

  /**
   * Count Types
   */

  /**
   * Models
   */

  /**
   * Model TicketMetricDaily
   */

  export type AggregateTicketMetricDaily = {
    _count: TicketMetricDailyCountAggregateOutputType | null;
    _avg: TicketMetricDailyAvgAggregateOutputType | null;
    _sum: TicketMetricDailySumAggregateOutputType | null;
    _min: TicketMetricDailyMinAggregateOutputType | null;
    _max: TicketMetricDailyMaxAggregateOutputType | null;
  };

  export type TicketMetricDailyAvgAggregateOutputType = {
    openCount: number | null;
    createdCount: number | null;
    resolvedCount: number | null;
  };

  export type TicketMetricDailySumAggregateOutputType = {
    openCount: number | null;
    createdCount: number | null;
    resolvedCount: number | null;
  };

  export type TicketMetricDailyMinAggregateOutputType = {
    id: string | null;
    workspaceId: string | null;
    date: Date | null;
    openCount: number | null;
    createdCount: number | null;
    resolvedCount: number | null;
    createdAt: Date | null;
    updatedAt: Date | null;
  };

  export type TicketMetricDailyMaxAggregateOutputType = {
    id: string | null;
    workspaceId: string | null;
    date: Date | null;
    openCount: number | null;
    createdCount: number | null;
    resolvedCount: number | null;
    createdAt: Date | null;
    updatedAt: Date | null;
  };

  export type TicketMetricDailyCountAggregateOutputType = {
    id: number;
    workspaceId: number;
    date: number;
    openCount: number;
    createdCount: number;
    resolvedCount: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
  };

  export type TicketMetricDailyAvgAggregateInputType = {
    openCount?: true;
    createdCount?: true;
    resolvedCount?: true;
  };

  export type TicketMetricDailySumAggregateInputType = {
    openCount?: true;
    createdCount?: true;
    resolvedCount?: true;
  };

  export type TicketMetricDailyMinAggregateInputType = {
    id?: true;
    workspaceId?: true;
    date?: true;
    openCount?: true;
    createdCount?: true;
    resolvedCount?: true;
    createdAt?: true;
    updatedAt?: true;
  };

  export type TicketMetricDailyMaxAggregateInputType = {
    id?: true;
    workspaceId?: true;
    date?: true;
    openCount?: true;
    createdCount?: true;
    resolvedCount?: true;
    createdAt?: true;
    updatedAt?: true;
  };

  export type TicketMetricDailyCountAggregateInputType = {
    id?: true;
    workspaceId?: true;
    date?: true;
    openCount?: true;
    createdCount?: true;
    resolvedCount?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
  };

  export type TicketMetricDailyAggregateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which TicketMetricDaily to aggregate.
     */
    where?: TicketMetricDailyWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of TicketMetricDailies to fetch.
     */
    orderBy?:
      TicketMetricDailyOrderByWithRelationInput | TicketMetricDailyOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: TicketMetricDailyWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` TicketMetricDailies from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` TicketMetricDailies.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned TicketMetricDailies
     **/
    _count?: true | TicketMetricDailyCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to average
     **/
    _avg?: TicketMetricDailyAvgAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to sum
     **/
    _sum?: TicketMetricDailySumAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
     **/
    _min?: TicketMetricDailyMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
     **/
    _max?: TicketMetricDailyMaxAggregateInputType;
  };

  export type GetTicketMetricDailyAggregateType<T extends TicketMetricDailyAggregateArgs> = {
    [P in keyof T & keyof AggregateTicketMetricDaily]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTicketMetricDaily[P]>
      : GetScalarType<T[P], AggregateTicketMetricDaily[P]>;
  };

  export type TicketMetricDailyGroupByArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: TicketMetricDailyWhereInput;
    orderBy?:
      TicketMetricDailyOrderByWithAggregationInput | TicketMetricDailyOrderByWithAggregationInput[];
    by: TicketMetricDailyScalarFieldEnum[] | TicketMetricDailyScalarFieldEnum;
    having?: TicketMetricDailyScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: TicketMetricDailyCountAggregateInputType | true;
    _avg?: TicketMetricDailyAvgAggregateInputType;
    _sum?: TicketMetricDailySumAggregateInputType;
    _min?: TicketMetricDailyMinAggregateInputType;
    _max?: TicketMetricDailyMaxAggregateInputType;
  };

  export type TicketMetricDailyGroupByOutputType = {
    id: string;
    workspaceId: string;
    date: Date;
    openCount: number;
    createdCount: number;
    resolvedCount: number;
    createdAt: Date;
    updatedAt: Date;
    _count: TicketMetricDailyCountAggregateOutputType | null;
    _avg: TicketMetricDailyAvgAggregateOutputType | null;
    _sum: TicketMetricDailySumAggregateOutputType | null;
    _min: TicketMetricDailyMinAggregateOutputType | null;
    _max: TicketMetricDailyMaxAggregateOutputType | null;
  };

  type GetTicketMetricDailyGroupByPayload<T extends TicketMetricDailyGroupByArgs> =
    Prisma.PrismaPromise<
      Array<
        PickEnumerable<TicketMetricDailyGroupByOutputType, T['by']> & {
          [P in keyof T & keyof TicketMetricDailyGroupByOutputType]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TicketMetricDailyGroupByOutputType[P]>
            : GetScalarType<T[P], TicketMetricDailyGroupByOutputType[P]>;
        }
      >
    >;

  export type TicketMetricDailySelect<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      workspaceId?: boolean;
      date?: boolean;
      openCount?: boolean;
      createdCount?: boolean;
      resolvedCount?: boolean;
      createdAt?: boolean;
      updatedAt?: boolean;
    },
    ExtArgs['result']['ticketMetricDaily']
  >;

  export type TicketMetricDailySelectCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      workspaceId?: boolean;
      date?: boolean;
      openCount?: boolean;
      createdCount?: boolean;
      resolvedCount?: boolean;
      createdAt?: boolean;
      updatedAt?: boolean;
    },
    ExtArgs['result']['ticketMetricDaily']
  >;

  export type TicketMetricDailySelectScalar = {
    id?: boolean;
    workspaceId?: boolean;
    date?: boolean;
    openCount?: boolean;
    createdCount?: boolean;
    resolvedCount?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
  };

  export type $TicketMetricDailyPayload<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    name: 'TicketMetricDaily';
    objects: {};
    scalars: $Extensions.GetPayloadResult<
      {
        id: string;
        workspaceId: string;
        date: Date;
        openCount: number;
        createdCount: number;
        resolvedCount: number;
        createdAt: Date;
        updatedAt: Date;
      },
      ExtArgs['result']['ticketMetricDaily']
    >;
    composites: {};
  };

  type TicketMetricDailyGetPayload<
    S extends boolean | null | undefined | TicketMetricDailyDefaultArgs,
  > = $Result.GetResult<Prisma.$TicketMetricDailyPayload, S>;

  type TicketMetricDailyCountArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = Omit<TicketMetricDailyFindManyArgs, 'select' | 'include' | 'distinct'> & {
    select?: TicketMetricDailyCountAggregateInputType | true;
  };

  export interface TicketMetricDailyDelegate<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > {
    [K: symbol]: {
      types: Prisma.TypeMap<ExtArgs>['model']['TicketMetricDaily'];
      meta: { name: 'TicketMetricDaily' };
    };
    /**
     * Find zero or one TicketMetricDaily that matches the filter.
     * @param {TicketMetricDailyFindUniqueArgs} args - Arguments to find a TicketMetricDaily
     * @example
     * // Get one TicketMetricDaily
     * const ticketMetricDaily = await prisma.ticketMetricDaily.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TicketMetricDailyFindUniqueArgs>(
      args: SelectSubset<T, TicketMetricDailyFindUniqueArgs<ExtArgs>>,
    ): Prisma__TicketMetricDailyClient<
      $Result.GetResult<Prisma.$TicketMetricDailyPayload<ExtArgs>, T, 'findUnique'> | null,
      null,
      ExtArgs
    >;

    /**
     * Find one TicketMetricDaily that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {TicketMetricDailyFindUniqueOrThrowArgs} args - Arguments to find a TicketMetricDaily
     * @example
     * // Get one TicketMetricDaily
     * const ticketMetricDaily = await prisma.ticketMetricDaily.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TicketMetricDailyFindUniqueOrThrowArgs>(
      args: SelectSubset<T, TicketMetricDailyFindUniqueOrThrowArgs<ExtArgs>>,
    ): Prisma__TicketMetricDailyClient<
      $Result.GetResult<Prisma.$TicketMetricDailyPayload<ExtArgs>, T, 'findUniqueOrThrow'>,
      never,
      ExtArgs
    >;

    /**
     * Find the first TicketMetricDaily that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TicketMetricDailyFindFirstArgs} args - Arguments to find a TicketMetricDaily
     * @example
     * // Get one TicketMetricDaily
     * const ticketMetricDaily = await prisma.ticketMetricDaily.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TicketMetricDailyFindFirstArgs>(
      args?: SelectSubset<T, TicketMetricDailyFindFirstArgs<ExtArgs>>,
    ): Prisma__TicketMetricDailyClient<
      $Result.GetResult<Prisma.$TicketMetricDailyPayload<ExtArgs>, T, 'findFirst'> | null,
      null,
      ExtArgs
    >;

    /**
     * Find the first TicketMetricDaily that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TicketMetricDailyFindFirstOrThrowArgs} args - Arguments to find a TicketMetricDaily
     * @example
     * // Get one TicketMetricDaily
     * const ticketMetricDaily = await prisma.ticketMetricDaily.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TicketMetricDailyFindFirstOrThrowArgs>(
      args?: SelectSubset<T, TicketMetricDailyFindFirstOrThrowArgs<ExtArgs>>,
    ): Prisma__TicketMetricDailyClient<
      $Result.GetResult<Prisma.$TicketMetricDailyPayload<ExtArgs>, T, 'findFirstOrThrow'>,
      never,
      ExtArgs
    >;

    /**
     * Find zero or more TicketMetricDailies that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TicketMetricDailyFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all TicketMetricDailies
     * const ticketMetricDailies = await prisma.ticketMetricDaily.findMany()
     *
     * // Get first 10 TicketMetricDailies
     * const ticketMetricDailies = await prisma.ticketMetricDaily.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const ticketMetricDailyWithIdOnly = await prisma.ticketMetricDaily.findMany({ select: { id: true } })
     *
     */
    findMany<T extends TicketMetricDailyFindManyArgs>(
      args?: SelectSubset<T, TicketMetricDailyFindManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<Prisma.$TicketMetricDailyPayload<ExtArgs>, T, 'findMany'>
    >;

    /**
     * Create a TicketMetricDaily.
     * @param {TicketMetricDailyCreateArgs} args - Arguments to create a TicketMetricDaily.
     * @example
     * // Create one TicketMetricDaily
     * const TicketMetricDaily = await prisma.ticketMetricDaily.create({
     *   data: {
     *     // ... data to create a TicketMetricDaily
     *   }
     * })
     *
     */
    create<T extends TicketMetricDailyCreateArgs>(
      args: SelectSubset<T, TicketMetricDailyCreateArgs<ExtArgs>>,
    ): Prisma__TicketMetricDailyClient<
      $Result.GetResult<Prisma.$TicketMetricDailyPayload<ExtArgs>, T, 'create'>,
      never,
      ExtArgs
    >;

    /**
     * Create many TicketMetricDailies.
     * @param {TicketMetricDailyCreateManyArgs} args - Arguments to create many TicketMetricDailies.
     * @example
     * // Create many TicketMetricDailies
     * const ticketMetricDaily = await prisma.ticketMetricDaily.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends TicketMetricDailyCreateManyArgs>(
      args?: SelectSubset<T, TicketMetricDailyCreateManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Create many TicketMetricDailies and returns the data saved in the database.
     * @param {TicketMetricDailyCreateManyAndReturnArgs} args - Arguments to create many TicketMetricDailies.
     * @example
     * // Create many TicketMetricDailies
     * const ticketMetricDaily = await prisma.ticketMetricDaily.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many TicketMetricDailies and only return the `id`
     * const ticketMetricDailyWithIdOnly = await prisma.ticketMetricDaily.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends TicketMetricDailyCreateManyAndReturnArgs>(
      args?: SelectSubset<T, TicketMetricDailyCreateManyAndReturnArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<Prisma.$TicketMetricDailyPayload<ExtArgs>, T, 'createManyAndReturn'>
    >;

    /**
     * Delete a TicketMetricDaily.
     * @param {TicketMetricDailyDeleteArgs} args - Arguments to delete one TicketMetricDaily.
     * @example
     * // Delete one TicketMetricDaily
     * const TicketMetricDaily = await prisma.ticketMetricDaily.delete({
     *   where: {
     *     // ... filter to delete one TicketMetricDaily
     *   }
     * })
     *
     */
    delete<T extends TicketMetricDailyDeleteArgs>(
      args: SelectSubset<T, TicketMetricDailyDeleteArgs<ExtArgs>>,
    ): Prisma__TicketMetricDailyClient<
      $Result.GetResult<Prisma.$TicketMetricDailyPayload<ExtArgs>, T, 'delete'>,
      never,
      ExtArgs
    >;

    /**
     * Update one TicketMetricDaily.
     * @param {TicketMetricDailyUpdateArgs} args - Arguments to update one TicketMetricDaily.
     * @example
     * // Update one TicketMetricDaily
     * const ticketMetricDaily = await prisma.ticketMetricDaily.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends TicketMetricDailyUpdateArgs>(
      args: SelectSubset<T, TicketMetricDailyUpdateArgs<ExtArgs>>,
    ): Prisma__TicketMetricDailyClient<
      $Result.GetResult<Prisma.$TicketMetricDailyPayload<ExtArgs>, T, 'update'>,
      never,
      ExtArgs
    >;

    /**
     * Delete zero or more TicketMetricDailies.
     * @param {TicketMetricDailyDeleteManyArgs} args - Arguments to filter TicketMetricDailies to delete.
     * @example
     * // Delete a few TicketMetricDailies
     * const { count } = await prisma.ticketMetricDaily.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends TicketMetricDailyDeleteManyArgs>(
      args?: SelectSubset<T, TicketMetricDailyDeleteManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Update zero or more TicketMetricDailies.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TicketMetricDailyUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many TicketMetricDailies
     * const ticketMetricDaily = await prisma.ticketMetricDaily.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends TicketMetricDailyUpdateManyArgs>(
      args: SelectSubset<T, TicketMetricDailyUpdateManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Create or update one TicketMetricDaily.
     * @param {TicketMetricDailyUpsertArgs} args - Arguments to update or create a TicketMetricDaily.
     * @example
     * // Update or create a TicketMetricDaily
     * const ticketMetricDaily = await prisma.ticketMetricDaily.upsert({
     *   create: {
     *     // ... data to create a TicketMetricDaily
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the TicketMetricDaily we want to update
     *   }
     * })
     */
    upsert<T extends TicketMetricDailyUpsertArgs>(
      args: SelectSubset<T, TicketMetricDailyUpsertArgs<ExtArgs>>,
    ): Prisma__TicketMetricDailyClient<
      $Result.GetResult<Prisma.$TicketMetricDailyPayload<ExtArgs>, T, 'upsert'>,
      never,
      ExtArgs
    >;

    /**
     * Count the number of TicketMetricDailies.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TicketMetricDailyCountArgs} args - Arguments to filter TicketMetricDailies to count.
     * @example
     * // Count the number of TicketMetricDailies
     * const count = await prisma.ticketMetricDaily.count({
     *   where: {
     *     // ... the filter for the TicketMetricDailies we want to count
     *   }
     * })
     **/
    count<T extends TicketMetricDailyCountArgs>(
      args?: Subset<T, TicketMetricDailyCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TicketMetricDailyCountAggregateOutputType>
        : number
    >;

    /**
     * Allows you to perform aggregations operations on a TicketMetricDaily.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TicketMetricDailyAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
     **/
    aggregate<T extends TicketMetricDailyAggregateArgs>(
      args: Subset<T, TicketMetricDailyAggregateArgs>,
    ): Prisma.PrismaPromise<GetTicketMetricDailyAggregateType<T>>;

    /**
     * Group by TicketMetricDaily.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TicketMetricDailyGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     *
     **/
    groupBy<
      T extends TicketMetricDailyGroupByArgs,
      HasSelectOrTake extends Or<Extends<'skip', Keys<T>>, Extends<'take', Keys<T>>>,
      OrderByArg extends (True extends HasSelectOrTake
        ? { orderBy: TicketMetricDailyGroupByArgs['orderBy'] }
        : { orderBy?: TicketMetricDailyGroupByArgs['orderBy'] }),
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends (T['by'] extends never[] ? True : False),
      InputErrors extends (ByEmpty extends True
        ? `Error: "by" must not be empty.`
        : HavingValid extends False
          ? {
              [P in HavingFields]: P extends ByFields
                ? never
                : P extends string
                  ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
                  : [Error, 'Field ', P, ` in "having" needs to be provided in "by"`];
            }[HavingFields]
          : 'take' extends Keys<T>
            ? 'orderBy' extends Keys<T>
              ? ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields]
              : 'Error: If you provide "take", you also need to provide "orderBy"'
            : 'skip' extends Keys<T>
              ? 'orderBy' extends Keys<T>
                ? ByValid extends True
                  ? {}
                  : {
                      [P in OrderFields]: P extends ByFields
                        ? never
                        : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                    }[OrderFields]
                : 'Error: If you provide "skip", you also need to provide "orderBy"'
              : ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields]),
    >(
      args: SubsetIntersection<T, TicketMetricDailyGroupByArgs, OrderByArg> & InputErrors,
    ): {} extends InputErrors
      ? GetTicketMetricDailyGroupByPayload<T>
      : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the TicketMetricDaily model
     */
    readonly fields: TicketMetricDailyFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for TicketMetricDaily.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TicketMetricDailyClient<
    T,
    Null = never,
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise';
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(
      onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null,
      onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null,
    ): $Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(
      onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null,
    ): $Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>;
  }

  /**
   * Fields of the TicketMetricDaily model
   */
  interface TicketMetricDailyFieldRefs {
    readonly id: FieldRef<'TicketMetricDaily', 'String'>;
    readonly workspaceId: FieldRef<'TicketMetricDaily', 'String'>;
    readonly date: FieldRef<'TicketMetricDaily', 'DateTime'>;
    readonly openCount: FieldRef<'TicketMetricDaily', 'Int'>;
    readonly createdCount: FieldRef<'TicketMetricDaily', 'Int'>;
    readonly resolvedCount: FieldRef<'TicketMetricDaily', 'Int'>;
    readonly createdAt: FieldRef<'TicketMetricDaily', 'DateTime'>;
    readonly updatedAt: FieldRef<'TicketMetricDaily', 'DateTime'>;
  }

  // Custom InputTypes
  /**
   * TicketMetricDaily findUnique
   */
  export type TicketMetricDailyFindUniqueArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the TicketMetricDaily
     */
    select?: TicketMetricDailySelect<ExtArgs> | null;
    /**
     * Filter, which TicketMetricDaily to fetch.
     */
    where: TicketMetricDailyWhereUniqueInput;
  };

  /**
   * TicketMetricDaily findUniqueOrThrow
   */
  export type TicketMetricDailyFindUniqueOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the TicketMetricDaily
     */
    select?: TicketMetricDailySelect<ExtArgs> | null;
    /**
     * Filter, which TicketMetricDaily to fetch.
     */
    where: TicketMetricDailyWhereUniqueInput;
  };

  /**
   * TicketMetricDaily findFirst
   */
  export type TicketMetricDailyFindFirstArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the TicketMetricDaily
     */
    select?: TicketMetricDailySelect<ExtArgs> | null;
    /**
     * Filter, which TicketMetricDaily to fetch.
     */
    where?: TicketMetricDailyWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of TicketMetricDailies to fetch.
     */
    orderBy?:
      TicketMetricDailyOrderByWithRelationInput | TicketMetricDailyOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for TicketMetricDailies.
     */
    cursor?: TicketMetricDailyWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` TicketMetricDailies from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` TicketMetricDailies.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of TicketMetricDailies.
     */
    distinct?: TicketMetricDailyScalarFieldEnum | TicketMetricDailyScalarFieldEnum[];
  };

  /**
   * TicketMetricDaily findFirstOrThrow
   */
  export type TicketMetricDailyFindFirstOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the TicketMetricDaily
     */
    select?: TicketMetricDailySelect<ExtArgs> | null;
    /**
     * Filter, which TicketMetricDaily to fetch.
     */
    where?: TicketMetricDailyWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of TicketMetricDailies to fetch.
     */
    orderBy?:
      TicketMetricDailyOrderByWithRelationInput | TicketMetricDailyOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for TicketMetricDailies.
     */
    cursor?: TicketMetricDailyWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` TicketMetricDailies from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` TicketMetricDailies.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of TicketMetricDailies.
     */
    distinct?: TicketMetricDailyScalarFieldEnum | TicketMetricDailyScalarFieldEnum[];
  };

  /**
   * TicketMetricDaily findMany
   */
  export type TicketMetricDailyFindManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the TicketMetricDaily
     */
    select?: TicketMetricDailySelect<ExtArgs> | null;
    /**
     * Filter, which TicketMetricDailies to fetch.
     */
    where?: TicketMetricDailyWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of TicketMetricDailies to fetch.
     */
    orderBy?:
      TicketMetricDailyOrderByWithRelationInput | TicketMetricDailyOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing TicketMetricDailies.
     */
    cursor?: TicketMetricDailyWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` TicketMetricDailies from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` TicketMetricDailies.
     */
    skip?: number;
    distinct?: TicketMetricDailyScalarFieldEnum | TicketMetricDailyScalarFieldEnum[];
  };

  /**
   * TicketMetricDaily create
   */
  export type TicketMetricDailyCreateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the TicketMetricDaily
     */
    select?: TicketMetricDailySelect<ExtArgs> | null;
    /**
     * The data needed to create a TicketMetricDaily.
     */
    data: XOR<TicketMetricDailyCreateInput, TicketMetricDailyUncheckedCreateInput>;
  };

  /**
   * TicketMetricDaily createMany
   */
  export type TicketMetricDailyCreateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to create many TicketMetricDailies.
     */
    data: TicketMetricDailyCreateManyInput | TicketMetricDailyCreateManyInput[];
    skipDuplicates?: boolean;
  };

  /**
   * TicketMetricDaily createManyAndReturn
   */
  export type TicketMetricDailyCreateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the TicketMetricDaily
     */
    select?: TicketMetricDailySelectCreateManyAndReturn<ExtArgs> | null;
    /**
     * The data used to create many TicketMetricDailies.
     */
    data: TicketMetricDailyCreateManyInput | TicketMetricDailyCreateManyInput[];
    skipDuplicates?: boolean;
  };

  /**
   * TicketMetricDaily update
   */
  export type TicketMetricDailyUpdateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the TicketMetricDaily
     */
    select?: TicketMetricDailySelect<ExtArgs> | null;
    /**
     * The data needed to update a TicketMetricDaily.
     */
    data: XOR<TicketMetricDailyUpdateInput, TicketMetricDailyUncheckedUpdateInput>;
    /**
     * Choose, which TicketMetricDaily to update.
     */
    where: TicketMetricDailyWhereUniqueInput;
  };

  /**
   * TicketMetricDaily updateMany
   */
  export type TicketMetricDailyUpdateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to update TicketMetricDailies.
     */
    data: XOR<TicketMetricDailyUpdateManyMutationInput, TicketMetricDailyUncheckedUpdateManyInput>;
    /**
     * Filter which TicketMetricDailies to update
     */
    where?: TicketMetricDailyWhereInput;
  };

  /**
   * TicketMetricDaily upsert
   */
  export type TicketMetricDailyUpsertArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the TicketMetricDaily
     */
    select?: TicketMetricDailySelect<ExtArgs> | null;
    /**
     * The filter to search for the TicketMetricDaily to update in case it exists.
     */
    where: TicketMetricDailyWhereUniqueInput;
    /**
     * In case the TicketMetricDaily found by the `where` argument doesn't exist, create a new TicketMetricDaily with this data.
     */
    create: XOR<TicketMetricDailyCreateInput, TicketMetricDailyUncheckedCreateInput>;
    /**
     * In case the TicketMetricDaily was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TicketMetricDailyUpdateInput, TicketMetricDailyUncheckedUpdateInput>;
  };

  /**
   * TicketMetricDaily delete
   */
  export type TicketMetricDailyDeleteArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the TicketMetricDaily
     */
    select?: TicketMetricDailySelect<ExtArgs> | null;
    /**
     * Filter which TicketMetricDaily to delete.
     */
    where: TicketMetricDailyWhereUniqueInput;
  };

  /**
   * TicketMetricDaily deleteMany
   */
  export type TicketMetricDailyDeleteManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which TicketMetricDailies to delete
     */
    where?: TicketMetricDailyWhereInput;
  };

  /**
   * TicketMetricDaily without action
   */
  export type TicketMetricDailyDefaultArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the TicketMetricDaily
     */
    select?: TicketMetricDailySelect<ExtArgs> | null;
  };

  /**
   * Model WorkspaceKpiSnapshot
   */

  export type AggregateWorkspaceKpiSnapshot = {
    _count: WorkspaceKpiSnapshotCountAggregateOutputType | null;
    _avg: WorkspaceKpiSnapshotAvgAggregateOutputType | null;
    _sum: WorkspaceKpiSnapshotSumAggregateOutputType | null;
    _min: WorkspaceKpiSnapshotMinAggregateOutputType | null;
    _max: WorkspaceKpiSnapshotMaxAggregateOutputType | null;
  };

  export type WorkspaceKpiSnapshotAvgAggregateOutputType = {
    openTickets: number | null;
    resolvedTickets: number | null;
    avgResolutionTimeHours: number | null;
  };

  export type WorkspaceKpiSnapshotSumAggregateOutputType = {
    openTickets: number | null;
    resolvedTickets: number | null;
    avgResolutionTimeHours: number | null;
  };

  export type WorkspaceKpiSnapshotMinAggregateOutputType = {
    id: string | null;
    workspaceId: string | null;
    openTickets: number | null;
    resolvedTickets: number | null;
    avgResolutionTimeHours: number | null;
    capturedAt: Date | null;
  };

  export type WorkspaceKpiSnapshotMaxAggregateOutputType = {
    id: string | null;
    workspaceId: string | null;
    openTickets: number | null;
    resolvedTickets: number | null;
    avgResolutionTimeHours: number | null;
    capturedAt: Date | null;
  };

  export type WorkspaceKpiSnapshotCountAggregateOutputType = {
    id: number;
    workspaceId: number;
    openTickets: number;
    resolvedTickets: number;
    avgResolutionTimeHours: number;
    capturedAt: number;
    _all: number;
  };

  export type WorkspaceKpiSnapshotAvgAggregateInputType = {
    openTickets?: true;
    resolvedTickets?: true;
    avgResolutionTimeHours?: true;
  };

  export type WorkspaceKpiSnapshotSumAggregateInputType = {
    openTickets?: true;
    resolvedTickets?: true;
    avgResolutionTimeHours?: true;
  };

  export type WorkspaceKpiSnapshotMinAggregateInputType = {
    id?: true;
    workspaceId?: true;
    openTickets?: true;
    resolvedTickets?: true;
    avgResolutionTimeHours?: true;
    capturedAt?: true;
  };

  export type WorkspaceKpiSnapshotMaxAggregateInputType = {
    id?: true;
    workspaceId?: true;
    openTickets?: true;
    resolvedTickets?: true;
    avgResolutionTimeHours?: true;
    capturedAt?: true;
  };

  export type WorkspaceKpiSnapshotCountAggregateInputType = {
    id?: true;
    workspaceId?: true;
    openTickets?: true;
    resolvedTickets?: true;
    avgResolutionTimeHours?: true;
    capturedAt?: true;
    _all?: true;
  };

  export type WorkspaceKpiSnapshotAggregateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which WorkspaceKpiSnapshot to aggregate.
     */
    where?: WorkspaceKpiSnapshotWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of WorkspaceKpiSnapshots to fetch.
     */
    orderBy?:
      WorkspaceKpiSnapshotOrderByWithRelationInput | WorkspaceKpiSnapshotOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: WorkspaceKpiSnapshotWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` WorkspaceKpiSnapshots from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` WorkspaceKpiSnapshots.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned WorkspaceKpiSnapshots
     **/
    _count?: true | WorkspaceKpiSnapshotCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to average
     **/
    _avg?: WorkspaceKpiSnapshotAvgAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to sum
     **/
    _sum?: WorkspaceKpiSnapshotSumAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
     **/
    _min?: WorkspaceKpiSnapshotMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
     **/
    _max?: WorkspaceKpiSnapshotMaxAggregateInputType;
  };

  export type GetWorkspaceKpiSnapshotAggregateType<T extends WorkspaceKpiSnapshotAggregateArgs> = {
    [P in keyof T & keyof AggregateWorkspaceKpiSnapshot]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateWorkspaceKpiSnapshot[P]>
      : GetScalarType<T[P], AggregateWorkspaceKpiSnapshot[P]>;
  };

  export type WorkspaceKpiSnapshotGroupByArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: WorkspaceKpiSnapshotWhereInput;
    orderBy?:
      | WorkspaceKpiSnapshotOrderByWithAggregationInput
      | WorkspaceKpiSnapshotOrderByWithAggregationInput[];
    by: WorkspaceKpiSnapshotScalarFieldEnum[] | WorkspaceKpiSnapshotScalarFieldEnum;
    having?: WorkspaceKpiSnapshotScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: WorkspaceKpiSnapshotCountAggregateInputType | true;
    _avg?: WorkspaceKpiSnapshotAvgAggregateInputType;
    _sum?: WorkspaceKpiSnapshotSumAggregateInputType;
    _min?: WorkspaceKpiSnapshotMinAggregateInputType;
    _max?: WorkspaceKpiSnapshotMaxAggregateInputType;
  };

  export type WorkspaceKpiSnapshotGroupByOutputType = {
    id: string;
    workspaceId: string;
    openTickets: number;
    resolvedTickets: number;
    avgResolutionTimeHours: number;
    capturedAt: Date;
    _count: WorkspaceKpiSnapshotCountAggregateOutputType | null;
    _avg: WorkspaceKpiSnapshotAvgAggregateOutputType | null;
    _sum: WorkspaceKpiSnapshotSumAggregateOutputType | null;
    _min: WorkspaceKpiSnapshotMinAggregateOutputType | null;
    _max: WorkspaceKpiSnapshotMaxAggregateOutputType | null;
  };

  type GetWorkspaceKpiSnapshotGroupByPayload<T extends WorkspaceKpiSnapshotGroupByArgs> =
    Prisma.PrismaPromise<
      Array<
        PickEnumerable<WorkspaceKpiSnapshotGroupByOutputType, T['by']> & {
          [P in keyof T & keyof WorkspaceKpiSnapshotGroupByOutputType]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], WorkspaceKpiSnapshotGroupByOutputType[P]>
            : GetScalarType<T[P], WorkspaceKpiSnapshotGroupByOutputType[P]>;
        }
      >
    >;

  export type WorkspaceKpiSnapshotSelect<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      workspaceId?: boolean;
      openTickets?: boolean;
      resolvedTickets?: boolean;
      avgResolutionTimeHours?: boolean;
      capturedAt?: boolean;
    },
    ExtArgs['result']['workspaceKpiSnapshot']
  >;

  export type WorkspaceKpiSnapshotSelectCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      workspaceId?: boolean;
      openTickets?: boolean;
      resolvedTickets?: boolean;
      avgResolutionTimeHours?: boolean;
      capturedAt?: boolean;
    },
    ExtArgs['result']['workspaceKpiSnapshot']
  >;

  export type WorkspaceKpiSnapshotSelectScalar = {
    id?: boolean;
    workspaceId?: boolean;
    openTickets?: boolean;
    resolvedTickets?: boolean;
    avgResolutionTimeHours?: boolean;
    capturedAt?: boolean;
  };

  export type $WorkspaceKpiSnapshotPayload<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    name: 'WorkspaceKpiSnapshot';
    objects: {};
    scalars: $Extensions.GetPayloadResult<
      {
        id: string;
        workspaceId: string;
        openTickets: number;
        resolvedTickets: number;
        avgResolutionTimeHours: number;
        capturedAt: Date;
      },
      ExtArgs['result']['workspaceKpiSnapshot']
    >;
    composites: {};
  };

  type WorkspaceKpiSnapshotGetPayload<
    S extends boolean | null | undefined | WorkspaceKpiSnapshotDefaultArgs,
  > = $Result.GetResult<Prisma.$WorkspaceKpiSnapshotPayload, S>;

  type WorkspaceKpiSnapshotCountArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = Omit<WorkspaceKpiSnapshotFindManyArgs, 'select' | 'include' | 'distinct'> & {
    select?: WorkspaceKpiSnapshotCountAggregateInputType | true;
  };

  export interface WorkspaceKpiSnapshotDelegate<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > {
    [K: symbol]: {
      types: Prisma.TypeMap<ExtArgs>['model']['WorkspaceKpiSnapshot'];
      meta: { name: 'WorkspaceKpiSnapshot' };
    };
    /**
     * Find zero or one WorkspaceKpiSnapshot that matches the filter.
     * @param {WorkspaceKpiSnapshotFindUniqueArgs} args - Arguments to find a WorkspaceKpiSnapshot
     * @example
     * // Get one WorkspaceKpiSnapshot
     * const workspaceKpiSnapshot = await prisma.workspaceKpiSnapshot.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends WorkspaceKpiSnapshotFindUniqueArgs>(
      args: SelectSubset<T, WorkspaceKpiSnapshotFindUniqueArgs<ExtArgs>>,
    ): Prisma__WorkspaceKpiSnapshotClient<
      $Result.GetResult<Prisma.$WorkspaceKpiSnapshotPayload<ExtArgs>, T, 'findUnique'> | null,
      null,
      ExtArgs
    >;

    /**
     * Find one WorkspaceKpiSnapshot that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {WorkspaceKpiSnapshotFindUniqueOrThrowArgs} args - Arguments to find a WorkspaceKpiSnapshot
     * @example
     * // Get one WorkspaceKpiSnapshot
     * const workspaceKpiSnapshot = await prisma.workspaceKpiSnapshot.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends WorkspaceKpiSnapshotFindUniqueOrThrowArgs>(
      args: SelectSubset<T, WorkspaceKpiSnapshotFindUniqueOrThrowArgs<ExtArgs>>,
    ): Prisma__WorkspaceKpiSnapshotClient<
      $Result.GetResult<Prisma.$WorkspaceKpiSnapshotPayload<ExtArgs>, T, 'findUniqueOrThrow'>,
      never,
      ExtArgs
    >;

    /**
     * Find the first WorkspaceKpiSnapshot that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WorkspaceKpiSnapshotFindFirstArgs} args - Arguments to find a WorkspaceKpiSnapshot
     * @example
     * // Get one WorkspaceKpiSnapshot
     * const workspaceKpiSnapshot = await prisma.workspaceKpiSnapshot.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends WorkspaceKpiSnapshotFindFirstArgs>(
      args?: SelectSubset<T, WorkspaceKpiSnapshotFindFirstArgs<ExtArgs>>,
    ): Prisma__WorkspaceKpiSnapshotClient<
      $Result.GetResult<Prisma.$WorkspaceKpiSnapshotPayload<ExtArgs>, T, 'findFirst'> | null,
      null,
      ExtArgs
    >;

    /**
     * Find the first WorkspaceKpiSnapshot that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WorkspaceKpiSnapshotFindFirstOrThrowArgs} args - Arguments to find a WorkspaceKpiSnapshot
     * @example
     * // Get one WorkspaceKpiSnapshot
     * const workspaceKpiSnapshot = await prisma.workspaceKpiSnapshot.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends WorkspaceKpiSnapshotFindFirstOrThrowArgs>(
      args?: SelectSubset<T, WorkspaceKpiSnapshotFindFirstOrThrowArgs<ExtArgs>>,
    ): Prisma__WorkspaceKpiSnapshotClient<
      $Result.GetResult<Prisma.$WorkspaceKpiSnapshotPayload<ExtArgs>, T, 'findFirstOrThrow'>,
      never,
      ExtArgs
    >;

    /**
     * Find zero or more WorkspaceKpiSnapshots that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WorkspaceKpiSnapshotFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all WorkspaceKpiSnapshots
     * const workspaceKpiSnapshots = await prisma.workspaceKpiSnapshot.findMany()
     *
     * // Get first 10 WorkspaceKpiSnapshots
     * const workspaceKpiSnapshots = await prisma.workspaceKpiSnapshot.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const workspaceKpiSnapshotWithIdOnly = await prisma.workspaceKpiSnapshot.findMany({ select: { id: true } })
     *
     */
    findMany<T extends WorkspaceKpiSnapshotFindManyArgs>(
      args?: SelectSubset<T, WorkspaceKpiSnapshotFindManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<Prisma.$WorkspaceKpiSnapshotPayload<ExtArgs>, T, 'findMany'>
    >;

    /**
     * Create a WorkspaceKpiSnapshot.
     * @param {WorkspaceKpiSnapshotCreateArgs} args - Arguments to create a WorkspaceKpiSnapshot.
     * @example
     * // Create one WorkspaceKpiSnapshot
     * const WorkspaceKpiSnapshot = await prisma.workspaceKpiSnapshot.create({
     *   data: {
     *     // ... data to create a WorkspaceKpiSnapshot
     *   }
     * })
     *
     */
    create<T extends WorkspaceKpiSnapshotCreateArgs>(
      args: SelectSubset<T, WorkspaceKpiSnapshotCreateArgs<ExtArgs>>,
    ): Prisma__WorkspaceKpiSnapshotClient<
      $Result.GetResult<Prisma.$WorkspaceKpiSnapshotPayload<ExtArgs>, T, 'create'>,
      never,
      ExtArgs
    >;

    /**
     * Create many WorkspaceKpiSnapshots.
     * @param {WorkspaceKpiSnapshotCreateManyArgs} args - Arguments to create many WorkspaceKpiSnapshots.
     * @example
     * // Create many WorkspaceKpiSnapshots
     * const workspaceKpiSnapshot = await prisma.workspaceKpiSnapshot.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends WorkspaceKpiSnapshotCreateManyArgs>(
      args?: SelectSubset<T, WorkspaceKpiSnapshotCreateManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Create many WorkspaceKpiSnapshots and returns the data saved in the database.
     * @param {WorkspaceKpiSnapshotCreateManyAndReturnArgs} args - Arguments to create many WorkspaceKpiSnapshots.
     * @example
     * // Create many WorkspaceKpiSnapshots
     * const workspaceKpiSnapshot = await prisma.workspaceKpiSnapshot.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many WorkspaceKpiSnapshots and only return the `id`
     * const workspaceKpiSnapshotWithIdOnly = await prisma.workspaceKpiSnapshot.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends WorkspaceKpiSnapshotCreateManyAndReturnArgs>(
      args?: SelectSubset<T, WorkspaceKpiSnapshotCreateManyAndReturnArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<Prisma.$WorkspaceKpiSnapshotPayload<ExtArgs>, T, 'createManyAndReturn'>
    >;

    /**
     * Delete a WorkspaceKpiSnapshot.
     * @param {WorkspaceKpiSnapshotDeleteArgs} args - Arguments to delete one WorkspaceKpiSnapshot.
     * @example
     * // Delete one WorkspaceKpiSnapshot
     * const WorkspaceKpiSnapshot = await prisma.workspaceKpiSnapshot.delete({
     *   where: {
     *     // ... filter to delete one WorkspaceKpiSnapshot
     *   }
     * })
     *
     */
    delete<T extends WorkspaceKpiSnapshotDeleteArgs>(
      args: SelectSubset<T, WorkspaceKpiSnapshotDeleteArgs<ExtArgs>>,
    ): Prisma__WorkspaceKpiSnapshotClient<
      $Result.GetResult<Prisma.$WorkspaceKpiSnapshotPayload<ExtArgs>, T, 'delete'>,
      never,
      ExtArgs
    >;

    /**
     * Update one WorkspaceKpiSnapshot.
     * @param {WorkspaceKpiSnapshotUpdateArgs} args - Arguments to update one WorkspaceKpiSnapshot.
     * @example
     * // Update one WorkspaceKpiSnapshot
     * const workspaceKpiSnapshot = await prisma.workspaceKpiSnapshot.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends WorkspaceKpiSnapshotUpdateArgs>(
      args: SelectSubset<T, WorkspaceKpiSnapshotUpdateArgs<ExtArgs>>,
    ): Prisma__WorkspaceKpiSnapshotClient<
      $Result.GetResult<Prisma.$WorkspaceKpiSnapshotPayload<ExtArgs>, T, 'update'>,
      never,
      ExtArgs
    >;

    /**
     * Delete zero or more WorkspaceKpiSnapshots.
     * @param {WorkspaceKpiSnapshotDeleteManyArgs} args - Arguments to filter WorkspaceKpiSnapshots to delete.
     * @example
     * // Delete a few WorkspaceKpiSnapshots
     * const { count } = await prisma.workspaceKpiSnapshot.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends WorkspaceKpiSnapshotDeleteManyArgs>(
      args?: SelectSubset<T, WorkspaceKpiSnapshotDeleteManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Update zero or more WorkspaceKpiSnapshots.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WorkspaceKpiSnapshotUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many WorkspaceKpiSnapshots
     * const workspaceKpiSnapshot = await prisma.workspaceKpiSnapshot.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends WorkspaceKpiSnapshotUpdateManyArgs>(
      args: SelectSubset<T, WorkspaceKpiSnapshotUpdateManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Create or update one WorkspaceKpiSnapshot.
     * @param {WorkspaceKpiSnapshotUpsertArgs} args - Arguments to update or create a WorkspaceKpiSnapshot.
     * @example
     * // Update or create a WorkspaceKpiSnapshot
     * const workspaceKpiSnapshot = await prisma.workspaceKpiSnapshot.upsert({
     *   create: {
     *     // ... data to create a WorkspaceKpiSnapshot
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the WorkspaceKpiSnapshot we want to update
     *   }
     * })
     */
    upsert<T extends WorkspaceKpiSnapshotUpsertArgs>(
      args: SelectSubset<T, WorkspaceKpiSnapshotUpsertArgs<ExtArgs>>,
    ): Prisma__WorkspaceKpiSnapshotClient<
      $Result.GetResult<Prisma.$WorkspaceKpiSnapshotPayload<ExtArgs>, T, 'upsert'>,
      never,
      ExtArgs
    >;

    /**
     * Count the number of WorkspaceKpiSnapshots.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WorkspaceKpiSnapshotCountArgs} args - Arguments to filter WorkspaceKpiSnapshots to count.
     * @example
     * // Count the number of WorkspaceKpiSnapshots
     * const count = await prisma.workspaceKpiSnapshot.count({
     *   where: {
     *     // ... the filter for the WorkspaceKpiSnapshots we want to count
     *   }
     * })
     **/
    count<T extends WorkspaceKpiSnapshotCountArgs>(
      args?: Subset<T, WorkspaceKpiSnapshotCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], WorkspaceKpiSnapshotCountAggregateOutputType>
        : number
    >;

    /**
     * Allows you to perform aggregations operations on a WorkspaceKpiSnapshot.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WorkspaceKpiSnapshotAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
     **/
    aggregate<T extends WorkspaceKpiSnapshotAggregateArgs>(
      args: Subset<T, WorkspaceKpiSnapshotAggregateArgs>,
    ): Prisma.PrismaPromise<GetWorkspaceKpiSnapshotAggregateType<T>>;

    /**
     * Group by WorkspaceKpiSnapshot.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WorkspaceKpiSnapshotGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     *
     **/
    groupBy<
      T extends WorkspaceKpiSnapshotGroupByArgs,
      HasSelectOrTake extends Or<Extends<'skip', Keys<T>>, Extends<'take', Keys<T>>>,
      OrderByArg extends (True extends HasSelectOrTake
        ? { orderBy: WorkspaceKpiSnapshotGroupByArgs['orderBy'] }
        : { orderBy?: WorkspaceKpiSnapshotGroupByArgs['orderBy'] }),
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends (T['by'] extends never[] ? True : False),
      InputErrors extends (ByEmpty extends True
        ? `Error: "by" must not be empty.`
        : HavingValid extends False
          ? {
              [P in HavingFields]: P extends ByFields
                ? never
                : P extends string
                  ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
                  : [Error, 'Field ', P, ` in "having" needs to be provided in "by"`];
            }[HavingFields]
          : 'take' extends Keys<T>
            ? 'orderBy' extends Keys<T>
              ? ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields]
              : 'Error: If you provide "take", you also need to provide "orderBy"'
            : 'skip' extends Keys<T>
              ? 'orderBy' extends Keys<T>
                ? ByValid extends True
                  ? {}
                  : {
                      [P in OrderFields]: P extends ByFields
                        ? never
                        : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                    }[OrderFields]
                : 'Error: If you provide "skip", you also need to provide "orderBy"'
              : ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields]),
    >(
      args: SubsetIntersection<T, WorkspaceKpiSnapshotGroupByArgs, OrderByArg> & InputErrors,
    ): {} extends InputErrors
      ? GetWorkspaceKpiSnapshotGroupByPayload<T>
      : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the WorkspaceKpiSnapshot model
     */
    readonly fields: WorkspaceKpiSnapshotFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for WorkspaceKpiSnapshot.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__WorkspaceKpiSnapshotClient<
    T,
    Null = never,
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise';
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(
      onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null,
      onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null,
    ): $Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(
      onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null,
    ): $Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>;
  }

  /**
   * Fields of the WorkspaceKpiSnapshot model
   */
  interface WorkspaceKpiSnapshotFieldRefs {
    readonly id: FieldRef<'WorkspaceKpiSnapshot', 'String'>;
    readonly workspaceId: FieldRef<'WorkspaceKpiSnapshot', 'String'>;
    readonly openTickets: FieldRef<'WorkspaceKpiSnapshot', 'Int'>;
    readonly resolvedTickets: FieldRef<'WorkspaceKpiSnapshot', 'Int'>;
    readonly avgResolutionTimeHours: FieldRef<'WorkspaceKpiSnapshot', 'Float'>;
    readonly capturedAt: FieldRef<'WorkspaceKpiSnapshot', 'DateTime'>;
  }

  // Custom InputTypes
  /**
   * WorkspaceKpiSnapshot findUnique
   */
  export type WorkspaceKpiSnapshotFindUniqueArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the WorkspaceKpiSnapshot
     */
    select?: WorkspaceKpiSnapshotSelect<ExtArgs> | null;
    /**
     * Filter, which WorkspaceKpiSnapshot to fetch.
     */
    where: WorkspaceKpiSnapshotWhereUniqueInput;
  };

  /**
   * WorkspaceKpiSnapshot findUniqueOrThrow
   */
  export type WorkspaceKpiSnapshotFindUniqueOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the WorkspaceKpiSnapshot
     */
    select?: WorkspaceKpiSnapshotSelect<ExtArgs> | null;
    /**
     * Filter, which WorkspaceKpiSnapshot to fetch.
     */
    where: WorkspaceKpiSnapshotWhereUniqueInput;
  };

  /**
   * WorkspaceKpiSnapshot findFirst
   */
  export type WorkspaceKpiSnapshotFindFirstArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the WorkspaceKpiSnapshot
     */
    select?: WorkspaceKpiSnapshotSelect<ExtArgs> | null;
    /**
     * Filter, which WorkspaceKpiSnapshot to fetch.
     */
    where?: WorkspaceKpiSnapshotWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of WorkspaceKpiSnapshots to fetch.
     */
    orderBy?:
      WorkspaceKpiSnapshotOrderByWithRelationInput | WorkspaceKpiSnapshotOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for WorkspaceKpiSnapshots.
     */
    cursor?: WorkspaceKpiSnapshotWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` WorkspaceKpiSnapshots from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` WorkspaceKpiSnapshots.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of WorkspaceKpiSnapshots.
     */
    distinct?: WorkspaceKpiSnapshotScalarFieldEnum | WorkspaceKpiSnapshotScalarFieldEnum[];
  };

  /**
   * WorkspaceKpiSnapshot findFirstOrThrow
   */
  export type WorkspaceKpiSnapshotFindFirstOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the WorkspaceKpiSnapshot
     */
    select?: WorkspaceKpiSnapshotSelect<ExtArgs> | null;
    /**
     * Filter, which WorkspaceKpiSnapshot to fetch.
     */
    where?: WorkspaceKpiSnapshotWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of WorkspaceKpiSnapshots to fetch.
     */
    orderBy?:
      WorkspaceKpiSnapshotOrderByWithRelationInput | WorkspaceKpiSnapshotOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for WorkspaceKpiSnapshots.
     */
    cursor?: WorkspaceKpiSnapshotWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` WorkspaceKpiSnapshots from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` WorkspaceKpiSnapshots.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of WorkspaceKpiSnapshots.
     */
    distinct?: WorkspaceKpiSnapshotScalarFieldEnum | WorkspaceKpiSnapshotScalarFieldEnum[];
  };

  /**
   * WorkspaceKpiSnapshot findMany
   */
  export type WorkspaceKpiSnapshotFindManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the WorkspaceKpiSnapshot
     */
    select?: WorkspaceKpiSnapshotSelect<ExtArgs> | null;
    /**
     * Filter, which WorkspaceKpiSnapshots to fetch.
     */
    where?: WorkspaceKpiSnapshotWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of WorkspaceKpiSnapshots to fetch.
     */
    orderBy?:
      WorkspaceKpiSnapshotOrderByWithRelationInput | WorkspaceKpiSnapshotOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing WorkspaceKpiSnapshots.
     */
    cursor?: WorkspaceKpiSnapshotWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` WorkspaceKpiSnapshots from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` WorkspaceKpiSnapshots.
     */
    skip?: number;
    distinct?: WorkspaceKpiSnapshotScalarFieldEnum | WorkspaceKpiSnapshotScalarFieldEnum[];
  };

  /**
   * WorkspaceKpiSnapshot create
   */
  export type WorkspaceKpiSnapshotCreateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the WorkspaceKpiSnapshot
     */
    select?: WorkspaceKpiSnapshotSelect<ExtArgs> | null;
    /**
     * The data needed to create a WorkspaceKpiSnapshot.
     */
    data: XOR<WorkspaceKpiSnapshotCreateInput, WorkspaceKpiSnapshotUncheckedCreateInput>;
  };

  /**
   * WorkspaceKpiSnapshot createMany
   */
  export type WorkspaceKpiSnapshotCreateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to create many WorkspaceKpiSnapshots.
     */
    data: WorkspaceKpiSnapshotCreateManyInput | WorkspaceKpiSnapshotCreateManyInput[];
    skipDuplicates?: boolean;
  };

  /**
   * WorkspaceKpiSnapshot createManyAndReturn
   */
  export type WorkspaceKpiSnapshotCreateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the WorkspaceKpiSnapshot
     */
    select?: WorkspaceKpiSnapshotSelectCreateManyAndReturn<ExtArgs> | null;
    /**
     * The data used to create many WorkspaceKpiSnapshots.
     */
    data: WorkspaceKpiSnapshotCreateManyInput | WorkspaceKpiSnapshotCreateManyInput[];
    skipDuplicates?: boolean;
  };

  /**
   * WorkspaceKpiSnapshot update
   */
  export type WorkspaceKpiSnapshotUpdateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the WorkspaceKpiSnapshot
     */
    select?: WorkspaceKpiSnapshotSelect<ExtArgs> | null;
    /**
     * The data needed to update a WorkspaceKpiSnapshot.
     */
    data: XOR<WorkspaceKpiSnapshotUpdateInput, WorkspaceKpiSnapshotUncheckedUpdateInput>;
    /**
     * Choose, which WorkspaceKpiSnapshot to update.
     */
    where: WorkspaceKpiSnapshotWhereUniqueInput;
  };

  /**
   * WorkspaceKpiSnapshot updateMany
   */
  export type WorkspaceKpiSnapshotUpdateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to update WorkspaceKpiSnapshots.
     */
    data: XOR<
      WorkspaceKpiSnapshotUpdateManyMutationInput,
      WorkspaceKpiSnapshotUncheckedUpdateManyInput
    >;
    /**
     * Filter which WorkspaceKpiSnapshots to update
     */
    where?: WorkspaceKpiSnapshotWhereInput;
  };

  /**
   * WorkspaceKpiSnapshot upsert
   */
  export type WorkspaceKpiSnapshotUpsertArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the WorkspaceKpiSnapshot
     */
    select?: WorkspaceKpiSnapshotSelect<ExtArgs> | null;
    /**
     * The filter to search for the WorkspaceKpiSnapshot to update in case it exists.
     */
    where: WorkspaceKpiSnapshotWhereUniqueInput;
    /**
     * In case the WorkspaceKpiSnapshot found by the `where` argument doesn't exist, create a new WorkspaceKpiSnapshot with this data.
     */
    create: XOR<WorkspaceKpiSnapshotCreateInput, WorkspaceKpiSnapshotUncheckedCreateInput>;
    /**
     * In case the WorkspaceKpiSnapshot was found with the provided `where` argument, update it with this data.
     */
    update: XOR<WorkspaceKpiSnapshotUpdateInput, WorkspaceKpiSnapshotUncheckedUpdateInput>;
  };

  /**
   * WorkspaceKpiSnapshot delete
   */
  export type WorkspaceKpiSnapshotDeleteArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the WorkspaceKpiSnapshot
     */
    select?: WorkspaceKpiSnapshotSelect<ExtArgs> | null;
    /**
     * Filter which WorkspaceKpiSnapshot to delete.
     */
    where: WorkspaceKpiSnapshotWhereUniqueInput;
  };

  /**
   * WorkspaceKpiSnapshot deleteMany
   */
  export type WorkspaceKpiSnapshotDeleteManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which WorkspaceKpiSnapshots to delete
     */
    where?: WorkspaceKpiSnapshotWhereInput;
  };

  /**
   * WorkspaceKpiSnapshot without action
   */
  export type WorkspaceKpiSnapshotDefaultArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the WorkspaceKpiSnapshot
     */
    select?: WorkspaceKpiSnapshotSelect<ExtArgs> | null;
  };

  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted';
    ReadCommitted: 'ReadCommitted';
    RepeatableRead: 'RepeatableRead';
    Serializable: 'Serializable';
  };

  export type TransactionIsolationLevel =
    (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel];

  export const TicketMetricDailyScalarFieldEnum: {
    id: 'id';
    workspaceId: 'workspaceId';
    date: 'date';
    openCount: 'openCount';
    createdCount: 'createdCount';
    resolvedCount: 'resolvedCount';
    createdAt: 'createdAt';
    updatedAt: 'updatedAt';
  };

  export type TicketMetricDailyScalarFieldEnum =
    (typeof TicketMetricDailyScalarFieldEnum)[keyof typeof TicketMetricDailyScalarFieldEnum];

  export const WorkspaceKpiSnapshotScalarFieldEnum: {
    id: 'id';
    workspaceId: 'workspaceId';
    openTickets: 'openTickets';
    resolvedTickets: 'resolvedTickets';
    avgResolutionTimeHours: 'avgResolutionTimeHours';
    capturedAt: 'capturedAt';
  };

  export type WorkspaceKpiSnapshotScalarFieldEnum =
    (typeof WorkspaceKpiSnapshotScalarFieldEnum)[keyof typeof WorkspaceKpiSnapshotScalarFieldEnum];

  export const SortOrder: {
    asc: 'asc';
    desc: 'desc';
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder];

  export const QueryMode: {
    default: 'default';
    insensitive: 'insensitive';
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode];

  /**
   * Field references
   */

  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>;

  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>;

  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>;

  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<
    $PrismaModel,
    'DateTime[]'
  >;

  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>;

  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>;

  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>;

  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>;

  /**
   * Deep Input Types
   */

  export type TicketMetricDailyWhereInput = {
    AND?: TicketMetricDailyWhereInput | TicketMetricDailyWhereInput[];
    OR?: TicketMetricDailyWhereInput[];
    NOT?: TicketMetricDailyWhereInput | TicketMetricDailyWhereInput[];
    id?: UuidFilter<'TicketMetricDaily'> | string;
    workspaceId?: UuidFilter<'TicketMetricDaily'> | string;
    date?: DateTimeFilter<'TicketMetricDaily'> | Date | string;
    openCount?: IntFilter<'TicketMetricDaily'> | number;
    createdCount?: IntFilter<'TicketMetricDaily'> | number;
    resolvedCount?: IntFilter<'TicketMetricDaily'> | number;
    createdAt?: DateTimeFilter<'TicketMetricDaily'> | Date | string;
    updatedAt?: DateTimeFilter<'TicketMetricDaily'> | Date | string;
  };

  export type TicketMetricDailyOrderByWithRelationInput = {
    id?: SortOrder;
    workspaceId?: SortOrder;
    date?: SortOrder;
    openCount?: SortOrder;
    createdCount?: SortOrder;
    resolvedCount?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
  };

  export type TicketMetricDailyWhereUniqueInput = Prisma.AtLeast<
    {
      id?: string;
      workspaceId_date?: TicketMetricDailyWorkspaceIdDateCompoundUniqueInput;
      AND?: TicketMetricDailyWhereInput | TicketMetricDailyWhereInput[];
      OR?: TicketMetricDailyWhereInput[];
      NOT?: TicketMetricDailyWhereInput | TicketMetricDailyWhereInput[];
      workspaceId?: UuidFilter<'TicketMetricDaily'> | string;
      date?: DateTimeFilter<'TicketMetricDaily'> | Date | string;
      openCount?: IntFilter<'TicketMetricDaily'> | number;
      createdCount?: IntFilter<'TicketMetricDaily'> | number;
      resolvedCount?: IntFilter<'TicketMetricDaily'> | number;
      createdAt?: DateTimeFilter<'TicketMetricDaily'> | Date | string;
      updatedAt?: DateTimeFilter<'TicketMetricDaily'> | Date | string;
    },
    'id' | 'workspaceId_date'
  >;

  export type TicketMetricDailyOrderByWithAggregationInput = {
    id?: SortOrder;
    workspaceId?: SortOrder;
    date?: SortOrder;
    openCount?: SortOrder;
    createdCount?: SortOrder;
    resolvedCount?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
    _count?: TicketMetricDailyCountOrderByAggregateInput;
    _avg?: TicketMetricDailyAvgOrderByAggregateInput;
    _max?: TicketMetricDailyMaxOrderByAggregateInput;
    _min?: TicketMetricDailyMinOrderByAggregateInput;
    _sum?: TicketMetricDailySumOrderByAggregateInput;
  };

  export type TicketMetricDailyScalarWhereWithAggregatesInput = {
    AND?:
      | TicketMetricDailyScalarWhereWithAggregatesInput
      | TicketMetricDailyScalarWhereWithAggregatesInput[];
    OR?: TicketMetricDailyScalarWhereWithAggregatesInput[];
    NOT?:
      | TicketMetricDailyScalarWhereWithAggregatesInput
      | TicketMetricDailyScalarWhereWithAggregatesInput[];
    id?: UuidWithAggregatesFilter<'TicketMetricDaily'> | string;
    workspaceId?: UuidWithAggregatesFilter<'TicketMetricDaily'> | string;
    date?: DateTimeWithAggregatesFilter<'TicketMetricDaily'> | Date | string;
    openCount?: IntWithAggregatesFilter<'TicketMetricDaily'> | number;
    createdCount?: IntWithAggregatesFilter<'TicketMetricDaily'> | number;
    resolvedCount?: IntWithAggregatesFilter<'TicketMetricDaily'> | number;
    createdAt?: DateTimeWithAggregatesFilter<'TicketMetricDaily'> | Date | string;
    updatedAt?: DateTimeWithAggregatesFilter<'TicketMetricDaily'> | Date | string;
  };

  export type WorkspaceKpiSnapshotWhereInput = {
    AND?: WorkspaceKpiSnapshotWhereInput | WorkspaceKpiSnapshotWhereInput[];
    OR?: WorkspaceKpiSnapshotWhereInput[];
    NOT?: WorkspaceKpiSnapshotWhereInput | WorkspaceKpiSnapshotWhereInput[];
    id?: UuidFilter<'WorkspaceKpiSnapshot'> | string;
    workspaceId?: UuidFilter<'WorkspaceKpiSnapshot'> | string;
    openTickets?: IntFilter<'WorkspaceKpiSnapshot'> | number;
    resolvedTickets?: IntFilter<'WorkspaceKpiSnapshot'> | number;
    avgResolutionTimeHours?: FloatFilter<'WorkspaceKpiSnapshot'> | number;
    capturedAt?: DateTimeFilter<'WorkspaceKpiSnapshot'> | Date | string;
  };

  export type WorkspaceKpiSnapshotOrderByWithRelationInput = {
    id?: SortOrder;
    workspaceId?: SortOrder;
    openTickets?: SortOrder;
    resolvedTickets?: SortOrder;
    avgResolutionTimeHours?: SortOrder;
    capturedAt?: SortOrder;
  };

  export type WorkspaceKpiSnapshotWhereUniqueInput = Prisma.AtLeast<
    {
      id?: string;
      AND?: WorkspaceKpiSnapshotWhereInput | WorkspaceKpiSnapshotWhereInput[];
      OR?: WorkspaceKpiSnapshotWhereInput[];
      NOT?: WorkspaceKpiSnapshotWhereInput | WorkspaceKpiSnapshotWhereInput[];
      workspaceId?: UuidFilter<'WorkspaceKpiSnapshot'> | string;
      openTickets?: IntFilter<'WorkspaceKpiSnapshot'> | number;
      resolvedTickets?: IntFilter<'WorkspaceKpiSnapshot'> | number;
      avgResolutionTimeHours?: FloatFilter<'WorkspaceKpiSnapshot'> | number;
      capturedAt?: DateTimeFilter<'WorkspaceKpiSnapshot'> | Date | string;
    },
    'id'
  >;

  export type WorkspaceKpiSnapshotOrderByWithAggregationInput = {
    id?: SortOrder;
    workspaceId?: SortOrder;
    openTickets?: SortOrder;
    resolvedTickets?: SortOrder;
    avgResolutionTimeHours?: SortOrder;
    capturedAt?: SortOrder;
    _count?: WorkspaceKpiSnapshotCountOrderByAggregateInput;
    _avg?: WorkspaceKpiSnapshotAvgOrderByAggregateInput;
    _max?: WorkspaceKpiSnapshotMaxOrderByAggregateInput;
    _min?: WorkspaceKpiSnapshotMinOrderByAggregateInput;
    _sum?: WorkspaceKpiSnapshotSumOrderByAggregateInput;
  };

  export type WorkspaceKpiSnapshotScalarWhereWithAggregatesInput = {
    AND?:
      | WorkspaceKpiSnapshotScalarWhereWithAggregatesInput
      | WorkspaceKpiSnapshotScalarWhereWithAggregatesInput[];
    OR?: WorkspaceKpiSnapshotScalarWhereWithAggregatesInput[];
    NOT?:
      | WorkspaceKpiSnapshotScalarWhereWithAggregatesInput
      | WorkspaceKpiSnapshotScalarWhereWithAggregatesInput[];
    id?: UuidWithAggregatesFilter<'WorkspaceKpiSnapshot'> | string;
    workspaceId?: UuidWithAggregatesFilter<'WorkspaceKpiSnapshot'> | string;
    openTickets?: IntWithAggregatesFilter<'WorkspaceKpiSnapshot'> | number;
    resolvedTickets?: IntWithAggregatesFilter<'WorkspaceKpiSnapshot'> | number;
    avgResolutionTimeHours?: FloatWithAggregatesFilter<'WorkspaceKpiSnapshot'> | number;
    capturedAt?: DateTimeWithAggregatesFilter<'WorkspaceKpiSnapshot'> | Date | string;
  };

  export type TicketMetricDailyCreateInput = {
    id?: string;
    workspaceId: string;
    date: Date | string;
    openCount: number;
    createdCount: number;
    resolvedCount: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
  };

  export type TicketMetricDailyUncheckedCreateInput = {
    id?: string;
    workspaceId: string;
    date: Date | string;
    openCount: number;
    createdCount: number;
    resolvedCount: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
  };

  export type TicketMetricDailyUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    workspaceId?: StringFieldUpdateOperationsInput | string;
    date?: DateTimeFieldUpdateOperationsInput | Date | string;
    openCount?: IntFieldUpdateOperationsInput | number;
    createdCount?: IntFieldUpdateOperationsInput | number;
    resolvedCount?: IntFieldUpdateOperationsInput | number;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type TicketMetricDailyUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    workspaceId?: StringFieldUpdateOperationsInput | string;
    date?: DateTimeFieldUpdateOperationsInput | Date | string;
    openCount?: IntFieldUpdateOperationsInput | number;
    createdCount?: IntFieldUpdateOperationsInput | number;
    resolvedCount?: IntFieldUpdateOperationsInput | number;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type TicketMetricDailyCreateManyInput = {
    id?: string;
    workspaceId: string;
    date: Date | string;
    openCount: number;
    createdCount: number;
    resolvedCount: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
  };

  export type TicketMetricDailyUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string;
    workspaceId?: StringFieldUpdateOperationsInput | string;
    date?: DateTimeFieldUpdateOperationsInput | Date | string;
    openCount?: IntFieldUpdateOperationsInput | number;
    createdCount?: IntFieldUpdateOperationsInput | number;
    resolvedCount?: IntFieldUpdateOperationsInput | number;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type TicketMetricDailyUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string;
    workspaceId?: StringFieldUpdateOperationsInput | string;
    date?: DateTimeFieldUpdateOperationsInput | Date | string;
    openCount?: IntFieldUpdateOperationsInput | number;
    createdCount?: IntFieldUpdateOperationsInput | number;
    resolvedCount?: IntFieldUpdateOperationsInput | number;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type WorkspaceKpiSnapshotCreateInput = {
    id?: string;
    workspaceId: string;
    openTickets: number;
    resolvedTickets: number;
    avgResolutionTimeHours: number;
    capturedAt?: Date | string;
  };

  export type WorkspaceKpiSnapshotUncheckedCreateInput = {
    id?: string;
    workspaceId: string;
    openTickets: number;
    resolvedTickets: number;
    avgResolutionTimeHours: number;
    capturedAt?: Date | string;
  };

  export type WorkspaceKpiSnapshotUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    workspaceId?: StringFieldUpdateOperationsInput | string;
    openTickets?: IntFieldUpdateOperationsInput | number;
    resolvedTickets?: IntFieldUpdateOperationsInput | number;
    avgResolutionTimeHours?: FloatFieldUpdateOperationsInput | number;
    capturedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type WorkspaceKpiSnapshotUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    workspaceId?: StringFieldUpdateOperationsInput | string;
    openTickets?: IntFieldUpdateOperationsInput | number;
    resolvedTickets?: IntFieldUpdateOperationsInput | number;
    avgResolutionTimeHours?: FloatFieldUpdateOperationsInput | number;
    capturedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type WorkspaceKpiSnapshotCreateManyInput = {
    id?: string;
    workspaceId: string;
    openTickets: number;
    resolvedTickets: number;
    avgResolutionTimeHours: number;
    capturedAt?: Date | string;
  };

  export type WorkspaceKpiSnapshotUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string;
    workspaceId?: StringFieldUpdateOperationsInput | string;
    openTickets?: IntFieldUpdateOperationsInput | number;
    resolvedTickets?: IntFieldUpdateOperationsInput | number;
    avgResolutionTimeHours?: FloatFieldUpdateOperationsInput | number;
    capturedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type WorkspaceKpiSnapshotUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string;
    workspaceId?: StringFieldUpdateOperationsInput | string;
    openTickets?: IntFieldUpdateOperationsInput | number;
    resolvedTickets?: IntFieldUpdateOperationsInput | number;
    avgResolutionTimeHours?: FloatFieldUpdateOperationsInput | number;
    capturedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type UuidFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>;
    in?: string[] | ListStringFieldRefInput<$PrismaModel>;
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>;
    lt?: string | StringFieldRefInput<$PrismaModel>;
    lte?: string | StringFieldRefInput<$PrismaModel>;
    gt?: string | StringFieldRefInput<$PrismaModel>;
    gte?: string | StringFieldRefInput<$PrismaModel>;
    mode?: QueryMode;
    not?: NestedUuidFilter<$PrismaModel> | string;
  };

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>;
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>;
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string;
  };

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>;
    in?: number[] | ListIntFieldRefInput<$PrismaModel>;
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>;
    lt?: number | IntFieldRefInput<$PrismaModel>;
    lte?: number | IntFieldRefInput<$PrismaModel>;
    gt?: number | IntFieldRefInput<$PrismaModel>;
    gte?: number | IntFieldRefInput<$PrismaModel>;
    not?: NestedIntFilter<$PrismaModel> | number;
  };

  export type TicketMetricDailyWorkspaceIdDateCompoundUniqueInput = {
    workspaceId: string;
    date: Date | string;
  };

  export type TicketMetricDailyCountOrderByAggregateInput = {
    id?: SortOrder;
    workspaceId?: SortOrder;
    date?: SortOrder;
    openCount?: SortOrder;
    createdCount?: SortOrder;
    resolvedCount?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
  };

  export type TicketMetricDailyAvgOrderByAggregateInput = {
    openCount?: SortOrder;
    createdCount?: SortOrder;
    resolvedCount?: SortOrder;
  };

  export type TicketMetricDailyMaxOrderByAggregateInput = {
    id?: SortOrder;
    workspaceId?: SortOrder;
    date?: SortOrder;
    openCount?: SortOrder;
    createdCount?: SortOrder;
    resolvedCount?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
  };

  export type TicketMetricDailyMinOrderByAggregateInput = {
    id?: SortOrder;
    workspaceId?: SortOrder;
    date?: SortOrder;
    openCount?: SortOrder;
    createdCount?: SortOrder;
    resolvedCount?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
  };

  export type TicketMetricDailySumOrderByAggregateInput = {
    openCount?: SortOrder;
    createdCount?: SortOrder;
    resolvedCount?: SortOrder;
  };

  export type UuidWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>;
    in?: string[] | ListStringFieldRefInput<$PrismaModel>;
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>;
    lt?: string | StringFieldRefInput<$PrismaModel>;
    lte?: string | StringFieldRefInput<$PrismaModel>;
    gt?: string | StringFieldRefInput<$PrismaModel>;
    gte?: string | StringFieldRefInput<$PrismaModel>;
    mode?: QueryMode;
    not?: NestedUuidWithAggregatesFilter<$PrismaModel> | string;
    _count?: NestedIntFilter<$PrismaModel>;
    _min?: NestedStringFilter<$PrismaModel>;
    _max?: NestedStringFilter<$PrismaModel>;
  };

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>;
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>;
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string;
    _count?: NestedIntFilter<$PrismaModel>;
    _min?: NestedDateTimeFilter<$PrismaModel>;
    _max?: NestedDateTimeFilter<$PrismaModel>;
  };

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>;
    in?: number[] | ListIntFieldRefInput<$PrismaModel>;
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>;
    lt?: number | IntFieldRefInput<$PrismaModel>;
    lte?: number | IntFieldRefInput<$PrismaModel>;
    gt?: number | IntFieldRefInput<$PrismaModel>;
    gte?: number | IntFieldRefInput<$PrismaModel>;
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number;
    _count?: NestedIntFilter<$PrismaModel>;
    _avg?: NestedFloatFilter<$PrismaModel>;
    _sum?: NestedIntFilter<$PrismaModel>;
    _min?: NestedIntFilter<$PrismaModel>;
    _max?: NestedIntFilter<$PrismaModel>;
  };

  export type FloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>;
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>;
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>;
    lt?: number | FloatFieldRefInput<$PrismaModel>;
    lte?: number | FloatFieldRefInput<$PrismaModel>;
    gt?: number | FloatFieldRefInput<$PrismaModel>;
    gte?: number | FloatFieldRefInput<$PrismaModel>;
    not?: NestedFloatFilter<$PrismaModel> | number;
  };

  export type WorkspaceKpiSnapshotCountOrderByAggregateInput = {
    id?: SortOrder;
    workspaceId?: SortOrder;
    openTickets?: SortOrder;
    resolvedTickets?: SortOrder;
    avgResolutionTimeHours?: SortOrder;
    capturedAt?: SortOrder;
  };

  export type WorkspaceKpiSnapshotAvgOrderByAggregateInput = {
    openTickets?: SortOrder;
    resolvedTickets?: SortOrder;
    avgResolutionTimeHours?: SortOrder;
  };

  export type WorkspaceKpiSnapshotMaxOrderByAggregateInput = {
    id?: SortOrder;
    workspaceId?: SortOrder;
    openTickets?: SortOrder;
    resolvedTickets?: SortOrder;
    avgResolutionTimeHours?: SortOrder;
    capturedAt?: SortOrder;
  };

  export type WorkspaceKpiSnapshotMinOrderByAggregateInput = {
    id?: SortOrder;
    workspaceId?: SortOrder;
    openTickets?: SortOrder;
    resolvedTickets?: SortOrder;
    avgResolutionTimeHours?: SortOrder;
    capturedAt?: SortOrder;
  };

  export type WorkspaceKpiSnapshotSumOrderByAggregateInput = {
    openTickets?: SortOrder;
    resolvedTickets?: SortOrder;
    avgResolutionTimeHours?: SortOrder;
  };

  export type FloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>;
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>;
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>;
    lt?: number | FloatFieldRefInput<$PrismaModel>;
    lte?: number | FloatFieldRefInput<$PrismaModel>;
    gt?: number | FloatFieldRefInput<$PrismaModel>;
    gte?: number | FloatFieldRefInput<$PrismaModel>;
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number;
    _count?: NestedIntFilter<$PrismaModel>;
    _avg?: NestedFloatFilter<$PrismaModel>;
    _sum?: NestedFloatFilter<$PrismaModel>;
    _min?: NestedFloatFilter<$PrismaModel>;
    _max?: NestedFloatFilter<$PrismaModel>;
  };

  export type StringFieldUpdateOperationsInput = {
    set?: string;
  };

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string;
  };

  export type IntFieldUpdateOperationsInput = {
    set?: number;
    increment?: number;
    decrement?: number;
    multiply?: number;
    divide?: number;
  };

  export type FloatFieldUpdateOperationsInput = {
    set?: number;
    increment?: number;
    decrement?: number;
    multiply?: number;
    divide?: number;
  };

  export type NestedUuidFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>;
    in?: string[] | ListStringFieldRefInput<$PrismaModel>;
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>;
    lt?: string | StringFieldRefInput<$PrismaModel>;
    lte?: string | StringFieldRefInput<$PrismaModel>;
    gt?: string | StringFieldRefInput<$PrismaModel>;
    gte?: string | StringFieldRefInput<$PrismaModel>;
    not?: NestedUuidFilter<$PrismaModel> | string;
  };

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>;
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>;
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string;
  };

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>;
    in?: number[] | ListIntFieldRefInput<$PrismaModel>;
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>;
    lt?: number | IntFieldRefInput<$PrismaModel>;
    lte?: number | IntFieldRefInput<$PrismaModel>;
    gt?: number | IntFieldRefInput<$PrismaModel>;
    gte?: number | IntFieldRefInput<$PrismaModel>;
    not?: NestedIntFilter<$PrismaModel> | number;
  };

  export type NestedUuidWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>;
    in?: string[] | ListStringFieldRefInput<$PrismaModel>;
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>;
    lt?: string | StringFieldRefInput<$PrismaModel>;
    lte?: string | StringFieldRefInput<$PrismaModel>;
    gt?: string | StringFieldRefInput<$PrismaModel>;
    gte?: string | StringFieldRefInput<$PrismaModel>;
    not?: NestedUuidWithAggregatesFilter<$PrismaModel> | string;
    _count?: NestedIntFilter<$PrismaModel>;
    _min?: NestedStringFilter<$PrismaModel>;
    _max?: NestedStringFilter<$PrismaModel>;
  };

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>;
    in?: string[] | ListStringFieldRefInput<$PrismaModel>;
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>;
    lt?: string | StringFieldRefInput<$PrismaModel>;
    lte?: string | StringFieldRefInput<$PrismaModel>;
    gt?: string | StringFieldRefInput<$PrismaModel>;
    gte?: string | StringFieldRefInput<$PrismaModel>;
    contains?: string | StringFieldRefInput<$PrismaModel>;
    startsWith?: string | StringFieldRefInput<$PrismaModel>;
    endsWith?: string | StringFieldRefInput<$PrismaModel>;
    not?: NestedStringFilter<$PrismaModel> | string;
  };

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>;
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>;
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string;
    _count?: NestedIntFilter<$PrismaModel>;
    _min?: NestedDateTimeFilter<$PrismaModel>;
    _max?: NestedDateTimeFilter<$PrismaModel>;
  };

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>;
    in?: number[] | ListIntFieldRefInput<$PrismaModel>;
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>;
    lt?: number | IntFieldRefInput<$PrismaModel>;
    lte?: number | IntFieldRefInput<$PrismaModel>;
    gt?: number | IntFieldRefInput<$PrismaModel>;
    gte?: number | IntFieldRefInput<$PrismaModel>;
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number;
    _count?: NestedIntFilter<$PrismaModel>;
    _avg?: NestedFloatFilter<$PrismaModel>;
    _sum?: NestedIntFilter<$PrismaModel>;
    _min?: NestedIntFilter<$PrismaModel>;
    _max?: NestedIntFilter<$PrismaModel>;
  };

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>;
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>;
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>;
    lt?: number | FloatFieldRefInput<$PrismaModel>;
    lte?: number | FloatFieldRefInput<$PrismaModel>;
    gt?: number | FloatFieldRefInput<$PrismaModel>;
    gte?: number | FloatFieldRefInput<$PrismaModel>;
    not?: NestedFloatFilter<$PrismaModel> | number;
  };

  export type NestedFloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>;
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>;
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>;
    lt?: number | FloatFieldRefInput<$PrismaModel>;
    lte?: number | FloatFieldRefInput<$PrismaModel>;
    gt?: number | FloatFieldRefInput<$PrismaModel>;
    gte?: number | FloatFieldRefInput<$PrismaModel>;
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number;
    _count?: NestedIntFilter<$PrismaModel>;
    _avg?: NestedFloatFilter<$PrismaModel>;
    _sum?: NestedFloatFilter<$PrismaModel>;
    _min?: NestedFloatFilter<$PrismaModel>;
    _max?: NestedFloatFilter<$PrismaModel>;
  };

  /**
   * Aliases for legacy arg types
   */
  /**
   * @deprecated Use TicketMetricDailyDefaultArgs instead
   */
  export type TicketMetricDailyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = TicketMetricDailyDefaultArgs<ExtArgs>;
  /**
   * @deprecated Use WorkspaceKpiSnapshotDefaultArgs instead
   */
  export type WorkspaceKpiSnapshotArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = WorkspaceKpiSnapshotDefaultArgs<ExtArgs>;

  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number;
  };

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF;
}
