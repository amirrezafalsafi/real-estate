declare module "*.css";

type Nullish = null | undefined;

type NonUndefined<T> = {
  [K in keyof T as undefined extends T[K] ? never : K]: T[K];
};

type NonUndefinedProps<T> = {
  [K in keyof T as [T[K]] extends [undefined] ? never : K]: T[K];
};

type NonUndefinedUnion<T> = T extends undefined ? never : T;

type ComponentProp<T extends React.ElementType> = {
  component?: T;
};

type PolymorphicComponentProps<T extends React.ElementType, P> = ComponentProp<T> &
  P &
  Omit<React.ComponentPropsWithoutRef<T>, keyof ComponentProp<T> | keyof P>;

type HasRequiredKeys<T> =
  Exclude<
    {
      [K in keyof T]-?: object extends Pick<T, K> ? never : K;
    }[keyof T],
    undefined
  > extends never
    ? false
    : true;
