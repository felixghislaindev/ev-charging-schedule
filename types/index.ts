
export interface PostcodeData {
    results?: Array<{
      components?: {
        postcode?: string;
      };
    }>;
  }
  
  export interface SimplifiedCarbonIntensityData {
    data: [
      {
        data: [
          {
            intensity: {
              forecast: number;
              index: string;
            };
          }
        ];
      }
    ];
  }
  export interface IntensityData {
    from: string;
    to: string;
    intensity: {
      forecast: number;
      actual: number | null;
      index: string;
    };
  }