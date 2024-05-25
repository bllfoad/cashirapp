export function getImageSrc(image: string): string {
    return `${process.env.NEXT_PUBLIC_ASSETS_URL}${image}?key=optmize`;
  }
  export function getImageSrcSvg(image: string): string {
    return `${process.env.NEXT_PUBLIC_ASSETS_URL}${image}.svg?key=optmize`;
  }
  