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
    PostgrestVersion: "14.5"
  }
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      aclaraciones: {
        Row: {
          autor_id: string
          created_at: string
          id: string
          mensaje: string
          solicitud_id: string
        }
        Insert: {
          autor_id: string
          created_at?: string
          id?: string
          mensaje: string
          solicitud_id: string
        }
        Update: {
          autor_id?: string
          created_at?: string
          id?: string
          mensaje?: string
          solicitud_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "aclaraciones_autor_id_fkey"
            columns: ["autor_id"]
            isOneToOne: false
            referencedRelation: "perfiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "aclaraciones_solicitud_id_fkey"
            columns: ["solicitud_id"]
            isOneToOne: false
            referencedRelation: "solicitudes"
            referencedColumns: ["id"]
          },
        ]
      }
      categorias: {
        Row: {
          created_at: string
          familia_id: string
          icono_url: string | null
          id: string
          nombre: string
          orden: number
          slug: string
        }
        Insert: {
          created_at?: string
          familia_id: string
          icono_url?: string | null
          id?: string
          nombre: string
          orden?: number
          slug: string
        }
        Update: {
          created_at?: string
          familia_id?: string
          icono_url?: string | null
          id?: string
          nombre?: string
          orden?: number
          slug?: string
        }
        Relationships: [
          {
            foreignKeyName: "categorias_familia_id_fkey"
            columns: ["familia_id"]
            isOneToOne: false
            referencedRelation: "familias"
            referencedColumns: ["id"]
          },
        ]
      }
      familias: {
        Row: {
          created_at: string
          icono_url: string | null
          id: string
          nombre: string
          orden: number
          slug: string
        }
        Insert: {
          created_at?: string
          icono_url?: string | null
          id?: string
          nombre: string
          orden?: number
          slug: string
        }
        Update: {
          created_at?: string
          icono_url?: string | null
          id?: string
          nombre?: string
          orden?: number
          slug?: string
        }
        Relationships: []
      }
      reclamaciones_ficha: {
        Row: {
          created_at: string
          email_cuenta: string
          estado: string
          id: string
          mensaje: string | null
          motivo_revision: string | null
          profesional_id: string
          revisada_en: string | null
          user_id: string
        }
        Insert: { profesional_id: string; user_id: string; email_cuenta: string; mensaje?: string | null }
        Update: { estado?: string; motivo_revision?: string | null; revisada_en?: string | null }
        Relationships: []
      }
      interes_destacado: {
        Row: {
          categoria_id: string | null
          created_at: string
          email: string
          id: string
          nombre_negocio: string | null
          user_id: string | null
          zona: string | null
        }
        Insert: {
          categoria_id?: string | null
          created_at?: string
          email: string
          id?: string
          nombre_negocio?: string | null
          user_id?: string | null
          zona?: string | null
        }
        Update: {
          categoria_id?: string | null
          created_at?: string
          email?: string
          id?: string
          nombre_negocio?: string | null
          user_id?: string | null
          zona?: string | null
        }
        Relationships: []
      }
      negocios_candidatos: {
        Row: {
          categoria_id: string | null
          contacto: Json
          created_at: string
          descripcion_breve: string
          direccion: string | null
          enlace_fuente: string | null
          estado: string
          avisos: string | null
          fuente_datos: string
          id: string
          localidad: string
          nombre: string
          profesional_id: string | null
          revisado_en: string | null
          zona_id: string | null
        }
        Insert: {
          categoria_id?: string | null
          contacto?: Json
          descripcion_breve?: string
          direccion?: string | null
          enlace_fuente?: string | null
          avisos?: string | null
          fuente_datos: string
          localidad?: string
          nombre: string
          zona_id?: string | null
        }
        Update: { estado?: string; revisado_en?: string | null }
        Relationships: []
      }
      bajas_ficha: {
        Row: { contacto: string; created_at: string; id: string; motivo: string | null; profesional_id: string }
        Insert: { contacto: string; motivo?: string | null; profesional_id: string }
        Update: { contacto?: string; motivo?: string | null }
        Relationships: []
      }
      precios_destacado: {
        Row: {
          activo: boolean
          categoria_id: string
          precio_mensual_centimos: number
          stripe_price_id: string | null
          updated_at: string
        }
        Insert: {
          activo?: boolean
          categoria_id: string
          precio_mensual_centimos: number
          stripe_price_id?: string | null
          updated_at?: string
        }
        Update: {
          activo?: boolean
          categoria_id?: string
          precio_mensual_centimos?: number
          stripe_price_id?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      perfiles: {
        Row: {
          created_at: string
          es_admin: boolean
          id: string
          nombre: string
          telefono: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          es_admin?: boolean
          id: string
          nombre: string
          telefono?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          es_admin?: boolean
          id?: string
          nombre?: string
          telefono?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      profesional_categorias: {
        Row: {
          categoria_id: string
          profesional_id: string
        }
        Insert: {
          categoria_id: string
          profesional_id: string
        }
        Update: {
          categoria_id?: string
          profesional_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "profesional_categorias_categoria_id_fkey"
            columns: ["categoria_id"]
            isOneToOne: false
            referencedRelation: "categorias"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profesional_categorias_profesional_id_fkey"
            columns: ["profesional_id"]
            isOneToOne: false
            referencedRelation: "profesionales"
            referencedColumns: ["id"]
          },
        ]
      }
      profesional_zonas: {
        Row: {
          profesional_id: string
          zona_id: string
        }
        Insert: {
          profesional_id: string
          zona_id: string
        }
        Update: {
          profesional_id?: string
          zona_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "profesional_zonas_profesional_id_fkey"
            columns: ["profesional_id"]
            isOneToOne: false
            referencedRelation: "profesionales"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profesional_zonas_zona_id_fkey"
            columns: ["zona_id"]
            isOneToOne: false
            referencedRelation: "zonas"
            referencedColumns: ["id"]
          },
        ]
      }
      profesionales: {
        Row: {
          creado_por_protop: boolean
          fuente_datos: string | null
          reclamada_en: string | null
          categoria_id: string
          contacto: Json
          created_at: string
          descripcion: string
          descripcion_breve: string
          desglose_por_concepto: Json
          distintivos: Json
          es_demo: boolean
          especialidades: Json
          foto_perfil_url: string | null
          fotos_trabajos: string[]
          id: string
          localidad: string
          nombre_comercial: string
          patrocinado: boolean
          publicado: boolean
          puntuacion_global: number | null
          slug: string
          trabajos_valorados: number
          updated_at: string
          user_id: string | null
        }
        Insert: {
          categoria_id: string
          contacto?: Json
          created_at?: string
          descripcion: string
          descripcion_breve: string
          desglose_por_concepto?: Json
          distintivos?: Json
          es_demo?: boolean
          especialidades?: Json
          foto_perfil_url?: string | null
          fotos_trabajos?: string[]
          id?: string
          localidad: string
          nombre_comercial: string
          patrocinado?: boolean
          publicado?: boolean
          puntuacion_global?: number | null
          slug: string
          trabajos_valorados?: number
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          categoria_id?: string
          contacto?: Json
          created_at?: string
          descripcion?: string
          descripcion_breve?: string
          desglose_por_concepto?: Json
          distintivos?: Json
          es_demo?: boolean
          especialidades?: Json
          foto_perfil_url?: string | null
          fotos_trabajos?: string[]
          id?: string
          localidad?: string
          nombre_comercial?: string
          patrocinado?: boolean
          publicado?: boolean
          puntuacion_global?: number | null
          slug?: string
          trabajos_valorados?: number
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profesionales_categoria_id_fkey"
            columns: ["categoria_id"]
            isOneToOne: false
            referencedRelation: "categorias"
            referencedColumns: ["id"]
          },
        ]
      }
      propuestas: {
        Row: {
          alcance_trabajo: string
          aspectos_pendientes: string | null
          created_at: string
          desglose: string | null
          exclusiones: string | null
          id: string
          importe_orientativo: number
          mano_obra: string | null
          materiales_incluidos: string | null
          necesita_visita: boolean
          plazo_aproximado: string
          profesional_id: string
          solicitud_id: string
          tipo: string
          tratamiento_impuestos: string
          valida_hasta: string
        }
        Insert: {
          alcance_trabajo: string
          aspectos_pendientes?: string | null
          created_at?: string
          desglose?: string | null
          exclusiones?: string | null
          id?: string
          importe_orientativo: number
          mano_obra?: string | null
          materiales_incluidos?: string | null
          necesita_visita?: boolean
          plazo_aproximado: string
          profesional_id: string
          solicitud_id: string
          tipo?: string
          tratamiento_impuestos: string
          valida_hasta: string
        }
        Update: {
          alcance_trabajo?: string
          aspectos_pendientes?: string | null
          created_at?: string
          desglose?: string | null
          exclusiones?: string | null
          id?: string
          importe_orientativo?: number
          mano_obra?: string | null
          materiales_incluidos?: string | null
          necesita_visita?: boolean
          plazo_aproximado?: string
          profesional_id?: string
          solicitud_id?: string
          tipo?: string
          tratamiento_impuestos?: string
          valida_hasta?: string
        }
        Relationships: [
          {
            foreignKeyName: "propuestas_profesional_id_fkey"
            columns: ["profesional_id"]
            isOneToOne: false
            referencedRelation: "profesionales"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "propuestas_solicitud_id_fkey"
            columns: ["solicitud_id"]
            isOneToOne: false
            referencedRelation: "solicitudes"
            referencedColumns: ["id"]
          },
        ]
      }
      solicitudes: {
        Row: {
          categoria_id: string
          created_at: string
          descripcion: string
          estado: string
          fecha_deseada: string | null
          fotos: string[]
          id: string
          informacion_adicional: string | null
          medidas_cantidades: string | null
          particular_id: string
          titulo: string
          updated_at: string
          zona_id: string
        }
        Insert: {
          categoria_id: string
          created_at?: string
          descripcion: string
          estado?: string
          fecha_deseada?: string | null
          fotos?: string[]
          id?: string
          informacion_adicional?: string | null
          medidas_cantidades?: string | null
          particular_id: string
          titulo: string
          updated_at?: string
          zona_id: string
        }
        Update: {
          categoria_id?: string
          created_at?: string
          descripcion?: string
          estado?: string
          fecha_deseada?: string | null
          fotos?: string[]
          id?: string
          informacion_adicional?: string | null
          medidas_cantidades?: string | null
          particular_id?: string
          titulo?: string
          updated_at?: string
          zona_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "solicitudes_categoria_id_fkey"
            columns: ["categoria_id"]
            isOneToOne: false
            referencedRelation: "categorias"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "solicitudes_particular_id_fkey"
            columns: ["particular_id"]
            isOneToOne: false
            referencedRelation: "perfiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "solicitudes_zona_id_fkey"
            columns: ["zona_id"]
            isOneToOne: false
            referencedRelation: "zonas"
            referencedColumns: ["id"]
          },
        ]
      }
      trabajo_comentarios: {
        Row: {
          autor_id: string
          comentario: string
          created_at: string
          id: string
          trabajo_id: string
        }
        Insert: {
          autor_id: string
          comentario: string
          created_at?: string
          id?: string
          trabajo_id: string
        }
        Update: {
          autor_id?: string
          comentario?: string
          created_at?: string
          id?: string
          trabajo_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "trabajo_comentarios_autor_id_fkey"
            columns: ["autor_id"]
            isOneToOne: false
            referencedRelation: "perfiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trabajo_comentarios_trabajo_id_fkey"
            columns: ["trabajo_id"]
            isOneToOne: true
            referencedRelation: "trabajos_publicados"
            referencedColumns: ["id"]
          },
        ]
      }
      trabajos_publicados: {
        Row: {
          cliente_id: string | null
          created_at: string
          descripcion: string | null
          fotos: string[]
          id: string
          profesional_id: string
          realizado_en: string | null
          titulo: string
          updated_at: string
        }
        Insert: {
          cliente_id?: string | null
          created_at?: string
          descripcion?: string | null
          fotos?: string[]
          id?: string
          profesional_id: string
          realizado_en?: string | null
          titulo: string
          updated_at?: string
        }
        Update: {
          cliente_id?: string | null
          created_at?: string
          descripcion?: string | null
          fotos?: string[]
          id?: string
          profesional_id?: string
          realizado_en?: string | null
          titulo?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "trabajos_publicados_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "perfiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trabajos_publicados_profesional_id_fkey"
            columns: ["profesional_id"]
            isOneToOne: false
            referencedRelation: "profesionales"
            referencedColumns: ["id"]
          },
        ]
      }
      valoraciones: {
        Row: {
          calidad_acabado: number | null
          comunicacion: number | null
          created_at: string
          cumplimiento_plazos: number | null
          descripcion_trabajo: string | null
          estado: string
          factura_ruta: string
          id: string
          limpieza_cuidado: number | null
          motivo_revision: string | null
          particular_id: string
          profesional_id: string
          puntualidad: number | null
          respeto_presupuesto: number | null
          revisado_en: string | null
          revisado_por: string | null
        }
        Insert: {
          calidad_acabado?: number | null
          comunicacion?: number | null
          created_at?: string
          cumplimiento_plazos?: number | null
          descripcion_trabajo?: string | null
          estado?: string
          factura_ruta: string
          id?: string
          limpieza_cuidado?: number | null
          motivo_revision?: string | null
          particular_id: string
          profesional_id: string
          puntualidad?: number | null
          respeto_presupuesto?: number | null
          revisado_en?: string | null
          revisado_por?: string | null
        }
        Update: {
          calidad_acabado?: number | null
          comunicacion?: number | null
          created_at?: string
          cumplimiento_plazos?: number | null
          descripcion_trabajo?: string | null
          estado?: string
          factura_ruta?: string
          id?: string
          limpieza_cuidado?: number | null
          motivo_revision?: string | null
          particular_id?: string
          profesional_id?: string
          puntualidad?: number | null
          respeto_presupuesto?: number | null
          revisado_en?: string | null
          revisado_por?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "valoraciones_particular_id_fkey"
            columns: ["particular_id"]
            isOneToOne: false
            referencedRelation: "perfiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "valoraciones_profesional_id_fkey"
            columns: ["profesional_id"]
            isOneToOne: false
            referencedRelation: "profesionales"
            referencedColumns: ["id"]
          },
        ]
      }
      zonas: {
        Row: {
          comunidad_slug: string | null
          created_at: string
          id: string
          ine_id: string | null
          nombre: string
          orden: number
          slug: string
          tipo: string
        }
        Insert: {
          comunidad_slug?: string | null
          created_at?: string
          id?: string
          ine_id?: string | null
          nombre: string
          orden?: number
          slug: string
          tipo: string
        }
        Update: {
          comunidad_slug?: string | null
          created_at?: string
          id?: string
          ine_id?: string | null
          nombre?: string
          orden?: number
          slug?: string
          tipo?: string
        }
        Relationships: []
      }
    }
    Views: {
      valoraciones_publicas: {
        Row: {
          calidad_acabado: number | null
          comunicacion: number | null
          created_at: string | null
          cumplimiento_plazos: number | null
          descripcion_trabajo: string | null
          id: string | null
          limpieza_cuidado: number | null
          profesional_id: string | null
          puntualidad: number | null
          respeto_presupuesto: number | null
        }
        Insert: {
          calidad_acabado?: number | null
          comunicacion?: number | null
          created_at?: string | null
          cumplimiento_plazos?: number | null
          descripcion_trabajo?: string | null
          id?: string | null
          limpieza_cuidado?: number | null
          profesional_id?: string | null
          puntualidad?: number | null
          respeto_presupuesto?: number | null
        }
        Update: {
          calidad_acabado?: number | null
          comunicacion?: number | null
          created_at?: string | null
          cumplimiento_plazos?: number | null
          descripcion_trabajo?: string | null
          id?: string | null
          limpieza_cuidado?: number | null
          profesional_id?: string | null
          puntualidad?: number | null
          respeto_presupuesto?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "valoraciones_profesional_id_fkey"
            columns: ["profesional_id"]
            isOneToOne: false
            referencedRelation: "profesionales"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      es_admin_actual: { Args: never; Returns: boolean }
      crear_ficha_sin_reclamar: {
        Args: {
          p_nombre_comercial: string
          p_categoria_ids: string[]
          p_zona_ids: string[]
          p_localidad: string
          p_descripcion_breve: string
          p_contacto: Json
          p_fuente_datos: string
        }
        Returns: string
      }
      publicar_negocio_candidato: {
        Args: {
          p_id: string
          p_nombre: string
          p_categoria_id: string
          p_zona_id: string | null
          p_localidad: string
          p_descripcion_breve: string
          p_contacto: Json
        }
        Returns: string
      }
      reclamar_ficha: { Args: { p_profesional_id: string; p_mensaje?: string }; Returns: string }
      resolver_reclamacion: {
        Args: { p_reclamacion_id: string; p_aprobar: boolean; p_motivo?: string }
        Returns: undefined
      }
      borrar_ficha_sin_reclamar: { Args: { p_profesional_id: string }; Returns: undefined }
      registrar_visita_ficha: {
        Args: { p_slug: string; p_tipo?: string }
        Returns: undefined
      }
      estadisticas_ficha: {
        Args: { p_slug: string }
        Returns: { visitas: number; contactos: number }[]
      }
      buscar_profesionales: {
        Args: { p_categorias?: string[] | null; p_zona?: string | null; p_texto?: string | null }
        Returns: Database['public']['Tables']['profesionales']['Row'][]
      }
      oficios_destacados: {
        Args: never
        Returns: { profesional_id: string; categoria_slug: string }[]
      }
      resumen_solicitudes_abiertas: {
        Args: never
        Returns: { categoria_slug: string; abiertas: number }[]
      }
      recalcular_reputacion_profesional: {
        Args: { target_id: string }
        Returns: undefined
      }
      vincular_cliente_trabajo: {
        Args: { email_cliente: string; trabajo_id_param: string }
        Returns: undefined
      }
      zonas_coinciden: {
        Args: { zona_a: string; zona_b: string }
        Returns: boolean
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const
