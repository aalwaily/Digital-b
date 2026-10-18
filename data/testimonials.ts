export type Testimonial = {
  id: string;
  quote: string;
  name: string;
  detail: string;
  sample: false;
};

// Real quotations from verified buyers only. Do not invent names or star ratings.
export const testimonials: Testimonial[] = [];
