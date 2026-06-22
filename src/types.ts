export type TripType = 'One Way' | 'Round Trip' | 'Multi City';

export interface BookingFormData {
  pickupLocation: string;
  dropLocation: string;
  date: string;
  time: string;
  tripType: TripType;
  passengers: number;
}
