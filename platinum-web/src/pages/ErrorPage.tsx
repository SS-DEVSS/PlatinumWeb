import { useRouteError, isRouteErrorResponse, Link } from "react-router-dom";
import PlatinumLayout from "../Layouts/PlatinumLayout";
import { Button } from "../components/ui/button";
import { AlertCircle, Home } from "lucide-react";

export default function ErrorPage() {
  const error = useRouteError();

  const message = isRouteErrorResponse(error)
    ? error.statusText || error.data?.message || "Algo salió mal"
    : error instanceof Error
      ? error.message
      : "Ha ocurrido un error inesperado";

  return (
    <PlatinumLayout>
      <section className="px-4 sm:px-8 md:px-12 lg:px-20 py-16 min-h-[60vh] flex flex-col items-center justify-center bg-[#E4E4E4]">
        <div className="max-w-md w-full text-center">
          <div className="flex justify-center mb-6">
            <div className="h-16 w-16 rounded-full bg-red-100 flex items-center justify-center">
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
          </div>
          <h1 className="text-xl font-semibold text-gray-900 mb-2">
            Algo salió mal
          </h1>
          <p className="text-gray-600 mb-6">
            {message}
          </p>
          <p className="text-sm text-gray-500 mb-8">
            Puedes intentar de nuevo o volver al inicio.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              asChild
              className="bg-naranja hover:bg-naranja/90 text-white"
            >
              <Link to="/" className="inline-flex items-center gap-2">
                <Home className="h-4 w-4" />
                Ir al inicio
              </Link>
            </Button>
            <Button
              variant="outline"
              onClick={() => window.history.back()}
            >
              Volver atrás
            </Button>
          </div>
        </div>
      </section>
    </PlatinumLayout>
  );
}
