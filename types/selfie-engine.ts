export type SceneType =
  | 'front_selfie'
  | 'standing_selfie'
  | 'walking_selfie'
  | 'seated_selfie'
  | 'outdoor_selfie'
  | 'mirror_selfie'
  | 'inside_car_driver_selfie'
  | 'inside_car_passenger_selfie'
  | 'car_adjacent_selfie'
  | 'close_face_selfie'
  | 'wide_environmental_selfie'
  | 'high_angle_selfie'
  | 'low_angle_selfie'
  | 'three_quarter_selfie'
  | 'leaning_selfie'
  | 'street_night_selfie'
  | 'parking_night_selfie'
  | 'gas_station_selfie'
  | 'restaurant_table_selfie'
  | 'desk_work_selfie'
  | 'gym_workout_selfie'
  | 'post_workout_selfie'
  | 'beach_corniche_selfie'
  | 'desert_stop_selfie'
  | 'farm_palm_selfie'
  | 'mountain_view_selfie';

export type LocationCategory =
  | 'city_streets'
  | 'waterfront_corniche'
  | 'car_interior'
  | 'car_exterior'
  | 'parking_areas'
  | 'gas_stations'
  | 'restaurants_cafes'
  | 'office_work'
  | 'gym_fitness'
  | 'public_buildings'
  | 'wash_mirrors'
  | 'shopping'
  | 'airport'
  | 'desert_roadtrips'
  | 'mountain_locations'
  | 'farms_palms';

export type PoseType =
  | 'standing_asymmetric_weight'
  | 'walking_mid_stride_weight_transfer'
  | 'seated_cushion_compression'
  | 'seated_desk_workstation'
  | 'leaning_against_contact_surface'
  | 'seated_table_casual'
  | 'holding_cup_table'
  | 'gym_post_workout_recovery'
  | 'mirror_phone_held'
  | 'inside_car_driver_one_hand_wheel'
  | 'inside_car_passenger_armrest'
  | 'beside_car_open_door_clearance'
  | 'luggage_handle_interaction'
  | 'holding_shopping_basket';

export type CameraPosition =
  | 'handheld_arm_extended_front'
  | 'handheld_arm_extended_high'
  | 'handheld_arm_extended_low'
  | 'handheld_slightly_offcenter'
  | 'mirror_reflection_camera_visible'
  | 'car_cabin_arm_reach'
  | 'table_arm_propped';

export type CameraAngle =
  | 'eye_level'
  | 'slight_high_angle'
  | 'high_angle'
  | 'slight_low_angle'
  | 'low_angle'
  | 'three_quarter'
  | 'off_center';

export type FramingType =
  | 'close_face'
  | 'head_and_shoulders'
  | 'bust_torso'
  | 'waist_up'
  | 'wide_environmental_selfie';

export type LightingSource =
  | 'direct_sun'
  | 'harsh_noon'
  | 'open_shade'
  | 'golden_hour'
  | 'overcast_diffused'
  | 'street_led_poles'
  | 'parking_led_canopy'
  | 'gas_station_canopy_fixtures'
  | 'storefront_light_spill'
  | 'office_troffer_led'
  | 'retail_fluorescent_tubes'
  | 'cafe_warm_practical_amber'
  | 'car_interior_dome_light_dim'
  | 'mixed_practical_ambient';

export type TimeOfDay =
  | 'early_morning'
  | 'harsh_noon'
  | 'late_afternoon'
  | 'golden_hour_sunset'
  | 'blue_hour'
  | 'night';

export type WeatherCondition =
  | 'clear_dry'
  | 'cloudy_overcast'
  | 'humid_coastal_haze'
  | 'windy'
  | 'light_rain'
  | 'post_rain_wet_surface'
  | 'dusty_desert_atmosphere';

export type BackgroundActivityLevel = 'sparse' | 'light' | 'moderate';

export interface LocationItem {
  id: string;
  nameAr: string;
  nameEn: string;
  category: LocationCategory;
  descriptionAr: string;
  descriptionEn: string;
  compatibleSceneTypes: SceneType[];
  allowedPoses: PoseType[];
  hasMirror: boolean;
  hasCar: boolean;
  hasTable: boolean;
  hasDesk: boolean;
  hasContactSurface: boolean;
  allowedLighting: LightingSource[];
  defaultActivity: BackgroundActivityLevel;
  environmentalElements: string[];
  saudiDetails: string[];
}

export interface PhysicalValidationItem {
  key: string;
  titleAr: string;
  titleEn: string;
  passed: boolean;
  detailAr: string;
  detailEn: string;
  severity: 'error' | 'warning' | 'info';
}

export interface SelfieSceneState {
  sceneType: SceneType;
  locationCategory: LocationCategory;
  locationId: string;
  pose: PoseType;
  cameraPosition: CameraPosition;
  cameraAngle: CameraAngle;
  framing: FramingType;
  lighting: LightingSource;
  timeOfDay: TimeOfDay;
  weather: WeatherCondition;
  backgroundActivity: BackgroundActivityLevel;
  environmentalObjects: string[];
  clothingType: string;
  includeSaudiRealism: boolean;
  includeImperfectionLayer: boolean;
  customNotes: string;
}

export interface CompiledSelfiePrompt {
  chatgptPrompt: string;
  geminiPrompt: string;
  imageGenPrompt: string;
  jsonSpecification: string;
  validationReport: {
    passedAll: boolean;
    checks: PhysicalValidationItem[];
  };
  spatialSummary: {
    armReachMeters: number;
    lightOrigins: string;
    supportSurface: string;
    biomechanicsDesc: string;
  };
}
