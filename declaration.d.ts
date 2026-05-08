/**
 * By adding that declarations.d.ts file, you are essentially providing TypeScript with a translation dictionary that says: "Whenever you see a file ending in .css, just treat it as an object. Don't try to read the code inside, just trust me that it exists."
 */

declare module "*.css" {
  const content: { [className: string]: string };
  export default content;
}
