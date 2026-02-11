"use client";

import { Home, Search, Plus, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Input } from "./ui/input";

export default function MobileNav() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Pesquisando por:", searchQuery);
  };

  return (
    <>
      {/* Overlay de pesquisa */}
      {searchOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSearchOpen(false)}
        />
      )}

      {/* Input de pesquisa */}
      {searchOpen && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-white shadow-lg p-4 md:hidden">
          <form onSubmit={handleSearch} className="flex items-center gap-2">
            <Input
              type="text"
              placeholder="Pesquisar restaurantes, cafés..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
              className="flex-1"
            />
            <button
              type="button"
              onClick={() => setSearchOpen(false)}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <X size={24} />
            </button>
          </form>
        </div>
      )}

      {/* Navegação inferior */}
      <nav className="fixed bottom-4 left-4 right-4 bg-white/80 backdrop-blur-lg border border-gray-200/50 md:hidden z-30 rounded-full shadow-lg">
        <div className="flex justify-around items-center h-16 px-2">
          {/* Home */}
          <Link
            href="/"
            className="flex flex-col items-center justify-center flex-1 h-full hover:bg-gray-100/50 rounded-full transition-all"
          >
            <Home size={24} className="text-gray-700" />
            <span className="text-xs text-gray-600 mt-1">Home</span>
          </Link>

          {/* Pesquisar */}
          <button
            onClick={() => setSearchOpen(true)}
            className="flex flex-col items-center justify-center flex-1 h-full hover:bg-gray-100/50 rounded-full transition-all"
          >
            <Search size={24} className="text-gray-700" />
            <span className="text-xs text-gray-600 mt-1">Pesquisar</span>
          </button>

          {/* Adicionar */}
          <Link
            href="/add-location"
            className="flex flex-col items-center justify-center flex-1 h-full hover:bg-gray-100/50 rounded-full transition-all"
          >
            <Plus size={24} className="text-gray-700" />
            <span className="text-xs text-gray-600 mt-1">Adicionar</span>
          </Link>
        </div>
      </nav>

      {/* Espaçamento para evitar que o conteúdo fique por baixo da navegação */}
      <div className="h-16 md:hidden" />
    </>
  );
}
