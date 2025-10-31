declare module "cookie" {
  export function parse(
    str: string,
    options?: { decode?: (value: string) => string }
  ): Record<string, string>;

  export function serialize(
    name: string,
    val: string,
    options?: Record<string, any>
  ): string;
}
