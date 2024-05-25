import { createDirectus ,staticToken, rest} from "@directus/sdk";

export const directus = createDirectus(process.env.NEXT_PUBLIC_API_URL as string)
  .with(rest())
  .with(staticToken(process.env.ADMIN_TOKEN as string))
  ;


export const client = createDirectus(process.env.NEXT_PUBLIC_API_URL as string).with(rest());