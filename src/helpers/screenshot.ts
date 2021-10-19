import { Options } from "html-to-image/es/options";
import { toPng } from "html-to-image";

export const download = (
  ref: any, //React.RefObject<HTMLElement>,
  name: string,
  options?: Options,
) => {
  toPng(ref, { cacheBust: true, pixelRatio: 1, quality: 1, ...options })
    .then((dataUrl) => {
      const link = document.createElement("a");
      link.download = `${name}.png`;
      link.href = dataUrl;
      link.click();
    })
    .catch((err) => {
      console.log(err);
    });
};
