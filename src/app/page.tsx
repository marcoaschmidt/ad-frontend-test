"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import GameCard from "@/components/GameCard";
import LoadingSpinner from "@/components/LoadingSpinner";
import { GameService } from "@/services/gameService";
import type { Game } from "@/types/game";

export default function CatalogPage() {
  const [games, setGames] = useState<Game[]>([]);
  const [availableFilters, setAvailableFilters] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedGenre, setSelectedGenre] = useState("All");

  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const genreParam = searchParams.get("genre");
    const pageParam = searchParams.get("page");

    if (genreParam) {
      setSelectedGenre(genreParam);
    }
    if (pageParam) {
      setCurrentPage(Number.parseInt(pageParam));
    }
  }, [searchParams]);

  useEffect(() => {
    loadGames();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedGenre, currentPage]);

  const loadGames = async () => {
    try {
      setLoading(true);
      const response = await GameService.getGames(
        selectedGenre === "All" ? undefined : selectedGenre,
        currentPage
      );

      if (currentPage === 1) {
        setGames(response.games);
      } else {
        setGames((prev) => [...prev, ...response.games]);
      }

      setAvailableFilters(response.availableFilters);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error("Failed to load games:", error);
      if (currentPage === 1) {
        setGames([]);
        setAvailableFilters([]);
        setTotalPages(1);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGenreChange = (genre: string) => {
    setSelectedGenre(genre);
    setCurrentPage(1);
    setGames([]);

    const params = new URLSearchParams();
    if (genre !== "All") {
      params.set("genre", genre);
    }
    params.set("page", "1");

    router.push(`/?${params.toString()}`);
  };

  const handleSeeMore = () => {
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
  };

  return (
    <div className="bg-gray-50">
      <Header />
      <main className="min-h-screen max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <h1 className="sm:text-4xl text-2xl font-bold text-gray-900">
            Top Sellers
          </h1>
        </div>
        <div className="py-12 flex sm:justify-end justify-center">
          <div className="flex items-center">
            <label
              htmlFor="genre-select"
              className="text-xl font-semibold mb-[3px] border-r pr-6 border-gray-500 text-gray-700"
            >
              Genre
            </label>
            <select
              id="genre-select"
              value={selectedGenre}
              onChange={(e) => handleGenreChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  (e.target as HTMLSelectElement).click();
                }
              }}
              className="px-6 py-2 text-xl focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50 bg-gray-50"
              aria-label="Filter games by genre"
            >
              <option value="All">All</option>
              {availableFilters.map((filter) => (
                <option key={filter} value={filter}>
                  {filter}
                </option>
              ))}
            </select>
          </div>
        </div>

        {loading && currentPage === 1 ? (
          <LoadingSpinner />
        ) : games.length === 0 && !loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg mb-2">No games found for &quot;{selectedGenre}&quot;</p>
            <p className="text-gray-400 text-sm mb-4">
              Try selecting a different genre or check back later for new releases
            </p>
            <button
              onClick={() => handleGenreChange("All")}
              className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-3 rounded-md font-medium transition-colors"
            >
              View All Games
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {games.map((game) => (
                <GameCard key={game.id} game={game} />
              ))}
            </div>

            {currentPage < totalPages && (
              <div className="flex justify-start">
                <button
                  onClick={handleSeeMore}
                  disabled={loading}
                  className="bg-[#585660] hover:bg-gray-800 text-white px-6 py-4 rounded-lg font-medium transition-colors disabled:opacity-50"
                >
                  {loading ? "Loading..." : "SEE MORE"}
                </button>
              </div>
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
