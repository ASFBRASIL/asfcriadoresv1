export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      avaliacoes: {
        Row: {
          autor_avatar: string | null
          autor_id: string
          autor_nome: string
          comentario: string | null
          created_at: string | null
          criador_id: string
          id: string
          nota: number
        }
        Insert: {
          autor_avatar?: string | null
          autor_id: string
          autor_nome: string
          comentario?: string | null
          created_at?: string | null
          criador_id: string
          id?: string
          nota: number
        }
        Update: {
          autor_avatar?: string | null
          autor_id?: string
          autor_nome?: string
          comentario?: string | null
          created_at?: string | null
          criador_id?: string
          id?: string
          nota?: number
        }
        Relationships: [
          {
            foreignKeyName: "avaliacoes_criador_id_fkey"
            columns: ["criador_id"]
            isOneToOne: false
            referencedRelation: "criadores"
            referencedColumns: ["id"]
          },
        ]
      }
      contatos: {
        Row: {
          created_at: string
          destinatario_id: string
          id: string
          lido: boolean
          mensagem: string
          remetente_id: string
        }
        Insert: {
          created_at?: string
          destinatario_id: string
          id?: string
          lido?: boolean
          mensagem: string
          remetente_id: string
        }
        Update: {
          created_at?: string
          destinatario_id?: string
          id?: string
          lido?: boolean
          mensagem?: string
          remetente_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "contatos_destinatario_id_fkey"
            columns: ["destinatario_id"]
            isOneToOne: false
            referencedRelation: "criadores"
            referencedColumns: ["id"]
          },
        ]
      }
      criador_especies: {
        Row: {
          created_at: string | null
          criador_id: string
          disponivel: boolean | null
          especie_id: string
          id: string
          observacoes: string | null
          preco: number | null
          quantidade: number | null
        }
        Insert: {
          created_at?: string | null
          criador_id: string
          disponivel?: boolean | null
          especie_id: string
          id?: string
          observacoes?: string | null
          preco?: number | null
          quantidade?: number | null
        }
        Update: {
          created_at?: string | null
          criador_id?: string
          disponivel?: boolean | null
          especie_id?: string
          id?: string
          observacoes?: string | null
          preco?: number | null
          quantidade?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "criador_especies_criador_id_fkey"
            columns: ["criador_id"]
            isOneToOne: false
            referencedRelation: "criadores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "criador_especies_especie_id_fkey"
            columns: ["especie_id"]
            isOneToOne: false
            referencedRelation: "especies"
            referencedColumns: ["id"]
          },
        ]
      }
      criadores: {
        Row: {
          avaliacao_media: number | null
          avatar_url: string | null
          bio: string | null
          cep: string | null
          cidade: string | null
          created_at: string | null
          email: string
          endereco: string | null
          estado: string | null
          id: string
          latitude: number | null
          longitude: number | null
          nome: string
          role: string
          status: string[] | null
          telefone: string | null
          total_avaliacoes: number | null
          updated_at: string | null
          user_id: string
          verificado: boolean | null
          whatsapp: string | null
        }
        Insert: {
          avaliacao_media?: number | null
          avatar_url?: string | null
          bio?: string | null
          cep?: string | null
          cidade?: string | null
          created_at?: string | null
          email: string
          endereco?: string | null
          estado?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          nome: string
          role?: string
          status?: string[] | null
          telefone?: string | null
          total_avaliacoes?: number | null
          updated_at?: string | null
          user_id: string
          verificado?: boolean | null
          whatsapp?: string | null
        }
        Update: {
          avaliacao_media?: number | null
          avatar_url?: string | null
          bio?: string | null
          cep?: string | null
          cidade?: string | null
          created_at?: string | null
          email?: string
          endereco?: string | null
          estado?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          nome?: string
          role?: string
          status?: string[] | null
          telefone?: string | null
          total_avaliacoes?: number | null
          updated_at?: string | null
          user_id?: string
          verificado?: boolean | null
          whatsapp?: string | null
        }
        Relationships: []
      }
      especies: {
        Row: {
          biomas: string[] | null
          caracteristicas: string[] | null
          comportamento: string | null
          conservacao_ameacas: string[] | null
          conservacao_status: string | null
          created_at: string | null
          distribuicao: string[] | null
          familia: string | null
          fontes: string[] | null
          fts: unknown
          genero: string | null
          id: string
          imagem_url: string | null
          manejo_caixa: string | null
          manejo_cuidados: string[] | null
          manejo_dificuldade: string | null
          manejo_temperamento: string | null
          mel_cor: string | null
          mel_descricao: string | null
          mel_producao_anual: string | null
          mel_propriedades: string[] | null
          mel_sabor: string | null
          nome_cientifico: string
          nomes_alternativos: string[] | null
          nomes_populares: string[]
          producao_mel: string | null
          slug: string | null
          status_pesquisa: string | null
          subgenero: string | null
          tamanho: string | null
        }
        Insert: {
          biomas?: string[] | null
          caracteristicas?: string[] | null
          comportamento?: string | null
          conservacao_ameacas?: string[] | null
          conservacao_status?: string | null
          created_at?: string | null
          distribuicao?: string[] | null
          familia?: string | null
          fontes?: string[] | null
          fts?: unknown
          genero?: string | null
          id?: string
          imagem_url?: string | null
          manejo_caixa?: string | null
          manejo_cuidados?: string[] | null
          manejo_dificuldade?: string | null
          manejo_temperamento?: string | null
          mel_cor?: string | null
          mel_descricao?: string | null
          mel_producao_anual?: string | null
          mel_propriedades?: string[] | null
          mel_sabor?: string | null
          nome_cientifico: string
          nomes_alternativos?: string[] | null
          nomes_populares: string[]
          producao_mel?: string | null
          slug?: string | null
          status_pesquisa?: string | null
          subgenero?: string | null
          tamanho?: string | null
        }
        Update: {
          biomas?: string[] | null
          caracteristicas?: string[] | null
          comportamento?: string | null
          conservacao_ameacas?: string[] | null
          conservacao_status?: string | null
          created_at?: string | null
          distribuicao?: string[] | null
          familia?: string | null
          fontes?: string[] | null
          fts?: unknown
          genero?: string | null
          id?: string
          imagem_url?: string | null
          manejo_caixa?: string | null
          manejo_cuidados?: string[] | null
          manejo_dificuldade?: string | null
          manejo_temperamento?: string | null
          mel_cor?: string | null
          mel_descricao?: string | null
          mel_producao_anual?: string | null
          mel_propriedades?: string[] | null
          mel_sabor?: string | null
          nome_cientifico?: string
          nomes_alternativos?: string[] | null
          nomes_populares?: string[]
          producao_mel?: string | null
          slug?: string | null
          status_pesquisa?: string | null
          subgenero?: string | null
          tamanho?: string | null
        }
        Relationships: []
      }
      favoritos: {
        Row: {
          created_at: string | null
          criador_id: string
          id: string
          usuario_id: string
        }
        Insert: {
          created_at?: string | null
          criador_id: string
          id?: string
          usuario_id: string
        }
        Update: {
          created_at?: string | null
          criador_id?: string
          id?: string
          usuario_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "favoritos_criador_id_fkey"
            columns: ["criador_id"]
            isOneToOne: false
            referencedRelation: "criadores"
            referencedColumns: ["id"]
          },
        ]
      }
      notificacoes: {
        Row: {
          created_at: string | null
          id: string
          lida: boolean
          link: string | null
          mensagem: string
          tipo: string
          titulo: string
          usuario_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          lida?: boolean
          link?: string | null
          mensagem: string
          tipo: string
          titulo: string
          usuario_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          lida?: boolean
          link?: string | null
          mensagem?: string
          tipo?: string
          titulo?: string
          usuario_id?: string
        }
        Relationships: []
      }
      site_config: {
        Row: {
          chave: string
          descricao: string | null
          id: string
          tipo: string
          updated_at: string | null
          updated_by: string | null
          valor: Json
        }
        Insert: {
          chave: string
          descricao?: string | null
          id?: string
          tipo?: string
          updated_at?: string | null
          updated_by?: string | null
          valor?: Json
        }
        Update: {
          chave?: string
          descricao?: string | null
          id?: string
          tipo?: string
          updated_at?: string | null
          updated_by?: string | null
          valor?: Json
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      buscar_criadores_proximos: {
        Args: { lat_ref: number; lng_ref: number; raio_km: number }
        Returns: {
          avaliacao_media: number | null
          avatar_url: string | null
          bio: string | null
          cep: string | null
          cidade: string | null
          created_at: string | null
          email: string
          endereco: string | null
          estado: string | null
          id: string
          latitude: number | null
          longitude: number | null
          nome: string
          role: string
          status: string[] | null
          telefone: string | null
          total_avaliacoes: number | null
          updated_at: string | null
          user_id: string
          verificado: boolean | null
          whatsapp: string | null
        }[]
        SetofOptions: {
          from: "*"
          to: "criadores"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      buscar_especies: {
        Args: { termo: string }
        Returns: {
          biomas: string[]
          conservacao_status: string
          genero: string
          id: string
          imagem_url: string
          manejo_dificuldade: string
          nome_cientifico: string
          nomes_alternativos: string[]
          nomes_populares: string[]
          producao_mel: string
          rank: number
          slug: string
          tamanho: string
        }[]
      }
      estatisticas_catalogo: { Args: never; Returns: Json }
      filtrar_especies: {
        Args: {
          p_bioma?: string
          p_conservacao?: string
          p_dificuldade?: string
          p_estado?: string
          p_genero?: string
          p_limit?: number
          p_offset?: number
          p_producao?: string
          p_tamanho?: string
        }
        Returns: {
          biomas: string[]
          conservacao_status: string
          distribuicao: string[]
          genero: string
          id: string
          imagem_url: string
          manejo_dificuldade: string
          nome_cientifico: string
          nomes_populares: string[]
          producao_mel: string
          slug: string
          tamanho: string
          total_count: number
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
