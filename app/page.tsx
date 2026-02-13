"use client";

import RestaurantCard, { type Category } from "@/components/rest-card";
import RestaurantModal, {
  type Restaurant,
} from "@/components/restaurant-modal";
import { useState, useEffect } from "react";

export default function Home() {
  const [selectedRestaurant, setSelectedRestaurant] =
    useState<Restaurant | null>(null);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRestaurants = async () => {
    try {
      const response = await fetch("/api/restaurants");
      const result = await response.json();

      if (response.ok && result.data) {
        const mappedRestaurants = result.data.map((item: any) => ({
          id: typeof item.id === "number" ? item.id : parseInt(item.id, 10),
          name: item.name,
          category: item.category as Category,
          rating: item.rating || 0,
          description: item.description,
          visits: item.visits || 0,
          reviews: item.reviews || [],
          image_url: item.image_url,
        }));

        setRestaurants(mappedRestaurants);
      } else {
        console.error("Error fetching restaurants:", result.error);
      }
    } catch (error) {
      console.error("Error fetching restaurants:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);

  return (
    <div>
      <div className="container mx-auto px-4 py-8 md:px-6 lg:px-8">
        {loading ? (
          <div className="flex justify-center items-center min-h-100">
            <p className="text-muted-foreground">Carregando restaurantes...</p>
          </div>
        ) : restaurants.length === 0 ? (
          <div className="flex justify-center items-center min-h-100">
            <p className="text-muted-foreground">
              Nenhum restaurante encontrado.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {restaurants.map((restaurant, index) => (
              <div
                key={index}
                onClick={() => setSelectedRestaurant(restaurant)}
                className="cursor-pointer"
              >
                <RestaurantCard
                  imageSrc={restaurant.image_url || `https://picsum.photos/seed/${restaurant.name}/400/225`}
                  title={restaurant.name}
                  description={restaurant.description}
                  category={restaurant.category}
                  rating={restaurant.rating}
                  visits={restaurant.visits}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      <RestaurantModal
        restaurant={selectedRestaurant}
        onClose={() => setSelectedRestaurant(null)}
        onVisitMarked={() => fetchRestaurants()}
      />
    </div>
  );
}
