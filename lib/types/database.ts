export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          phone: string | null
          role: 'admin' | 'user'
          avatar_url: string | null
          preferred_language: 'ar' | 'en'
          dark_mode: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          phone?: string | null
          role?: 'admin' | 'user'
          avatar_url?: string | null
          preferred_language?: 'ar' | 'en'
          dark_mode?: boolean
        }
        Update: {
          email?: string
          full_name?: string | null
          phone?: string | null
          role?: 'admin' | 'user'
          avatar_url?: string | null
          preferred_language?: 'ar' | 'en'
          dark_mode?: boolean
        }
      }
      owners: {
        Row: {
          id: string
          name: string
          phone: string
          alternative_phone: string | null
          email: string | null
          address: string | null
          notes: string | null
          status: 'active' | 'inactive' | 'archived'
          last_contact_date: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          name: string
          phone: string
          alternative_phone?: string | null
          email?: string | null
          address?: string | null
          notes?: string | null
          status?: 'active' | 'inactive' | 'archived'
          last_contact_date?: string | null
        }
        Update: {
          name?: string
          phone?: string
          alternative_phone?: string | null
          email?: string | null
          address?: string | null
          notes?: string | null
          status?: 'active' | 'inactive' | 'archived'
          last_contact_date?: string | null
        }
      }
      customers: {
        Row: {
          id: string
          name: string
          phone: string
          email: string | null
          notes: string | null
          follow_up_status: 'new' | 'contacted' | 'interested' | 'not_interested' | 'converted'
          last_contact_date: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          name: string
          phone: string
          email?: string | null
          notes?: string | null
          follow_up_status?: 'new' | 'contacted' | 'interested' | 'not_interested' | 'converted'
          last_contact_date?: string | null
        }
        Update: {
          name?: string
          phone?: string
          email?: string | null
          notes?: string | null
          follow_up_status?: 'new' | 'contacted' | 'interested' | 'not_interested' | 'converted'
          last_contact_date?: string | null
        }
      }
      properties: {
        Row: {
          id: string
          property_number: string
          property_type: 'apartment' | 'land' | 'building'
          title_ar: string
          title_en: string | null
          description_ar: string | null
          description_en: string | null
          governorate: string
          city: string
          district: string | null
          full_address: string | null
          google_maps_link: string | null
          latitude: number | null
          longitude: number | null
          price: number
          price_type: 'total' | 'per_meter' | 'per_dunum'
          negotiable: boolean
          status: 'available' | 'sold' | 'rented' | 'archived' | 'pending'
          listing_type: 'sale' | 'rent' | 'both'
          owner_id: string | null
          public_contact_number: string | null
          internal_notes: string | null
          view_count: number
          inquiry_count: number
          featured: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          property_type: 'apartment' | 'land' | 'building'
          title_ar: string
          governorate: string
          city: string
          price: number
          listing_type: 'sale' | 'rent' | 'both'
          property_number?: string
          title_en?: string | null
          description_ar?: string | null
          description_en?: string | null
          district?: string | null
          full_address?: string | null
          google_maps_link?: string | null
          latitude?: number | null
          longitude?: number | null
          price_type?: 'total' | 'per_meter' | 'per_dunum'
          negotiable?: boolean
          status?: 'available' | 'sold' | 'rented' | 'archived' | 'pending'
          owner_id?: string | null
          public_contact_number?: string | null
          internal_notes?: string | null
          featured?: boolean
        }
        Update: {
          property_type?: 'apartment' | 'land' | 'building'
          title_ar?: string
          title_en?: string | null
          description_ar?: string | null
          description_en?: string | null
          governorate?: string
          city?: string
          district?: string | null
          full_address?: string | null
          google_maps_link?: string | null
          latitude?: number | null
          longitude?: number | null
          price?: number
          price_type?: 'total' | 'per_meter' | 'per_dunum'
          negotiable?: boolean
          status?: 'available' | 'sold' | 'rented' | 'archived' | 'pending'
          listing_type?: 'sale' | 'rent' | 'both'
          owner_id?: string | null
          public_contact_number?: string | null
          internal_notes?: string | null
          featured?: boolean
        }
      }
      apartments: {
        Row: {
          id: string
          property_id: string
          building_age: number | null
          building_floors: number | null
          apartment_floor: number | null
          area: number
          bedrooms: number
          bathrooms: number
          kitchens: number
          living_rooms: number
          balconies: number
          has_elevator: boolean
          has_parking: boolean
          has_storage: boolean
          has_solar_system: boolean
          has_water_well: boolean
          is_furnished: boolean
          has_air_conditioning: boolean
          has_central_heating: boolean
          monthly_service_fees: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          property_id: string
          area: number
          building_age?: number | null
          building_floors?: number | null
          apartment_floor?: number | null
          bedrooms?: number
          bathrooms?: number
          kitchens?: number
          living_rooms?: number
          balconies?: number
          has_elevator?: boolean
          has_parking?: boolean
          has_storage?: boolean
          has_solar_system?: boolean
          has_water_well?: boolean
          is_furnished?: boolean
          has_air_conditioning?: boolean
          has_central_heating?: boolean
          monthly_service_fees?: number | null
        }
        Update: {
          area?: number
          building_age?: number | null
          building_floors?: number | null
          apartment_floor?: number | null
          bedrooms?: number
          bathrooms?: number
          kitchens?: number
          living_rooms?: number
          balconies?: number
          has_elevator?: boolean
          has_parking?: boolean
          has_storage?: boolean
          has_solar_system?: boolean
          has_water_well?: boolean
          is_furnished?: boolean
          has_air_conditioning?: boolean
          has_central_heating?: boolean
          monthly_service_fees?: number | null
        }
      }
      lands: {
        Row: {
          id: string
          property_id: string
          area_dunum: number
          is_residential: boolean
          is_commercial: boolean
          is_agricultural: boolean
          is_industrial: boolean
          has_water: boolean
          has_electricity: boolean
          has_sewer: boolean
          has_road_access: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          property_id: string
          area_dunum: number
          is_residential?: boolean
          is_commercial?: boolean
          is_agricultural?: boolean
          is_industrial?: boolean
          has_water?: boolean
          has_electricity?: boolean
          has_sewer?: boolean
          has_road_access?: boolean
        }
        Update: {
          area_dunum?: number
          is_residential?: boolean
          is_commercial?: boolean
          is_agricultural?: boolean
          is_industrial?: boolean
          has_water?: boolean
          has_electricity?: boolean
          has_sewer?: boolean
          has_road_access?: boolean
        }
      }
      buildings: {
        Row: {
          id: string
          property_id: string
          land_area: number | null
          building_area: number
          building_age: number | null
          total_floors: number
          has_roof: boolean
          has_yard: boolean
          has_parking: boolean
          has_separate_storage: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          property_id: string
          building_area: number
          total_floors: number
          land_area?: number | null
          building_age?: number | null
          has_roof?: boolean
          has_yard?: boolean
          has_parking?: boolean
          has_separate_storage?: boolean
        }
        Update: {
          land_area?: number | null
          building_area?: number
          building_age?: number | null
          total_floors?: number
          has_roof?: boolean
          has_yard?: boolean
          has_parking?: boolean
          has_separate_storage?: boolean
        }
      }
      building_floors: {
        Row: {
          id: string
          building_id: string
          floor_number: number
          num_apartments: number
          apartment_area: number | null
          created_at: string
        }
        Insert: {
          building_id: string
          floor_number: number
          num_apartments?: number
          apartment_area?: number | null
        }
        Update: {
          floor_number?: number
          num_apartments?: number
          apartment_area?: number | null
        }
      }
      property_images: {
        Row: {
          id: string
          property_id: string
          url: string
          caption_ar: string | null
          caption_en: string | null
          is_primary: boolean
          display_order: number
          created_at: string
        }
        Insert: {
          property_id: string
          url: string
          caption_ar?: string | null
          caption_en?: string | null
          is_primary?: boolean
          display_order?: number
        }
        Update: {
          url?: string
          caption_ar?: string | null
          caption_en?: string | null
          is_primary?: boolean
          display_order?: number
        }
      }
      property_videos: {
        Row: {
          id: string
          property_id: string
          url: string
          title_ar: string | null
          title_en: string | null
          display_order: number
          created_at: string
        }
        Insert: {
          property_id: string
          url: string
          title_ar?: string | null
          title_en?: string | null
          display_order?: number
        }
        Update: {
          url?: string
          title_ar?: string | null
          title_en?: string | null
          display_order?: number
        }
      }
      property_views: {
        Row: {
          id: string
          property_id: string
          user_id: string | null
          ip_address: string | null
          user_agent: string | null
          viewed_at: string
        }
        Insert: {
          property_id: string
          user_id?: string | null
          ip_address?: string | null
          user_agent?: string | null
        }
        Update: {}
      }
      favorites: {
        Row: {
          id: string
          user_id: string
          property_id: string
          created_at: string
        }
        Insert: {
          user_id: string
          property_id: string
        }
        Update: {}
      }
      appointments: {
        Row: {
          id: string
          property_id: string
          user_id: string | null
          customer_name: string
          customer_phone: string
          customer_email: string | null
          preferred_date: string
          preferred_time: string
          notes: string | null
          status: 'pending' | 'approved' | 'rejected' | 'rescheduled' | 'completed' | 'cancelled'
          admin_notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          property_id: string
          customer_name: string
          customer_phone: string
          preferred_date: string
          preferred_time: string
          user_id?: string | null
          customer_email?: string | null
          notes?: string | null
          status?: 'pending' | 'approved' | 'rejected' | 'rescheduled' | 'completed' | 'cancelled'
          admin_notes?: string | null
        }
        Update: {
          customer_name?: string
          customer_phone?: string
          customer_email?: string | null
          preferred_date?: string
          preferred_time?: string
          notes?: string | null
          status?: 'pending' | 'approved' | 'rejected' | 'rescheduled' | 'completed' | 'cancelled'
          admin_notes?: string | null
        }
      }
      inquiries: {
        Row: {
          id: string
          property_id: string | null
          user_id: string | null
          name: string
          email: string | null
          phone: string
          message: string
          inquiry_type: 'general' | 'callback' | 'question' | 'visit_request'
          status: 'new' | 'read' | 'responded' | 'closed'
          admin_notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          name: string
          phone: string
          message: string
          property_id?: string | null
          user_id?: string | null
          email?: string | null
          inquiry_type?: 'general' | 'callback' | 'question' | 'visit_request'
          status?: 'new' | 'read' | 'responded' | 'closed'
          admin_notes?: string | null
        }
        Update: {
          name?: string
          phone?: string
          message?: string
          email?: string | null
          inquiry_type?: 'general' | 'callback' | 'question' | 'visit_request'
          status?: 'new' | 'read' | 'responded' | 'closed'
          admin_notes?: string | null
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string | null
          type: string
          title_ar: string
          title_en: string | null
          message_ar: string | null
          message_en: string | null
          data: Json | null
          read: boolean
          created_at: string
        }
        Insert: {
          user_id?: string | null
          type: string
          title_ar: string
          title_en?: string | null
          message_ar?: string | null
          message_en?: string | null
          data?: Json | null
          read?: boolean
        }
        Update: {
          type?: string
          title_ar?: string
          title_en?: string | null
          message_ar?: string | null
          message_en?: string | null
          data?: Json | null
          read?: boolean
        }
      }
      audit_logs: {
        Row: {
          id: string
          user_id: string | null
          action: string
          entity_type: string
          entity_id: string | null
          old_values: Json | null
          new_values: Json | null
          ip_address: string | null
          created_at: string
        }
        Insert: {
          action: string
          entity_type: string
          user_id?: string | null
          entity_id?: string | null
          old_values?: Json | null
          new_values?: Json | null
          ip_address?: string | null
        }
        Update: {}
      }
      customer_property_interests: {
        Row: {
          id: string
          customer_id: string
          property_id: string
          notes: string | null
          created_at: string
        }
        Insert: {
          customer_id: string
          property_id: string
          notes?: string | null
        }
        Update: {
          notes?: string | null
        }
      }
      customer_communications: {
        Row: {
          id: string
          customer_id: string
          communication_type: 'call' | 'email' | 'whatsapp' | 'meeting' | 'other'
          notes: string | null
          initiated_by: string
          created_at: string
        }
        Insert: {
          customer_id: string
          communication_type: 'call' | 'email' | 'whatsapp' | 'meeting' | 'other'
          notes?: string | null
          initiated_by?: string
        }
        Update: {
          communication_type?: 'call' | 'email' | 'whatsapp' | 'meeting' | 'other'
          notes?: string | null
          initiated_by?: string
        }
      }
      owner_deals: {
        Row: {
          id: string
          owner_id: string
          property_id: string | null
          deal_type: 'sale' | 'rent' | 'purchase'
          amount: number | null
          status: 'pending' | 'completed' | 'cancelled'
          notes: string | null
          deal_date: string | null
          created_at: string
        }
        Insert: {
          owner_id: string
          deal_type: 'sale' | 'rent' | 'purchase'
          property_id?: string | null
          amount?: number | null
          status?: 'pending' | 'completed' | 'cancelled'
          notes?: string | null
          deal_date?: string | null
        }
        Update: {
          deal_type?: 'sale' | 'rent' | 'purchase'
          property_id?: string | null
          amount?: number | null
          status?: 'pending' | 'completed' | 'cancelled'
          notes?: string | null
          deal_date?: string | null
        }
      }
    }
    Views: {}
    Functions: {
      is_admin: {
        Args: {}
        Returns: boolean
      }
    }
    Enums: {}
  }
}

export type Profile = Database['public']['Tables']['profiles']['Row']
export type Owner = Database['public']['Tables']['owners']['Row']
export type Customer = Database['public']['Tables']['customers']['Row']
export type Property = Database['public']['Tables']['properties']['Row']
export type Apartment = Database['public']['Tables']['apartments']['Row']
export type Land = Database['public']['Tables']['lands']['Row']
export type Building = Database['public']['Tables']['buildings']['Row']
export type BuildingFloor = Database['public']['Tables']['building_floors']['Row']
export type PropertyImage = Database['public']['Tables']['property_images']['Row']
export type PropertyVideo = Database['public']['Tables']['property_videos']['Row']
export type PropertyView = Database['public']['Tables']['property_views']['Row']
export type Favorite = Database['public']['Tables']['favorites']['Row']
export type Appointment = Database['public']['Tables']['appointments']['Row']
export type Inquiry = Database['public']['Tables']['inquiries']['Row']
export type Notification = Database['public']['Tables']['notifications']['Row']
export type AuditLog = Database['public']['Tables']['audit_logs']['Row']
export type CustomerPropertyInterest = Database['public']['Tables']['customer_property_interests']['Row']
export type CustomerCommunication = Database['public']['Tables']['customer_communications']['Row']
export type OwnerDeal = Database['public']['Tables']['owner_deals']['Row']

// Extended types with related data
export type PropertyWithDetails = Property & {
  apartment?: Apartment | null
  land?: Land | null
  building?: Building & { floors: BuildingFloor[] } | null
  images: PropertyImage[]
  videos: PropertyVideo[]
  owner?: Owner | null
}

export type PropertyWithImages = Property & {
  images: PropertyImage[]
}
