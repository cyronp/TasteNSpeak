"use client";

import RestaurantCard, { type Category } from "@/components/rest-card";
import RestaurantModal, {
  type Restaurant,
} from "@/components/restaurant-modal";
import { useState } from "react";

const restaurants: Restaurant[] = [
  {
    name: "Bella Tavola",
    category: "Restaurante",
    rating: 5,
    description:
      "Autêntica culinária italiana com massas frescas e ambiente acolhedor.",
    visits: 1247,
    reviews: [
      {
        author: "Maria Silva",
        rating: 5,
        comment:
          "Massa fresca maravilhosa! Ambiente acolhedor e atendimento impecável.",
        date: "2024-01-15",
      },
      {
        author: "João Santos",
        rating: 5,
        comment: "Melhor comida italiana da cidade. Sempre volto!",
        date: "2024-01-10",
      },
    ],
  },
  {
    name: "Café Central",
    category: "Café",
    rating: 4,
    description:
      "Café artesanal e doces caseiros em um espaço charmoso e histórico.",
    visits: 892,
    reviews: [
      {
        author: "Ana Costa",
        rating: 4,
        comment: "Café delicioso e ambiente charmoso. Preço um pouco alto.",
        date: "2024-01-12",
      },
    ],
  },
  {
    name: "Sabor Brasileiro",
    category: "Restaurante",
    rating: 5,
    description:
      "Comida brasileira tradicional feita com ingredientes frescos e muito sabor.",
    visits: 1583,
    reviews: [
      {
        author: "Pedro Oliveira",
        rating: 5,
        comment: "Feijoada espetacular! Me lembrou a comida da minha avó.",
        date: "2024-01-18",
      },
      {
        author: "Carla Mendes",
        rating: 5,
        comment: "Ingredientes fresquíssimos e sabor autêntico. Recomendo!",
        date: "2024-01-14",
      },
    ],
  },
  {
    name: "Doce Momento",
    category: "Café",
    rating: 3,
    description:
      "Cafeteria moderna com opções de cafés especiais e sobremesas variadas.",
    visits: 456,
    reviews: [
      {
        author: "Lucas Ferreira",
        rating: 3,
        comment: "Café bom, mas o atendimento poderia melhorar.",
        date: "2024-01-08",
      },
    ],
  },
  {
    name: "La Pizzeria",
    category: "Restaurante",
    rating: 4,
    description:
      "Pizzas artesanais assadas em forno à lenha com receitas tradicionais italianas.",
    visits: 1098,
    reviews: [
      {
        author: "Ricardo Souza",
        rating: 4,
        comment: "Pizza autêntica com massa fina e crocante. Adorei!",
        date: "2024-01-16",
      },
    ],
  },
  {
    name: "Bar do João",
    category: "Outro",
    rating: 5,
    description:
      "Bar tradicional com petiscos deliciosos e ambiente descontraído.",
    visits: 2341,
    reviews: [
      {
        author: "Fernanda Lima",
        rating: 5,
        comment: "Melhor bar da região! Petiscos incríveis e preço justo.",
        date: "2024-01-20",
      },
      {
        author: "Marcos Alves",
        rating: 5,
        comment: "Ambiente descontraído e comida excelente. Sempre cheio!",
        date: "2024-01-17",
      },
    ],
  },
  {
    name: "Sushi House",
    category: "Restaurante",
    rating: 4,
    description:
      "Culinária japonesa autêntica com peixes frescos e pratos tradicionais.",
    visits: 967,
    reviews: [
      {
        author: "Patricia Rocha",
        rating: 4,
        comment: "Sushi fresco e saboroso. Vale a pena experimentar!",
        date: "2024-01-13",
      },
    ],
  },
  {
    name: "Coffee Break",
    category: "Café",
    rating: 3,
    description: "Ponto de encontro perfeito para um café rápido e saboroso.",
    visits: 634,
    reviews: [
      {
        author: "Juliana Campos",
        rating: 3,
        comment: "Bom para um café rápido, mas nada excepcional.",
        date: "2024-01-09",
      },
    ],
  },
  {
    name: "Churrascaria Gaúcha",
    category: "Restaurante",
    rating: 5,
    description:
      "Carnes nobres preparadas no estilo gaúcho tradicional, rodízio completo.",
    visits: 1876,
    reviews: [
      {
        author: "Roberto Silva",
        rating: 5,
        comment:
          "Carnes de primeira qualidade! Rodízio completo e bem servido.",
        date: "2024-01-19",
      },
      {
        author: "Amanda Costa",
        rating: 5,
        comment: "Experiência incrível! Voltarei com certeza.",
        date: "2024-01-11",
      },
    ],
  },
  {
    name: "Padaria Nova",
    category: "Outro",
    rating: 4,
    description:
      "Pães frescos diariamente e uma variedade de produtos de confeitaria.",
    visits: 1523,
    reviews: [
      {
        author: "Sandra Martins",
        rating: 4,
        comment: "Pães sempre fresquinhos pela manhã. Recomendo!",
        date: "2024-01-07",
      },
    ],
  },
  {
    name: "Bistro Francês",
    category: "Restaurante",
    rating: 5,
    description:
      "Experiência gastronômica francesa sofisticada com vinhos selecionados.",
    visits: 789,
    reviews: [
      {
        author: "Eduardo Nunes",
        rating: 5,
        comment:
          "Sofisticação e sabor em cada prato. Carta de vinhos excepcional!",
        date: "2024-01-21",
      },
    ],
  },
  {
    name: "Confeitaria Doce Vida",
    category: "Café",
    rating: 4,
    description:
      "Bolos artesanais, tortas e doces finos preparados com carinho.",
    visits: 1145,
    reviews: [
      {
        author: "Beatriz Santos",
        rating: 4,
        comment:
          "Doces deliciosos e atendimento carinhoso. Ambiente aconchegante.",
        date: "2024-01-06",
      },
      {
        author: "Beatriz Santos",
        rating: 4,
        comment:
          "Doces deliciosos e atendimento carinhoso. Ambiente aconchegante.",
        date: "2024-01-06",
      },
    ],
  },
];

export default function Home() {
  const [selectedRestaurant, setSelectedRestaurant] =
    useState<Restaurant | null>(null);

  return (
    <div>
      <div className="container mx-auto px-4 py-8 md:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {restaurants.map((restaurant, index) => (
            <div
              key={index}
              onClick={() => setSelectedRestaurant(restaurant)}
              className="cursor-pointer"
            >
              <RestaurantCard
                imageSrc={`https://picsum.photos/seed/${restaurant.name}/400/225`}
                title={restaurant.name}
                description={restaurant.description}
                category={restaurant.category}
                rating={restaurant.rating}
                visits={restaurant.visits}
              />
            </div>
          ))}
        </div>
      </div>

      <RestaurantModal
        restaurant={selectedRestaurant}
        onClose={() => setSelectedRestaurant(null)}
      />
    </div>
  );
}
