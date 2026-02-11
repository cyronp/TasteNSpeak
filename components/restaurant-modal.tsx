"use client";

import { useEffect, useState, useRef } from "react";
import { X, Star } from "lucide-react";
import { type Category } from "./rest-card";

type Review = {
  author: string;
  rating: number;
  comment: string;
  date: string;
};

export type Restaurant = {
  name: string;
  category: Category;
  rating: number;
  description: string;
  visits: number;
  reviews: Review[];
};

interface RestaurantModalProps {
  restaurant: Restaurant | null;
  onClose: () => void;
}

export default function RestaurantModal({
  restaurant,
  onClose,
}: RestaurantModalProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragY, setDragY] = useState(0);
  const [startY, setStartY] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (restaurant) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
      setDragY(0);
      setIsDragging(false);
    }
  }, [restaurant]);

  const handleTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    if (!scrollContainerRef.current) return;

    // Só permite drag se estiver no topo do scroll
    if (scrollContainerRef.current.scrollTop === 0) {
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
      setStartY(clientY);
      setIsDragging(true);
    }
  };

  const handleTouchMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isDragging) return;

    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
    const diff = clientY - startY;

    // Só permite arrastar para baixo
    if (diff > 0) {
      setDragY(diff);
      // Previne scroll enquanto arrasta
      e.preventDefault();
    }
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;

    const screenHeight = window.innerHeight;

    // Se arrastou mais de 50% da tela, fecha a modal
    if (dragY > screenHeight * 0.5) {
      onClose();
    }

    // Reset
    setDragY(0);
    setIsDragging(false);
  };

  if (!restaurant) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-end justify-center">
      {/* Backdrop com blur e escuridão */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        style={{
          opacity: isDragging
            ? Math.max(0, 1 - dragY / (window.innerHeight * 0.5))
            : 1,
        }}
        onClick={onClose}
      />

      {/* Modal Content */}
      <div
        className={`relative w-full max-w-md max-h-[90vh] bg-transparent rounded-t-3xl overflow-hidden shadow-2xl ${
          isDragging ? "select-none" : ""
        }`}
        style={{
          transform: `translateY(${dragY}px)`,
          transition: isDragging ? "none" : "transform 0.3s ease-out",
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleTouchStart}
        onMouseMove={handleTouchMove}
        onMouseUp={handleTouchEnd}
        onMouseLeave={handleTouchEnd}
      >
        {/* Botão Fechar Fixo */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm transition-colors"
        >
          <X className="w-5 h-5 text-white" />
        </button>

        {/* Indicador de Drag */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 z-20">
          <div className="w-10 h-1 bg-white/40 rounded-full" />
        </div>

        {/* Conteúdo com Scroll */}
        <div
          ref={scrollContainerRef}
          className="overflow-y-auto max-h-[90vh] scrollbar-hide [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        >
          {/* Imagem do Restaurante */}
          <div className="relative w-full h-72">
            <img
              src={`https://picsum.photos/seed/${restaurant.name}/800/600`}
              alt={restaurant.name}
              className="w-full h-full object-cover"
            />
            {/* Gradiente na parte inferior da imagem */}
            <div className="absolute bottom-0 left-0 right-0 h-20 bg-linear-to-t from-white/60 to-transparent" />
          </div>

          {/* Informações do Restaurante - Card Branco Único */}
          <div className="bg-white rounded-t-3xl -mt-12 relative z-10">
            <div className="px-6 pt-6 pb-8 space-y-5">
              {/* Nome do Restaurante */}
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  {restaurant.name}
                </h1>
                <span className="inline-block px-3 py-1 bg-orange-100 text-orange-600 rounded-full text-xs font-medium">
                  {restaurant.category}
                </span>
              </div>

              {/* Estatísticas */}
              <div className="pb-5 border-b border-gray-100">
                <div className="flex items-center gap-4 mb-3">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < restaurant.rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                    <span className="text-base font-semibold text-gray-900 ml-2">
                      {restaurant.rating.toFixed(1)}
                    </span>
                  </div>
                  <span className="text-sm text-gray-500">
                    {restaurant.reviews.length} avaliações
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  <span className="font-semibold text-gray-900">
                    {restaurant.visits}
                  </span>{" "}
                  visitas totais
                </p>
              </div>

              {/* Descrição */}
              <div className="pb-5 border-b border-gray-100">
                <h3 className="text-base font-bold text-gray-900 mb-2">
                  Sobre
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {restaurant.description}
                </p>
              </div>

              {/* Avaliações */}
              <div>
                <h3 className="text-base font-bold text-gray-900 mb-4">
                  Avaliações
                </h3>
                <div className="space-y-4">
                  {restaurant.reviews.map((review, idx) => (
                    <div
                      key={idx}
                      className="pb-4 border-b border-gray-100 last:border-0 last:pb-0"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <span className="font-semibold text-gray-900 text-sm">
                            {review.author}
                          </span>
                          <div className="flex items-center gap-1 mt-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3.5 h-3.5 ${
                                  i < review.rating
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <span className="text-xs text-gray-500">
                          {new Date(review.date).toLocaleDateString("pt-BR")}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {review.comment}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
