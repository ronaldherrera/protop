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
          id: string
          nombre: string
          orden: number
          slug: string
        }
        Insert: {
          created_at?: string
          id?: string
          nombre: string
          orden?: number
          slug: string
        }
        Update: {
          created_at?: string
          id?: string
          nombre?: string
          orden?: number
          slug?: string
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
          categoria_id: string
          contacto: Json
          created_at: string
          descripcion: string
          descripcion_breve: string
          desglose_por_concepto: Json
          distintivos: Json
          es_demo: boolean
          especialidades: string[]
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
          especialidades?: string[]
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
          especialidades?: string[]
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
          created_at: string
          id: string
          nombre: string
          orden: number
          slug: string
        }
        Insert: {
          created_at?: string
          id?: string
          nombre: string
          orden?: number
          slug: string
        }
        Update: {
          created_at?: string
          id?: string
          nombre?: string
          orden?: number
          slug?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      es_admin_actual: { Args: never; Returns: boolean }
      recalcular_reputacion_profesional: {
        Args: { target_id: string }
        Returns: undefined
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
