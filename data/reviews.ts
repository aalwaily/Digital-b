export type Review = {
  id: string;
  productSlug: string;
  name: string;
  location: string;
  rating: number;
  title: string;
  body: string;
  sample: false;
};

// Real reviews from verified buyers only. Do not add sample quotations or star ratings.
export const reviews: Review[] = [];

export function reviewsFor(slug: string) {
  return reviews.filter((review) => review.productSlug === slug);
}
