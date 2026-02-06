import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { geocodeEndereco, getEstadoCoordenadas } from '../lib/geocoding';

export function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        navigate('/entrar');
        return;
      }

      // Verificar se o criador já existe (o trigger handle_new_user() já cria automaticamente)
      const { data: criador } = await supabase
        .from('criadores')
        .select('*')
        .eq('user_id', session.user.id)
        .single();

      if (criador) {
        // Se não tem coordenadas, tentar geocodificar com base na cidade/estado
        if ((!criador.latitude || criador.latitude === 0) && (criador.cidade || criador.estado)) {
          const geoResult = await geocodeEndereco({
            cidade: criador.cidade,
            estado: criador.estado,
          });
          if (geoResult) {
            await supabase.from('criadores')
              .update({ latitude: geoResult.latitude, longitude: geoResult.longitude })
              .eq('id', criador.id);
          } else if (criador.estado) {
            const estadoCoords = getEstadoCoordenadas(criador.estado);
            await supabase.from('criadores')
              .update({ latitude: estadoCoords.latitude, longitude: estadoCoords.longitude })
              .eq('id', criador.id);
          }
        }

        // Atualizar avatar se vier do OAuth e não tiver no perfil
        const oauthAvatar = session.user.user_metadata?.avatar_url;
        if (oauthAvatar && !criador.avatar_url) {
          await supabase.from('criadores')
            .update({ avatar_url: oauthAvatar })
            .eq('id', criador.id);
        }
      }

      navigate('/meu-perfil');
    };

    handleCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin w-12 h-12 border-4 border-[var(--asf-green)] border-t-transparent rounded-full mx-auto mb-4" />
        <p className="text-[var(--asf-gray-medium)]">Processando login...</p>
      </div>
    </div>
  );
}
