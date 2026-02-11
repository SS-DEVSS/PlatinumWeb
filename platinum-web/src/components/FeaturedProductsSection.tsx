import { useEffect, useState } from 'react';
import CardProduct from './CardProduct';
import { fetchFeaturedProducts, FeaturedProduct } from '../services/products.api';

const FeaturedProductsSection = () => {
  const [featuredProducts, setFeaturedProducts] = useState<FeaturedProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadFeaturedProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetchFeaturedProducts();
        setFeaturedProducts(response.products);
      } catch (err: any) {
        console.error('Error loading featured products:', err);
        setError('Error al cargar productos destacados');
      } finally {
        setLoading(false);
      }
    };

    loadFeaturedProducts();
  }, []);

  if (loading) {
    return null;
  }

  if (error || featuredProducts.length === 0) {
    return null;
  }

  const formatApplicationText = (product: FeaturedProduct): string[] => {
    const texto: string[] = [];
    const app = product.featuredApplication;
    
    if (!app || !app.attributeValues) {
      return texto;
    }

    const getAttributeValue = (attrName: string) => {
      const attr = app.attributeValues?.find((av: any) =>
        av.attribute?.name === attrName ||
        av.attribute?.name?.toLowerCase() === attrName.toLowerCase()
      );
      if (!attr) return null;
      return attr.valueString || attr.valueNumber || attr.valueBoolean || attr.valueDate;
    };

    const modelo = getAttributeValue('Modelo');
    const submodelo = getAttributeValue('Submodelo');
    const año = getAttributeValue('Año');
    const litrosMotor = getAttributeValue('Litros_Motor');
    const ccMotor = getAttributeValue('CC_Motor');
    const cidMotor = getAttributeValue('CID_Motor');
    const cilindrosMotor = getAttributeValue('Cilindros_Motor');
    const bloqueMotor = getAttributeValue('Bloque_Motor');
    const motorDescripcion = getAttributeValue('Motor_Descripcion');
    const transmision = getAttributeValue('Transmisión') || getAttributeValue('Transmision');

    if (modelo) texto.push(String(modelo));
    if (submodelo) texto.push(String(submodelo));
    if (año) texto.push(String(año));
    if (litrosMotor) texto.push(`${litrosMotor} LTS`);
    if (ccMotor) texto.push(`CC: ${ccMotor}`);
    if (cidMotor) texto.push(`CID: ${cidMotor}`);
    if (cilindrosMotor) texto.push(`${cilindrosMotor} CIL`);
    if (bloqueMotor) texto.push(String(bloqueMotor));
    if (motorDescripcion) texto.push(String(motorDescripcion));
    if (transmision) texto.push(String(transmision));

    return texto;
  };

  const getProductImage = (product: FeaturedProduct): string => {
    if (product.images && product.images.length > 0) {
      const image = product.images[0];
      if (image.url) {
        return image.url;
      }
      if (image.path) {
        return image.path.startsWith('http') ? image.path : `https://${import.meta.env.VITE_S3_BUCKET || 'platinum-driveline-bucket'}.s3.${import.meta.env.VITE_AWS_REGION || 'us-east-1'}.amazonaws.com/${image.path}`;
      }
    }
    return '/images/aplicaciones/default.png';
  };

  return (
    <>
      <h1 className="py-6 lg:py-9">Nuevas Integraciones</h1>
      <section className="grid grid-cols-1 sm:grid-cols-2 nav:grid-cols-3 gap-5 px-6 sm:px-5 xl:px-24 2xl:px-40">
        {featuredProducts.map((product) => (
          <CardProduct
            key={product.id}
            image={getProductImage(product)}
            title={product.sku}
            texto={formatApplicationText(product)}
          />
        ))}
      </section>
    </>
  );
};

export default FeaturedProductsSection;
