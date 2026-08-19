declare module "*.css" {
  const content: { [className: string]: string };
  export default content;
}

declare module "next" {
  export type Metadata = any;
}

declare module "next/dist/lib/metadata/types/metadata-interface.js" {
  export type Metadata = any;
}

declare module "next/server" {
  export class NextRequest extends Request {
    nextUrl: URL;
    cookies: any;
  }
  export class NextResponse extends Response {
    static json(data: any, init?: ResponseInit): NextResponse;
    static redirect(url: string | URL, status?: number): NextResponse;
    static next(): NextResponse;
    cookies: any;
  }
}

declare module "next/server.js" {
  export * from "next/server";
}

declare module "next/link" {
  import { ComponentProps, ForwardRefExoticComponent, RefAttributes } from "react";
  export interface LinkProps extends ComponentProps<"a"> {
    href: any;
    as?: any;
    replace?: boolean;
    scroll?: boolean;
    shallow?: boolean;
    passHref?: boolean;
    prefetch?: boolean;
    locale?: string | false;
  }
  const Link: ForwardRefExoticComponent<LinkProps & RefAttributes<HTMLAnchorElement>>;
  export default Link;
}

declare module "next/image" {
  import { ComponentProps, ForwardRefExoticComponent, RefAttributes } from "react";
  export interface ImageProps extends ComponentProps<"img"> {
    src: any;
    alt: string;
    width?: number | `${number}`;
    height?: number | `${number}`;
    fill?: boolean;
    loader?: any;
    quality?: number | `${number}`;
    priority?: boolean;
    loading?: "eager" | "lazy";
    placeholder?: "blur" | "empty";
    blurDataURL?: string;
    unoptimized?: boolean;
    onLoadingComplete?: any;
  }
  const Image: ForwardRefExoticComponent<ImageProps & RefAttributes<HTMLImageElement>>;
  export default Image;
}

declare module "next/navigation" {
  export function useRouter(): {
    push(href: string, options?: any): void;
    replace(href: string, options?: any): void;
    refresh(): void;
    back(): void;
    forward(): void;
    prefetch(href: string): void;
  };
  export function usePathname(): string;
  export function useSearchParams(): URLSearchParams;
  export function useParams(): Record<string, string | string[]>;
  export function redirect(url: string): never;
  export function notFound(): never;
}

declare module "next/headers" {
  export function cookies(): {
    get(name: string): { name: string; value: string } | undefined;
    set(name: string, value: string, options?: any): void;
    delete(name: string): void;
  };
}
