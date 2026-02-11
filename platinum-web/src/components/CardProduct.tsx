import { Link } from 'react-router-dom';
import { useState } from 'react';

type CardProductProps = {
  image: string;
  title: string;
  texto: string[];
  href?: string;
};

function CardProduct({ image, title, texto, href }: CardProductProps) {
  const isDefaultImage = !image || 
                         image === '/images/aplicaciones/default.png' || 
                         image.includes('default.png') ||
                         image.trim() === '';
  const imageSrc = image && !isDefaultImage 
    ? (image.startsWith('http') || image.startsWith('/') ? image : `/images/aplicaciones/${image}`)
    : '';
  
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  
  const showPlaceholder = isDefaultImage || imageError;
  
  const content = (
    <article className="flex flex-col items-center shadow border-t text-center rounded-[20px] w-full h-full hover:shadow-lg transition-shadow cursor-pointer">
      <div className="rounded-t-[20px] w-full border-b py-8 px-4 h-[350px] flex items-center justify-center bg-white">
        {!showPlaceholder && imageSrc ? (
          <img
            src={imageSrc}
            alt={title}
            className="w-full h-full object-contain"
            onError={() => setImageError(true)}
            onLoad={() => setImageLoaded(true)}
            style={{ display: imageLoaded ? 'block' : 'none' }}
          />
        ) : null}
        {showPlaceholder && (
          <div className="w-full h-full flex flex-col items-center justify-center">
            <svg
              className="w-24 h-24 text-gray-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span className="text-gray-400 text-sm mt-2">Sin imagen</span>
          </div>
        )}
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
