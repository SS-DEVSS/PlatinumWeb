import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {
  getDisplayImageUrl,
  getImageClassName,
  getImageSurfaceClassName,
  onImageErrorFallback,
  shouldUsePlaceholderBackground,
} from '../utils/imagePlaceholder';

type CardProductProps = {
  image: string;
  title: string;
  texto: string[];
  href?: string;
};

function CardProduct({ image, title, texto, href }: CardProductProps) {
  const [imageLoadFailed, setImageLoadFailed] = useState(false);

  useEffect(() => {
    setImageLoadFailed(false);
  }, [image]);

  const usePlaceholderStyle = shouldUsePlaceholderBackground(image, imageLoadFailed);

  const content = (
    <article className="flex flex-col items-center shadow border-t text-center rounded-[20px] w-full h-full hover:shadow-lg transition-shadow cursor-pointer overflow-hidden">
      <div className={`w-full border-b h-[350px] flex items-center justify-center ${getImageSurfaceClassName(image, imageLoadFailed, "rounded-t-[20px]")}`}>
        <img
          src={getDisplayImageUrl(image)}
          alt={title}
          className={getImageClassName(image, "w-full h-full object-contain", usePlaceholderStyle)}
          onError={(event) => {
            setImageLoadFailed(true);
            onImageErrorFallback(event);
          }}
        />
      </div>
      <section className="bg-gray-100 w-full flex-1 rounded-b-[20px] flex flex-col min-h-[180px]">
        <h2 className="text-[25px] xl:text-[32px] font-medium pt-6 pb-3 px-4">
          {title}
        </h2>
        <ul className="leading-8 mb-6 flex-1">
          {texto.map((text) => {
            return (
              <li key={text} className="px-4">
                {text}
              </li>
            );
          })}
        </ul>
      </section>
    </article>
  );

  if (href) {
    return <Link to={href} className="h-full">{content}</Link>;
  }

  return content;
}

export default CardProduct;
