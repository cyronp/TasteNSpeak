"use client";

import { useEffect, useState, useRef } from "react";
import { X, Heart, MapPinCheck, Stamp } from "lucide-react";
import { type Category } from "./rest-card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "./ui/drawer";

type Review = {
  author: string;
  rating: number;
  comment: string;
  date: string;
};

export type Restaurant = {
  id: number;
  name: string;
  category: Category;
  rating: number;
  description: string;
  visits: number;
  reviews: Review[];
  image_url?: string;
};

interface RestaurantModalProps {
  restaurant: Restaurant | null;
  onClose: () => void;
  onVisitMarked?: () => void;
}

export default function RestaurantModal({
  restaurant,
  onClose,
  onVisitMarked,
}: RestaurantModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragY, setDragY] = useState(0);
  const [startY, setStartY] = useState(0);
  const [isClosing, setIsClosing] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [reviewerName, setReviewerName] = useState("");
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!rating || !restaurant) return;

    if (!restaurant.id) {
      alert("Erro: ID do restaurante não encontrado");
      return;
    }

    const restaurantId =
      typeof restaurant.id === "number"
        ? restaurant.id
        : parseInt(restaurant.id as any, 10);

    if (isNaN(restaurantId)) {
      alert("Erro: ID do restaurante inválido");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          restaurant_id: restaurantId,
          rating,
          opinion: reviewText.trim() || null,
        }),
      });

      if (!response.ok) {
        throw new Error("Erro ao marcar visita");
      }

      setRating(0);
      setReviewText("");
      setReviewerName("");
      setIsDrawerOpen(false);

      onVisitMarked?.();

      alert("Visita marcada com sucesso!");
    } catch (error) {
      console.error("Erro ao marcar visita:", error);
      alert("Erro ao marcar visita. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

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
      // Não ativa dragging imediatamente, espera o movimento
    }
  };

  const handleTouchMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (!scrollContainerRef.current) return;

    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
    const diff = clientY - startY;

    // Se ainda não está em modo drag, verifica se deve iniciar
    if (
      !isDragging &&
      startY !== 0 &&
      scrollContainerRef.current.scrollTop === 0
    ) {
      // Só ativa drag se o movimento for claramente para baixo (mais de 5px)
      if (diff > 5) {
        setIsDragging(true);
      }
      // Se tentar scrollar para cima, cancela o potencial drag
      if (diff < -5) {
        setStartY(0);
        return;
      }
    }

    // Se está em modo drag, continua
    if (isDragging && diff > 0) {
      setDragY(diff);
      e.preventDefault();
    }
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;

    const screenHeight = window.innerHeight;

    if (dragY > screenHeight * 0.5) {
      onClose();
    }

    setDragY(0);
    setIsDragging(false);
  };

  const handleClose = () => {
    setIsClosing(true);
    setDragY(window.innerHeight);

    setTimeout(() => {
      onClose();
      setIsClosing(false);
      setDragY(0);
    }, 300);
  };

  if (!restaurant) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center">
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
        className={`relative w-full max-w-md h-[90vh] bg-transparent flex flex-col shadow-2xl ${
          isDragging ? "select-none" : ""
        }`}
        style={{
          transform: `translateY(${dragY}px)`,
          transition: isDragging ? "none" : "transform 0.3s ease-out",
        }}
      >
        {/* Conteúdo com Scroll */}
        <div
          ref={scrollContainerRef}
          className="overflow-y-auto flex-1 scrollbar-hide [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] overscroll-contain"
          style={{ overscrollBehavior: "contain" }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleTouchStart}
          onMouseMove={handleTouchMove}
          onMouseUp={handleTouchEnd}
          onMouseLeave={handleTouchEnd}
        >
          {/* Imagem do Restaurante */}
          <div className="relative w-full h-72 shrink-0 rounded-t-3xl overflow-hidden">
            {/* Indicador de Drag */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 z-30">
              <div className="w-10 h-1 bg-white/60 rounded-full" />
            </div>

            {/* Botão Fechar */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 z-30 p-2 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>

            <img
              src={
                restaurant.image_url ||
                `https://picsum.photos/seed/${restaurant.name}/800/600`
              }
              alt={restaurant.name}
              className="w-full h-full object-cover"
            />
            {/* Gradiente na parte inferior da imagem */}
            <div className="absolute bottom-0 left-0 right-0 h-20 bg-linear-to-t from-white/60 to-transparent pointer-events-none" />
          </div>

          {/* Informações do Restaurante - Card Branco Único */}
          <div className="bg-white rounded-t-3xl -mt-12 relative z-10 min-h-[calc(100vh-14rem)]">
            <div className="px-6 pt-6 pb-16 space-y-5">
              {/* Nome do Restaurante */}
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {restaurant.name}
                </h1>
                <span className="inline-block rounded-full font-medium">
                  {restaurant.category}
                </span>
              </div>

              {/* Estatísticas */}
              <div className="">
                <div className="flex items-center gap-4 mb-3">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Heart
                        key={i}
                        className={`w-5 h-5 ${
                          i < restaurant.rating
                            ? "fill-red-500 text-red-500"
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
              <div className="">
                <h3 className="text-base font-bold text-gray-900 mb-1">
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
                              <Heart
                                key={i}
                                className={`w-3.5 h-3.5 ${
                                  i < review.rating
                                    ? "fill-red-500 text-red-500"
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

        {/* Botão Flutuante */}
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-60">
          <Button
            onClick={() => setIsDrawerOpen(true)}
            className="bg-red-400 hover:bg-red-600 rounded-full px-6 py-6 shadow-lg flex items-center gap-2 text-white font-semibold"
          >
            <MapPinCheck className="w-5 h-5" />
            Marcar visita
          </Button>
        </div>
      </div>

      {/* Drawer de Avaliação*/}
      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <DrawerContent className="max-w-md mx-auto">
          <DrawerHeader>
            <DrawerTitle>Deixe sua avaliação</DrawerTitle>
            <DrawerDescription>
              Descreva sua experiência em {restaurant.name}
            </DrawerDescription>
          </DrawerHeader>

          <form onSubmit={handleSubmit}>
            <div className="px-4 pb-4 space-y-4">
              {/* Nome do Avaliador */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Seu nome (opcional)
                </label>
                <Input
                  type="text"
                  placeholder="Digite seu nome"
                  value={reviewerName}
                  onChange={(e) => setReviewerName(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>

              {/* Rating com Corações */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Qual a sua nota? *
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star === rating ? 0 : star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="transition-transform hover:scale-110 cursor-pointer"
                      disabled={isSubmitting}
                    >
                      <Heart
                        className={`w-8 h-8 transition-colors ${
                          star <= (hoverRating || rating)
                            ? "fill-red-500 text-red-500"
                            : "text-gray-300"
                        }`}
                      />
                    </button>
                  ))}
                  {rating > 0 && (
                    <span className="text-sm text-gray-600 ml-2">
                      {rating} de 5 corações
                    </span>
                  )}
                </div>
              </div>

              {/* Comentário */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Deixe sua opinião (opcional)
                </label>
                <textarea
                  placeholder="Escreva sua experiência..."
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  rows={4}
                  disabled={isSubmitting}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                />
              </div>
            </div>

            <DrawerFooter>
              <Button
                type="submit"
                disabled={!rating || isSubmitting}
                className="bg-red-500 hover:bg-red-600 text-white w-full cursor-pointer"
              >
                <Stamp className="w-4 h-4" />
                {isSubmitting ? "Enviando..." : "Marcar visita"}
              </Button>
              <DrawerClose asChild>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full cursor-pointer"
                  disabled={isSubmitting}
                >
                  Cancelar
                </Button>
              </DrawerClose>
            </DrawerFooter>
          </form>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
