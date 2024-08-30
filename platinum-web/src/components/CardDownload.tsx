type CardDownload = {
  title: string;
  content: string;
  type: "web" | "download";
  href: string;
  page: string;
  volantes?: string[];
};

type LinkProps = {
  target: string;
  download: boolean;
};

function CardDownload({
  title,
  content,
  type,
  href,
  page,
  volantes,
}: CardDownload) {
  const linkProps: LinkProps = {
    target: "",
    download: false,
  };
  if (type === "web") {
    linkProps.target = "_blank";
  } else {
    linkProps.download = true;
  }

  const getColor = (page: string) => {
    switch (page) {
      case "delphi":
        return "bg-azul_delphi";
      case "platinum":
        return "bg-naranja";
      case "pastillas":
        return "bg-azul_pastillas";
    }
  };

  const getColorBg = (page: string) => {
    return page === "platinum" ? "bg-[#FFFFFF]" : "bg-[#F4F4F4]";
  };

  return (
    <main
      className={`${getColorBg(
        page
      )} shadow-xl text-center w-full max-w-[750px] rounded-2xl`}
    >
      {!volantes ? (
        <a href={href} {...linkProps}>
          <section
            className={`${getColor(
              page
            )} rounded-2xl w-[145px] h-[116px] flex flex-col items-center justify-center mx-auto mt-[-70px]`}
          >
            <img
              src={
                type === "web" ? "/icons/webWhite.png" : "/icons/downloads.png"
              }
              alt="accion"
            />
          </section>
          <h3 className="font-medium text-2xl py-6 px-6 2xl:px-32">{title}</h3>
          <p className="leading-9 text-[#4C4C4C] pb-10 px-6 2xl:px-32">
            {content}
          </p>
        </a>
      ) : (
        <>
          <section
            className={`${getColor(
              page
            )} rounded-2xl w-[145px] h-[116px] flex flex-col items-center justify-center mx-auto mt-[-70px]`}
          >
            <img
              src={
                type === "web" ? "/icons/webWhite.png" : "/icons/downloads.png"
              }
              alt="accion"
            />
          </section>
          <h3 className="font-medium text-2xl py-6 px-6 2xl:px-32">{title}</h3>
          <p className="leading-9 text-[#4C4C4C] pb-10 px-6 2xl:px-32">
            {content}
          </p>
          {volantes && (
            <section
              className={`
              bg-gris_oscuro rounded-b-2xl text-white uppercase py-2 font-bold`}
            >
              <p>Proximamente</p>
            </section>
          )}
        </>
      )}
    </main>
  );
}

export default CardDownload;
